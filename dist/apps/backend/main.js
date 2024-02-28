/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(5);
const path_1 = __webpack_require__(6);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(7);
const users_module_1 = __webpack_require__(8);
const serve_static_1 = __webpack_require__(33);
const sensors_module_1 = __webpack_require__(34);
const sessions_module_1 = __webpack_require__(38);
const machines_module_1 = __webpack_require__(42);
const monitoring_points_module_1 = __webpack_require__(45);
// const rootPath =
//   process.env.NODE_ENV === 'development'
//     ? join(__dirname, '../../../apps/frontend/dist/')
//     : join(__dirname, '../../../frontend/dist/');
const rootPath = process.env.NODE_ENV === 'development'
    ? (0, path_1.join)(__dirname, '../../../dist/apps/frontend/')
    : (0, path_1.join)(__dirname, 'dist/apps/frontend/');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: __dirname,
                exclude: ['api/*'],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            users_module_1.UsersModule,
            sessions_module_1.SessionsModule,
            sensors_module_1.SensorsModule,
            machines_module_1.MachinesModule,
            monitoring_points_module_1.MonitoringPointsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const users_service_1 = __webpack_require__(9);
const passport_1 = __webpack_require__(28);
const jwt_strategy_1 = __webpack_require__(29);
const users_controller_1 = __webpack_require__(31);
const PrismaService_1 = __webpack_require__(16);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: "jwt" })],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, PrismaService_1.PrismaService, jwt_strategy_1.JwtStrategy],
    })
], UsersModule);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const bcryptjs_1 = __webpack_require__(10);
const prisma_1 = __webpack_require__(11);
const PrismaService_1 = __webpack_require__(16);
const dto_1 = __webpack_require__(17);
const dto_2 = __webpack_require__(17);
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(body) {
        const validation = dto_1.createUserDto.safeParse(body);
        if (!validation.success) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                data: validation.error.errors
            };
        }
        const data = validation.data;
        try {
            const checkUser = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (checkUser) {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    data: 'User already exists',
                };
            }
            const hashedPassword = await (0, bcryptjs_1.hash)(data.password, 10);
            const user = await this.prisma.user.create({ data: { ...data, password: hashedPassword } });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                data: user,
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async update(id, body) {
        const validation = dto_2.updateUserDto.safeParse(body);
        if (!validation.success) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                data: validation.error.errors
            };
        }
        const data = validation.data;
        const checkUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!checkUser) {
            return {
                statusCode: common_1.HttpStatus.NOT_FOUND,
                data: 'User not found',
            };
        }
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data,
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                data: {
                    name: user.name,
                    email: user.email,
                    id: user.id
                }
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof PrismaService_1.PrismaService !== "undefined" && PrismaService_1.PrismaService) === "function" ? _a : Object])
], UsersService);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(5);
tslib_1.__exportStar(__webpack_require__(12), exports);
tslib_1.__exportStar(__webpack_require__(14), exports);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prisma = void 0;
const client_1 = __webpack_require__(13);
exports.prisma = new client_1.PrismaClient();


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const library_1 = __webpack_require__(15);
const common_1 = __webpack_require__(1);
class PrismaError {
    constructor(error) {
        PrismaError.handle(error);
    }
    static handle(error) {
        if (error instanceof library_1.PrismaClientValidationError) {
            return { data: error.message, statusCode: common_1.HttpStatus.BAD_REQUEST };
        }
        else if (error instanceof library_1.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return { data: 'Content not found', statusCode: common_1.HttpStatus.NOT_FOUND };
            }
            return { data: error.message, statusCode: common_1.HttpStatus.BAD_REQUEST };
        }
        else if (error instanceof library_1.PrismaClientUnknownRequestError) {
            return { data: error.message, statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR };
        }
        else {
            console.error(error);
            return { data: 'Internal server error', statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR };
        }
    }
}
exports.PrismaError = PrismaError;


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@prisma/client/runtime/library");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const client_1 = __webpack_require__(13);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(5);
tslib_1.__exportStar(__webpack_require__(18), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(26), exports);
tslib_1.__exportStar(__webpack_require__(27), exports);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createUserDto = void 0;
const zod_1 = __webpack_require__(19);
exports.createUserDto = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: 'The email has to be filled' })
        .email('The email is not valid'),
    name: zod_1.z
        .string()
        .min(1),
    password: zod_1.z
        .string()
        .min(8, { message: 'The password has to be at least 8 characters long' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'The password must contain at least 1 lowercase letter, 1 uppercase letter and 1 number'),
});


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("zod");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateUserDto = void 0;
const create_user_dto_1 = __webpack_require__(18);
exports.updateUserDto = create_user_dto_1.createUserDto.partial();


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createSessionDto = void 0;
const zod_1 = __webpack_require__(19);
exports.createSessionDto = zod_1.z.object({
    email: zod_1.z
        .string()
        .email()
        .min(1, { message: 'The email has to be filled' }),
    password: zod_1.z
        .string()
        .min(1, { message: 'The password has to be filled' })
});


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createSensorDto = void 0;
const zod_1 = __webpack_require__(19);
exports.createSensorDto = zod_1.z.object({
    model: zod_1.z.union([
        zod_1.z.literal('TcAg'),
        zod_1.z.literal('TcAs'),
        zod_1.z.literal('HF+'),
    ]),
});


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateSensorDto = void 0;
const zod_1 = __webpack_require__(19);
exports.updateSensorDto = zod_1.z.object({
    model: zod_1.z.union([
        zod_1.z.literal('TcAg'),
        zod_1.z.literal('TcAs'),
        zod_1.z.literal('HF+'),
    ]),
});


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createMachineDto = void 0;
const zod_1 = __webpack_require__(19);
exports.createMachineDto = zod_1.z.object({
    name: zod_1.z.string(),
    type: zod_1.z.union([
        zod_1.z.literal('Pump'),
        zod_1.z.literal('Fan')
    ])
});


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateMachineDto = void 0;
const create_machine_dto_1 = __webpack_require__(24);
exports.updateMachineDto = create_machine_dto_1.createMachineDto.partial();


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createMonitoringPointDto = void 0;
const zod_1 = __webpack_require__(19);
exports.createMonitoringPointDto = zod_1.z.object({
    name: zod_1.z.string(),
    machineId: zod_1.z.number(),
    sensorId: zod_1.z.number(),
});


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateMonitoringPointDto = void 0;
const create_monitoring_point_dto_1 = __webpack_require__(26);
exports.updateMonitoringPointDto = create_monitoring_point_dto_1.createMonitoringPointDto.partial();


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const passport_jwt_1 = __webpack_require__(30);
const passport_1 = __webpack_require__(28);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            secretOrPrivateKey: process.env.JWT_SECRET,
        });
    }
    async validate(payload) {
        if (!payload.token_use || payload.token_use !== "access" || !payload.sub || !payload.username) {
            throw new common_1.BadRequestException("Invalid token");
        }
        return { userId: payload.sub, username: payload.username };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const express_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(28);
const own_guard_1 = __webpack_require__(32);
const users_service_1 = __webpack_require__(9);
const dto_1 = __webpack_require__(17);
const dto_2 = __webpack_require__(17);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(body, res) {
        const { statusCode, data } = await this.usersService.create(body);
        return res.status(statusCode).json(data);
    }
    async update(id, body, res) {
        const { statusCode, data } = await this.usersService.update(+id, body);
        return res.status(statusCode).json(data);
    }
};
exports.UsersController = UsersController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof dto_1.CreateUserDto !== "undefined" && dto_1.CreateUserDto) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), own_guard_1.OwnGuard),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_d = typeof dto_2.UpdateUserDto !== "undefined" && dto_2.UpdateUserDto) === "function" ? _d : Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
exports.UsersController = UsersController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OwnGuard = void 0;
const tslib_1 = __webpack_require__(5);
const passport_1 = __webpack_require__(28);
const common_1 = __webpack_require__(1);
let OwnGuard = class OwnGuard extends (0, passport_1.AuthGuard)("jwt") {
    constructor() {
        super();
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const id = +request.params.id;
        return user.userId === id && request.isAuthenticated();
    }
};
exports.OwnGuard = OwnGuard;
exports.OwnGuard = OwnGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], OwnGuard);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SensorsModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const sensors_service_1 = __webpack_require__(35);
const jwt_strategy_1 = __webpack_require__(29);
const sensors_controller_1 = __webpack_require__(36);
const PrismaService_1 = __webpack_require__(16);
let SensorsModule = class SensorsModule {
};
exports.SensorsModule = SensorsModule;
exports.SensorsModule = SensorsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [sensors_controller_1.SensorsController],
        providers: [sensors_service_1.SensorsService, PrismaService_1.PrismaService, jwt_strategy_1.JwtStrategy],
    })
], SensorsModule);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SensorsService = void 0;
const tslib_1 = __webpack_require__(5);
const dto_1 = __webpack_require__(17);
const prisma_1 = __webpack_require__(11);
const common_1 = __webpack_require__(1);
const PrismaService_1 = __webpack_require__(16);
let SensorsService = class SensorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(body) {
        const validation = dto_1.createSensorDto.safeParse(body);
        if (!validation.success) {
            if (validation.error.flatten().fieldErrors.model) {
                return {
                    statusCode: 400,
                    data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: ' + body.model
                };
            }
            else {
                return {
                    statusCode: 400,
                    data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+"'
                };
            }
        }
        const data = validation.data;
        try {
            const sensor = await this.prisma.sensor.create({
                data
            });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                data: sensor
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async findAll() {
        try {
            const sensors = await this.prisma.sensor.findMany();
            return {
                statusCode: common_1.HttpStatus.OK,
                data: sensors
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async findOne(id) {
        try {
            const sensor = await this.prisma.sensor.findUnique({
                where: { id }
            });
            if (!sensor) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    data: 'Sensor not found'
                };
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                data: sensor
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async update(id, body) {
        const validation = dto_1.updateSensorDto.safeParse(body);
        if (!validation.success) {
            if (validation.error.flatten().fieldErrors.model) {
                return {
                    statusCode: 400,
                    data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: ' + body.model
                };
            }
            else {
                return {
                    statusCode: 400,
                    data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+"'
                };
            }
        }
        const data = validation.data;
        try {
            const sensor = await this.prisma.sensor.update({
                where: { id },
                data
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                data: sensor
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async remove(id) {
        try {
            await this.prisma.sensor.delete({
                where: { id }
            });
            return {
                statusCode: common_1.HttpStatus.NO_CONTENT,
                data: 'Sensor deleted'
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
};
exports.SensorsService = SensorsService;
exports.SensorsService = SensorsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof PrismaService_1.PrismaService !== "undefined" && PrismaService_1.PrismaService) === "function" ? _a : Object])
], SensorsService);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SensorsController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const express_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(28);
const sensors_service_1 = __webpack_require__(35);
const authenticated_guard_1 = __webpack_require__(37);
const dto_1 = __webpack_require__(17);
let SensorsController = class SensorsController {
    constructor(sensorsService) {
        this.sensorsService = sensorsService;
    }
    async create(body, res) {
        const { statusCode, data } = await this.sensorsService.create(body);
        return res.status(statusCode).json(data);
    }
    async findAll(res) {
        const { statusCode, data } = await this.sensorsService.findAll();
        return res.status(statusCode).json(data);
    }
    async findOne(id, res) {
        const { statusCode, data } = await this.sensorsService.findOne(+id);
        return res.status(statusCode).json(data);
    }
    async update(id, body, res) {
        const { statusCode, data } = await this.sensorsService.update(+id, body);
        return res.status(statusCode).json(data);
    }
    async remove(id, res) {
        const { statusCode, data } = await this.sensorsService.remove(+id);
        return res.status(statusCode).json(data);
    }
};
exports.SensorsController = SensorsController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof dto_1.CreateSensorDto !== "undefined" && dto_1.CreateSensorDto) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SensorsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SensorsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SensorsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_f = typeof dto_1.UpdateSensorDto !== "undefined" && dto_1.UpdateSensorDto) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SensorsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SensorsController.prototype, "remove", null);
exports.SensorsController = SensorsController = tslib_1.__decorate([
    (0, common_1.Controller)('sensors'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), authenticated_guard_1.AuthenticatedGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof sensors_service_1.SensorsService !== "undefined" && sensors_service_1.SensorsService) === "function" ? _a : Object])
], SensorsController);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthenticatedGuard = void 0;
const tslib_1 = __webpack_require__(5);
const passport_1 = __webpack_require__(28);
const common_1 = __webpack_require__(1);
let AuthenticatedGuard = class AuthenticatedGuard extends (0, passport_1.AuthGuard)("jwt") {
    constructor() {
        super();
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated();
    }
};
exports.AuthenticatedGuard = AuthenticatedGuard;
exports.AuthenticatedGuard = AuthenticatedGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], AuthenticatedGuard);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SessionsModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(39);
const sessions_service_1 = __webpack_require__(40);
const PrismaService_1 = __webpack_require__(16);
const sessions_controller_1 = __webpack_require__(41);
let SessionsModule = class SessionsModule {
};
exports.SessionsModule = SessionsModule;
exports.SessionsModule = SessionsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [sessions_controller_1.SessionsController],
        providers: [sessions_service_1.SessionsService, PrismaService_1.PrismaService, jwt_1.JwtService],
    })
], SessionsModule);


