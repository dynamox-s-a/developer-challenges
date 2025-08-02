import UserRepositoryMemory, { User } from "../repository/UserRepositoryMemory";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

export interface AuthResult {
    token: string;
}

export class AuthService {
    private userRepository: UserRepositoryMemory;

    constructor(userRepository: UserRepositoryMemory) {
        this.userRepository = userRepository;
    }

    async register(email: string, password: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error("User already exists");
        const passwordHash = await bcrypt.hash(password, 10);
        try {
            const user = new User(email, passwordHash);
            await this.userRepository.create(user);
        } catch (error) {
            throw new Error("Failed to register user");
        }
    }

    async login(email: string, password: string): Promise<AuthResult> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) throw new Error("Invalid credentials");
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        return { token };
    }
}
