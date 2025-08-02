import express, { Request, Response } from "express";
import cors from "cors";
import { MachineFactory } from "./domain/MachineFactory.js";
import { MachineType, MonitoringPoint, SensorType } from "./types/types.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import UserRepositoryMemory from "./repository/UserRepositoryMemory.js";
import { AuthService } from "./service/AuthService.js";
import { MachineRepositoryMemory } from "./repository/MachineRepositoryMemory.js";
import { MonitoringPointRepositoryMemory } from "./repository/MonitoringPointRepositoryMemory.js";
import { PumpMonitoringPoint } from "./domain/PumpMonitoringPoint.js";
import { FanMonitoringPoint } from "./domain/FanMonitoringPoint.js";
import SaveNewMachine from "./useCase/SaveNewMachine.js";
import UpdateMachineType from "./useCase/UpdateMachineType.js";
import DeleteMachine from "./useCase/DeleteMachine.js";
import SaveNewMonitoringPoint from "./useCase/SaveNewMonitoringPoint.js";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

const app = express();

// CORS configuration for cookie-based authentication
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200 // For legacy browser support
}));

app.use(express.json());

// Create shared instances
const userRepository = new UserRepositoryMemory();
const authService = new AuthService(userRepository);
const machineRepository = new MachineRepositoryMemory();
const monitoringPointRepository = new MonitoringPointRepositoryMemory();
// Initialize use cases with dependencies
const saveNewMachine = new SaveNewMachine(machineRepository);
const updateMachineType = new UpdateMachineType(machineRepository, monitoringPointRepository);
const deleteMachine = new DeleteMachine(machineRepository, monitoringPointRepository);
const saveNewMonitoringPoint = new SaveNewMonitoringPoint(machineRepository, monitoringPointRepository);

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
        const machineId = await saveNewMachine.execute(userId, name, type);
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

// protected endpoint - delete a machine
app.delete("/api/machines/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "User not authenticated" });
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "Machine ID is required" });
        await deleteMachine.execute(userId, id);
        res.status(200).json({ message: "Machine deleted successfully" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: message });
    }
});

// protected endpoint - update machine type (and delete monitoring points)
app.put("/api/machines/:id/type", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "User not authenticated" });
        const { id } = req.params;
        const { type } = req.body;
        if (!id) return res.status(400).json({ error: "Machine ID is required" });
        if (!type || !["pump", "fan"].includes(type)) {
            return res.status(400).json({ error: "Valid machine type (pump or fan) is required" });
        }
        await updateMachineType.execute(userId, id, type);
        res.status(200).json({ message: "Machine type updated successfully. All monitoring points have been removed." });
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
    try {
        const monitoringPointId = await saveNewMonitoringPoint.execute(userId, machineId, name, sensorType);
        res.status(201).json({ id: monitoringPointId });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(400).json({ error: message });
    }
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
        res.cookie("token", token.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(401).json({ error: message });
    }
});

app.post("/api/register", async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                error: "Email, password, firstName and lastName are required"
            });
        }
        await authService.register(email, password, firstName, lastName);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});

// Get current user endpoint (protected)
app.get("/api/me", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "User not authenticated" });
        const user = await userRepository.findById(userId);
        console.log("🚀 ~ file: main.ts:179 ~ user:", user)
        if (!user) return res.status(404).json({ error: "User not found" });
        const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: "/assets/avatar.png"
        }
        console.log("🚀 ~ file: main.ts:181 ~ userData:", userData)
        res.status(200).json(userData);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: message });
    }
});

// Logout endpoint
app.post("/api/logout", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
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
