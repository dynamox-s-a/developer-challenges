import { Injectable } from "@nestjs/common";
import { IHashService } from "./IHash.interface";
import bcrypt from "bcrypt";

@Injectable()
export class BcryptService implements IHashService {
    private readonly saltRound = 10;

    async hash(payload: string): Promise<string> {
        return await bcrypt.hash(payload, this.saltRound)
    }

    async compare(payload: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(payload, hashed);
    }
}