export interface IHashService {
    hash(payload: string): Promise<string>;
    compare(payload: string, hashed: string): Promise<boolean>;
}