import { v4 as uuidv4 } from "uuid";

export default class UserRepositoryMemory {
    private users: User[] = [{
        id: "1",
        email: "sofia@devias.io",
        passwordHash: "Secret1"
    }];

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    async create(user: User): Promise<void> {
        this.users.push(user);
    }

    // for testing purposes ONLY
    async clear(): Promise<void> {
        this.users = [];
    }
}

export class User {
    id: string;
    constructor(public email: string, public passwordHash: string) {
        if (!email || !passwordHash) {
            throw new Error("Email and password are required");
        }
        this.id = uuidv4();
    }
}