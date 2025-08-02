import express, { Request, Response } from "express";
import { MachineFactory } from "./domain/MachineFactory.js";
import { MachineType, MonitoringPoint, SensorType } from "./types/types.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import UserRepositoryMemory from "./repository/UserRepositoryMemory.js";
import { AuthService } from "./service/AuthService.js";
import { MachineRepositoryMemory } from "./repository/MachineRepositoryMemory.js";
import { MonitoringPointRepositoryMemory } from "./repository/MonitoringPointRepositoryMemory.js";
import { PumpMonitoringPoint } from "./domain/PumpMonitoringPoint.js";
import { FanMonitoringPoint } from "./domain/FanMonitoringPoint.js";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

const app = express();
app.use(express.json());

// Create shared instances
const userRepository = new UserRepositoryMemory();
const authService = new AuthService(userRepository);
const machineRepository = new MachineRepositoryMemory();
const monitoringPointRepository = new MonitoringPointRepositoryMemory();

// protected endpoint
app.post("/api/machines", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, type } = req.body;
        if (!name || !type) {
            return res.status(400).json({
                error: "Name and type are required"
            });
        }
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "User not authenticated" });
        const machine = MachineFactory.create(userId, name, type);
        const machineId = await machineRepository.save(machine.toJSON());
        res.status(201).json({ id: machineId });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});

// protected endpoint
app.get("/api/machines", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "User not authenticated" });
        const machines = await machineRepository.getByUserId(userId);
        res.json(machines);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: message });
    }
});

app.get("/api/monitoring-points", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "User not authenticated" });
    const monitoringPoints = await monitoringPointRepository.getByUserId(userId);
    res.status(200).json(monitoringPoints);
});

app.post("/api/monitoring-points", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "User not authenticated" });
    const { name, sensorType, machineId } = req.body;
    if (!name || !sensorType || !machineId) {
        return res.status(400).json({ error: "Name, sensorType and machineId are required" });
    }
    // create a monitoring point according to the sensor type
    let monitoringPoint: MonitoringPoint;
    switch (sensorType) {
        case SensorType.TcAg:
            monitoringPoint = PumpMonitoringPoint.create(userId, machineId, name, sensorType);
            break;
        case SensorType.TcAs:
            monitoringPoint = FanMonitoringPoint.create(userId, machineId, name, sensorType);
            break;
        default:
            return res.status(400).json({ error: "Invalid sensor type" });
    }
    const monitoringPointId = await monitoringPointRepository.save(monitoringPoint);
    res.status(201).json({ id: monitoringPointId });
});

// protected endpoint -> delete a monitoring point by sensorId
app.delete("/api/monitoring-points/sensor-id/:sensorId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "User not authenticated" });
    const { sensorId } = req.params;
    try {
        const monitoringPoints = await monitoringPointRepository.getByUserId(userId);
        const monitoringPointToDelete = monitoringPoints.find(point => point.sensorId === sensorId);
        if (!monitoringPointToDelete) return res.status(404).json({ error: "Monitoring point not found" });
        await monitoringPointRepository.deleteBySensorId(sensorId);
        res.status(200).json({ message: "Monitoring point deleted" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});

// protected endpoint -> delete all monitoring points by machineId
app.delete("/api/monitoring-points/machine-id/:machineId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "User not authenticated" });
    const { machineId } = req.params;
    try {
        const monitoringPoints = await monitoringPointRepository.getByUserId(userId);
        const monitoringPointToDelete = monitoringPoints.find(point => point.machineId === machineId);
        if (!monitoringPointToDelete) return res.status(404).json({ error: "Monitoring points not found" });
        await monitoringPointRepository.deleteByMachineId(machineId);
        res.status(200).json({ message: "Monitoring points deleted" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});

app.post("/api/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }
        const token = await authService.login(email, password);
        res.cookie("token", token.token, { httpOnly: true, secure: true, maxAge: 3600000 });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(401).json({ error: message });
    }
});

app.post("/api/register", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }
        await authService.register(email, password);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});

// for testing purposes ONLY. Never expose this endpoint in production.
app.get("/api/clear", (_req: Request, res: Response) => {
    userRepository.clear();
    machineRepository.clear();
    res.status(200).json({ message: "Database cleared" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