/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SessionsService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const bcryptjs_1 = __webpack_require__(10);
const jwt_1 = __webpack_require__(39);
const prisma_1 = __webpack_require__(11);
const PrismaService_1 = __webpack_require__(16);
const dto_1 = __webpack_require__(17);
let SessionsService = class SessionsService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async create(body) {
        const validation = dto_1.createSessionDto.safeParse(body);
        if (!validation.success) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                data: 'Invalid credentials',
            };
        }
        const data = validation.data;
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            const validPassword = await (0, bcryptjs_1.compare)(data.password, user.password);
            if (!validPassword) {
                return {
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
                    data: 'Invalid credentials',
                };
            }
            const accessToken = this.jwtService.sign({
                sub: user.id,
                username: user.name,
                token_use: 'access',
            }, {
                expiresIn: '1d',
                secret: process.env.JWT_SECRET,
            });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                data: {
                    user,
                    accessToken,
                },
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof PrismaService_1.PrismaService !== "undefined" && PrismaService_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], SessionsService);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SessionsController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const express_1 = __webpack_require__(2);
const sessions_service_1 = __webpack_require__(40);
const dto_1 = __webpack_require__(17);
let SessionsController = class SessionsController {
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async create(body, res) {
        const { statusCode, data } = await this.sessionsService.create(body);
        return res.status(statusCode).json(data);
    }
};
exports.SessionsController = SessionsController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof dto_1.CreateSessionDto !== "undefined" && dto_1.CreateSessionDto) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SessionsController.prototype, "create", null);
exports.SessionsController = SessionsController = tslib_1.__decorate([
    (0, common_1.Controller)('sessions'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof sessions_service_1.SessionsService !== "undefined" && sessions_service_1.SessionsService) === "function" ? _a : Object])
], SessionsController);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MachinesModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const jwt_strategy_1 = __webpack_require__(29);
const machines_service_1 = __webpack_require__(43);
const PrismaService_1 = __webpack_require__(16);
const machines_controller_1 = __webpack_require__(44);
let MachinesModule = class MachinesModule {
};
exports.MachinesModule = MachinesModule;
exports.MachinesModule = MachinesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [machines_controller_1.MachinesController],
        providers: [machines_service_1.MachinesService, PrismaService_1.PrismaService, jwt_strategy_1.JwtStrategy],
    })
], MachinesModule);


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MachinesService = void 0;
const tslib_1 = __webpack_require__(5);
const dto_1 = __webpack_require__(17);
const common_1 = __webpack_require__(1);
const prisma_1 = __webpack_require__(11);
const PrismaService_1 = __webpack_require__(16);
let MachinesService = class MachinesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(body, userId) {
        const validation = dto_1.createMachineDto.safeParse(body);
        if (!validation.success) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                data: validation.error.issues.map(issue => `Invalid value for attribute '${issue.path[0]}' - Message: ${issue.message}`).join('\n')
            };
        }
        const data = validation.data;
        try {
            const machine = await this.prisma.machine.create({
                data: {
                    ...data,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                data: {
                    id: machine.id,
                    name: machine.name,
                    type: machine.type
                }
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async findAll(userId) {
        try {
            const machines = await this.prisma.machine.findMany({
                where: {
                    userId
                },
                select: {
                    id: true,
                    name: true,
                    type: true
                }
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                data: machines.map(machine => ({
                    id: machine.id,
                    name: machine.name,
                    type: machine.type
                }))
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async findOne(id, userId) {
        try {
            const machine = await this.prisma.machine.findFirst({
                where: {
                    id,
                    userId
                },
                select: {
                    id: true,
                    name: true,
                    type: true
                }
            });
            if (!machine) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    data: 'Machine not found'
                };
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                data: {
                    id: machine.id,
                    name: machine.name,
                    type: machine.type
                }
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async update(id, body, userId) {
        const validation = dto_1.updateMachineDto.safeParse(body);
        if (!validation.success) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                data: validation.error.issues.map(issue => `Invalid value for attribute '${issue.path[0]}' - Message: ${issue.message}`).join('\n')
            };
        }
        const data = validation.data;
        try {
            const machine = await this.prisma.machine.update({
                where: {
                    id,
                    userId
                },
                data: {
                    ...data
                }
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                data: {
                    id: machine.id,
                    name: machine.name,
                    type: machine.type
                }
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async remove(id, userId) {
        try {
            await this.prisma.machine.delete({
                where: {
                    id,
                    userId
                }
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                data: `Machine #${id} removed`
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
};
exports.MachinesService = MachinesService;
exports.MachinesService = MachinesService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof PrismaService_1.PrismaService !== "undefined" && PrismaService_1.PrismaService) === "function" ? _a : Object])
], MachinesService);


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MachinesController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const express_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(28);
const machines_service_1 = __webpack_require__(43);
const authenticated_guard_1 = __webpack_require__(37);
const dto_1 = __webpack_require__(17);
let MachinesController = class MachinesController {
    constructor(machinesService) {
        this.machinesService = machinesService;
    }
    async create(body, res, req) {
        const userId = req.user.userId;
        const { statusCode, data } = await this.machinesService.create(body, userId);
        return res.status(statusCode).json(data);
    }
    async findAll(res, req) {
        const userId = req.user.userId;
        const { statusCode, data } = await this.machinesService.findAll(userId);
        return res.status(statusCode).json(data);
    }
    async findOne(id, res, req) {
        const userId = req.user.userId;
        const { statusCode, data } = await this.machinesService.findOne(+id, userId);
        return res.status(statusCode).json(data);
    }
    async update(id, body, res, req) {
        const userId = req.user.userId;
        const { statusCode, data } = await this.machinesService.update(+id, body, userId);
        return res.status(statusCode).json(data);
    }
    async remove(id, res, req) {
        const userId = req.user.userId;
        const { statusCode, data } = await this.machinesService.remove(+id, userId);
        return res.status(statusCode).json(data);
    }
};
exports.MachinesController = MachinesController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof dto_1.CreateMachineDto !== "undefined" && dto_1.CreateMachineDto) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MachinesController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MachinesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MachinesController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__param(3, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_f = typeof dto_1.UpdateMachineDto !== "undefined" && dto_1.UpdateMachineDto) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MachinesController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MachinesController.prototype, "remove", null);
exports.MachinesController = MachinesController = tslib_1.__decorate([
    (0, common_1.Controller)('machines'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), authenticated_guard_1.AuthenticatedGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof machines_service_1.MachinesService !== "undefined" && machines_service_1.MachinesService) === "function" ? _a : Object])
], MachinesController);


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitoringPointsModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const jwt_strategy_1 = __webpack_require__(29);
const PrismaService_1 = __webpack_require__(16);
const monitoring_points_service_1 = __webpack_require__(46);
const monitoring_points_controller_1 = __webpack_require__(47);
let MonitoringPointsModule = class MonitoringPointsModule {
};
exports.MonitoringPointsModule = MonitoringPointsModule;
exports.MonitoringPointsModule = MonitoringPointsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [monitoring_points_controller_1.MonitoringPointsController],
        providers: [monitoring_points_service_1.MonitoringPointsService, PrismaService_1.PrismaService, jwt_strategy_1.JwtStrategy],
    })
], MonitoringPointsModule);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitoringPointsService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const prisma_1 = __webpack_require__(11);
const PrismaService_1 = __webpack_require__(16);
const dto_1 = __webpack_require__(17);
let MonitoringPointsService = class MonitoringPointsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(body) {
        const validation = dto_1.createMonitoringPointDto.safeParse(body);
        if (!validation.success) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                data: validation
                    .error
                    .issues
                    .map(issue => `Invalid value for attribute '${issue.path[0]}' - Message: ${issue.message}`).join('\n')
            };
        }
        const data = validation.data;
        try {
            const checkIfSensorExists = await this.prisma.sensor.findUnique({
                where: {
                    id: data.sensorId,
                },
            });
            if (!checkIfSensorExists) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    data: 'Sensor not found',
                };
            }
            const checkIfMachineExists = await this.prisma.machine.findUnique({
                where: {
                    id: data.machineId,
                },
            });
            if (!checkIfMachineExists) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    data: 'Machine not found',
                };
            }
            const checkIfSensorHaveBeenAssignedToMonitoringPoint = await this.prisma.monitoringPoint.findFirst({
                where: {
                    sensorId: data.sensorId,
                },
            });
            if (checkIfSensorHaveBeenAssignedToMonitoringPoint) {
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    data: 'Sensor already assigned to a monitoring point',
                };
            }
            const checkIfMonitoringPointExists = await this.prisma.monitoringPoint.findFirst({
                where: {
                    machineId: data.machineId,
                    sensorId: data.sensorId,
                },
            });
            if (checkIfMonitoringPointExists) {
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    data: 'Monitoring Point already exists',
                };
            }
            const monitoringPoint = await this.prisma.monitoringPoint.create({
                data: {
                    ...data,
                },
            });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                data: monitoringPoint,
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async findAll() {
        try {
            const monitoringPoints = await this.prisma.monitoringPoint.findMany();
            return {
                statusCode: common_1.HttpStatus.OK,
                data: monitoringPoints,
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async findOne(id) {
        try {
            const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
                where: {
                    id,
                },
            });
            if (!monitoringPoint) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    data: 'Monitoring Point not found',
                };
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                data: monitoringPoint,
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async update(id, body) {
        const validation = dto_1.updateMonitoringPointDto.safeParse(body);
        if (!validation.success) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                data: validation
                    .error
                    .issues
                    .map(issue => `Invalid value for attribute '${issue.path[0]}' - Message: ${issue.message}`).join('\n')
            };
        }
        const data = validation.data;
        try {
            const checkIfSensorExists = await this.prisma.sensor.findUnique({
                where: {
                    id: data.sensorId,
                },
            });
            if (!checkIfSensorExists) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    data: 'Sensor not found',
                };
            }
            const checkIfMachineExists = await this.prisma.machine.findUnique({
                where: {
                    id: data.machineId,
                },
            });
            if (!checkIfMachineExists) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    data: 'Machine not found',
                };
            }
            const checkIfSensorHaveBeenAssignedToMonitoringPoint = await this.prisma.monitoringPoint.findFirst({
                where: {
                    sensorId: data.sensorId,
                },
            });
            if (checkIfSensorHaveBeenAssignedToMonitoringPoint) {
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    data: 'Sensor already assigned to a monitoring point',
                };
            }
            const checkIfMonitoringPointExists = await this.prisma.monitoringPoint.findFirst({
                where: {
                    machineId: data.machineId,
                    sensorId: data.sensorId,
                },
            });
            if (checkIfMonitoringPointExists) {
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    data: 'Monitoring Point already exists',
                };
            }
            const monitoringPoint = await this.prisma.monitoringPoint.update({
                where: {
                    id,
                },
                data: {
                    ...data,
                },
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                data: monitoringPoint,
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
    async remove(id) {
        try {
            await this.prisma.monitoringPoint.delete({
                where: {
                    id,
                },
            });
            return {
                statusCode: common_1.HttpStatus.NO_CONTENT,
                data: 'Monitoring Point removed',
            };
        }
        catch (error) {
            return prisma_1.PrismaError.handle(error);
        }
    }
};
exports.MonitoringPointsService = MonitoringPointsService;
exports.MonitoringPointsService = MonitoringPointsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof PrismaService_1.PrismaService !== "undefined" && PrismaService_1.PrismaService) === "function" ? _a : Object])
], MonitoringPointsService);


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitoringPointsController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const express_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(28);
const authenticated_guard_1 = __webpack_require__(37);
const monitoring_points_service_1 = __webpack_require__(46);
const dto_1 = __webpack_require__(17);
let MonitoringPointsController = class MonitoringPointsController {
    constructor(monitoringPointsService) {
        this.monitoringPointsService = monitoringPointsService;
    }
    async create(body, res) {
        const { statusCode, data } = await this.monitoringPointsService.create(body);
        return res.status(statusCode).json(data);
    }
    async findAll(res) {
        const { statusCode, data } = await this.monitoringPointsService.findAll();
        return res.status(statusCode).json(data);
    }
    async findOne(id, res) {
        const { statusCode, data } = await this.monitoringPointsService.findOne(+id);
        return res.status(statusCode).json(data);
    }
    async update(id, body, res) {
        const { statusCode, data } = await this.monitoringPointsService.update(+id, body);
        return res.status(statusCode).json(data);
    }
    async remove(id, res) {
        const { statusCode, data } = await this.monitoringPointsService.remove(+id);
        return res.status(statusCode).json(data);
    }
};
exports.MonitoringPointsController = MonitoringPointsController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof dto_1.CreateMonitoringPointDto !== "undefined" && dto_1.CreateMonitoringPointDto) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MonitoringPointsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MonitoringPointsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MonitoringPointsController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_f = typeof dto_1.UpdateMonitoringPointDto !== "undefined" && dto_1.UpdateMonitoringPointDto) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MonitoringPointsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MonitoringPointsController.prototype, "remove", null);
exports.MonitoringPointsController = MonitoringPointsController = tslib_1.__decorate([
    (0, common_1.Controller)('monitoring-points'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), authenticated_guard_1.AuthenticatedGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof monitoring_points_service_1.MonitoringPointsService !== "undefined" && monitoring_points_service_1.MonitoringPointsService) === "function" ? _a : Object])
], MonitoringPointsController);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const express_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use((0, express_1.json)({ limit: "50mb" }));
    app.use((0, express_1.urlencoded)({ limit: "50mb", extended: true }));
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;