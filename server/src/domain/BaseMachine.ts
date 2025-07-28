import { v4 as uuidv4 } from "uuid";
import { MachineType, MachineBase } from "./types.js";

export abstract class BaseMachine implements MachineBase {
    protected readonly _userId: string;
    protected readonly _id: string;
    protected _name: string;
    protected _type: MachineType;

    protected constructor(userId: string, id: string, name: string, type: MachineType) {
        this._userId = userId;
        this._id = id;
        this._name = name;
        this._type = type;
    }

    static create(userId: string, name: string, type: MachineType): BaseMachine {
        throw new Error("create method must be implemented by subclasses");
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        if (!name || name.trim() === "") {
            throw new Error("Name cannot be empty");
        }
        this._name = name.trim();
    }

    get type(): MachineType {
        return this._type;
    }

    set type(type: MachineType) {
        this._type = type;
    }

    protected static generateId(): string {
        return uuidv4();
    }

    public toJSON(): MachineBase {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
        };
    }
} 