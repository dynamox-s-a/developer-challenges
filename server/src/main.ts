import express, { Request, Response } from "express";
import { MachineFactory } from "./domain/MachineFactory.js";
import { MachineType } from "./types/types.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import UserRepositoryMemory from "./repository/UserRepositoryMemory.js";
import { AuthService } from "./service/AuthService.js";
import { MachineRepositoryMemory } from "./repository/MachineRepositoryMemory.js";

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

// protected endpoint
app.post("/api/machines", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
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
        machineRepository.save(machine.toJSON());
        res.status(201).json(machine.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});

// protected endpoint
app.get("/api/machines", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "User not authenticated" });
        res.json({
            message: "Get user machines endpoint - implementation pending",
            userId
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: message });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
