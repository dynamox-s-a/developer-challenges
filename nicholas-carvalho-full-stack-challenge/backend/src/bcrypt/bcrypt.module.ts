import { Module } from "@nestjs/common";
import { BcryptService } from "./bcrypt.service";

@Module({
    providers: [{
        provide: 'HashService',
        useClass: BcryptService
    }],
    exports: ['HashService']
})
export class BCryptModule { }