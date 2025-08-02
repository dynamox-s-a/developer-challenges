import { v4 as uuidv4 } from "uuid";

export default class UserRepositoryMemory {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    async findById(id: string): Promise<User | undefined> {
        console.log(this.users);
        return this.users.find(user => user.id === id);
    }

    async create(user: User): Promise<void> {
        this.users.push(user);
        console.log(this.users);
    }

    // for testing purposes ONLY
    async clear(): Promise<void> {
        this.users = [];
    }
}

export class User {
    id: string;
    firstName: string;
    lastName: string;

    constructor(public email: string, public passwordHash: string, firstName: string, lastName: string) {
        if (!email || !passwordHash) {
            throw new Error("Email and password are required");
        }
        this.id = uuidv4();
        this.firstName = firstName;
        this.lastName = lastName;
    }
}