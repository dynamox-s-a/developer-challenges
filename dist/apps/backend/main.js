/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const common_2 = __webpack_require__(3);
const express_1 = __importDefault(__webpack_require__(6));
const cors_1 = __importDefault(__webpack_require__(7));
const db_1 = __importDefault(__webpack_require__(8));
const machineRoutes_1 = __importDefault(__webpack_require__(10));
const monitoringRoutes_1 = __importDefault(__webpack_require__(19));
const sensorRoutes_1 = __importDefault(__webpack_require__(23));
const authRoutes_1 = __importDefault(__webpack_require__(24));
const authMiddleware_1 = __webpack_require__(17);
async function bootstrap() {
    // Conecta ao banco de dados MongoDB
    (0, db_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    // Habilita CORS para permitir que o front-end se comunique com o back-end
    app.enableCors({
        origin: 'http://localhost:4200', // Especifique explicitamente a origem permitida
        credentials: false, // Permite envio de cookies/credenciais
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    // Define um prefixo global para as rotas da API
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    // Aplica a validação global usando o ValidationPipe
    app.useGlobalPipes(new common_1.ValidationPipe());
    // Middleware do Express para JSON e CORS
    expressApp.use((0, cors_1.default)()); // Usando cors de maneira correta
    expressApp.use(express_1.default.json());
    // Rotas de autenticação
    expressApp.use('/api/auth', authRoutes_1.default);
    // Rotas de máquinas, monitoramentos e sensores
    expressApp.use('/api/machines', machineRoutes_1.default);
    expressApp.use('/api/machines/:id/monitorings', authMiddleware_1.protect, monitoringRoutes_1.default);
    expressApp.use('/api/machines/:id/monitorings/:monitoringId/sensors', authMiddleware_1.protect, sensorRoutes_1.default);
    // Define a porta 5000 para rodar o servidor
    const port = process.env.PORT || 5000;
    await app.listen(port);
    common_2.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const serve_static_1 = __webpack_require__(4);
const path_1 = __webpack_require__(5);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'frontend'), // Caminho para o build do frontend
            }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("cors");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(9));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    }
    catch (error) { // Adicionando 'any' para tratar erro
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports["default"] = connectDB;


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(6));
const machineController_1 = __webpack_require__(11);
const authMiddleware_1 = __webpack_require__(17);
const router = express_1.default.Router();
router.route("/").get(authMiddleware_1.protect, machineController_1.getMachines).post(authMiddleware_1.protect, machineController_1.createMachine);
router
    .route("/:id")
    .get(authMiddleware_1.protect, machineController_1.getMachineById)
    .put(authMiddleware_1.protect, machineController_1.updateMachine)
    .delete(authMiddleware_1.protect, machineController_1.deleteMachine);
exports["default"] = router;


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateMachine = exports.getMachineById = exports.deleteMachine = exports.createMachine = exports.getMachines = void 0;
const express_async_handler_1 = __importDefault(__webpack_require__(12));
const machineModel_1 = __importDefault(__webpack_require__(13));
const monitoringModel_1 = __importDefault(__webpack_require__(14));
const sensorModel_1 = __importDefault(__webpack_require__(15));
// @desc Get all machines
// @route GET /api/machines
// @access Private
const getMachines = (0, express_async_handler_1.default)(async (req, res) => {
    const machines = await machineModel_1.default.find({});
    res.json(machines);
});
exports.getMachines = getMachines;
// @desc Create a machine
// @route POST /api/machines
// @access Private
const createMachine = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, type, status } = req.body;
    // Validação do tipo
    const validTypes = ["Bomba", "Ventilador"];
    if (!validTypes.includes(type)) {
        res.status(400);
        throw new Error('Tipo de máquina inválido. Selecione entre "Bomba" ou "Ventilador".');
    }
    const machine = new machineModel_1.default({ name, type, status });
    const createdMachine = await machine.save();
    res.status(201).json(createdMachine);
});
exports.createMachine = createMachine;
// @desc Delete a machine and all its monitorings and sensors
// @route DELETE /api/machines/:id
// @access Private
const deleteMachine = (0, express_async_handler_1.default)(async (req, res) => {
    const machine = await machineModel_1.default.findById(req.params.id);
    if (!machine) {
        res.status(404);
        throw new Error('Machine not found');
    }
    // Encontre todos os monitoramentos relacionados à máquina
    const monitorings = await monitoringModel_1.default.find({ machine: req.params.id });
    for (const monitoring of monitorings) {
        // Exclua todos os sensores relacionados a cada monitoramento
        await sensorModel_1.default.deleteMany({ monitoring: monitoring._id });
        // Exclua o monitoramento
        await monitoringModel_1.default.deleteOne({ _id: monitoring._id });
    }
    // Por fim, exclua a máquina
    await machineModel_1.default.deleteOne({ _id: req.params.id });
    res.json({ message: 'Machine and all related data removed' });
});
exports.deleteMachine = deleteMachine;
// @desc Get a machine by ID
// @route GET /api/machines/:id
// @access Private
const getMachineById = (0, express_async_handler_1.default)(async (req, res) => {
    const machine = await machineModel_1.default.findById(req.params.id);
    if (machine) {
        res.json(machine);
    }
    else {
        res.status(404);
        throw new Error('Machine not found');
    }
});
exports.getMachineById = getMachineById;
// @desc Update a machine
// @route PUT /api/machines/:id
// @access Private
const updateMachine = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, type, status } = req.body;
    const machine = await machineModel_1.default.findById(req.params.id);
    if (machine) {
        // Validação do tipo
        const validTypes = ["Bomba", "Ventilador"];
        if (!validTypes.includes(type)) {
            res.status(400);
            throw new Error('Tipo de máquina inválido. Selecione entre "Bomba" ou "Ventilador".');
        }
        machine.name = name;
        machine.type = type;
        machine.status = status;
        const updatedMachine = await machine.save();
        res.json(updatedMachine);
    }
    else {
        res.status(404);
        throw new Error('Machine not found');
    }
});
exports.updateMachine = updateMachine;


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("express-async-handler");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importStar(__webpack_require__(9));
const machineSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // Adicionado campo "type"
    status: { type: String, required: true },
}, { timestamps: true });
const MachineModel = mongoose_1.default.model("Machine", machineSchema);
exports["default"] = MachineModel;


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(9));
const monitoringSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true, // Propriedade 'type' que será usada para o tipo do modelo de sensor
    },
    machine: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true,
    },
}, {
    timestamps: true,
});
const Monitoring = mongoose_1.default.model('Monitoring', monitoringSchema);
exports["default"] = Monitoring;


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importStar(__webpack_require__(9));
const uuid_1 = __webpack_require__(16);
const sensorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    uniqueId: { type: String, default: uuid_1.v4, unique: true },
    monitoring: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Monitoring', required: true },
}, { timestamps: true });
const Sensor = mongoose_1.default.model('Sensor', sensorSchema);
exports["default"] = Sensor;


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(__webpack_require__(18));
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtém o token do header
            token = req.headers.authorization.split(' ')[1];
            // Decodifica o token para obter o payload
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Adiciona o ID do usuário ao objeto de request
            req.user = decoded.id;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        if (!token) {
            res.status(401).json({ message: 'Not authorized, no token' });
        }
    }
};
exports.protect = protect;


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(6));
const monitoringController_1 = __webpack_require__(20);
const sensorController_1 = __webpack_require__(22); // Importe as funções para sensores
const authMiddleware_1 = __webpack_require__(17);
const router = express_1.default.Router({ mergeParams: true });
router
    .route("/")
    .get(authMiddleware_1.protect, monitoringController_1.getMonitoringsForMachine)
    .post(authMiddleware_1.protect, monitoringController_1.addMonitoring);
router
    .route("/:monitoringId")
    .get(authMiddleware_1.protect, monitoringController_1.getMonitoringById)
    .put(authMiddleware_1.protect, monitoringController_1.updateMonitoring)
    .delete(authMiddleware_1.protect, monitoringController_1.deleteMonitoring);
router
    .route("/:monitoringId/sensors") // Rota para sensores dentro de um monitoramento
    .get(authMiddleware_1.protect, sensorController_1.getSensorsForMonitoring)
    .post(authMiddleware_1.protect, sensorController_1.addSensor);
exports["default"] = router;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateMonitoring = exports.getMonitoringById = exports.deleteMonitoring = exports.addMonitoring = exports.getMonitoringsForMachine = void 0;
const express_async_handler_1 = __importDefault(__webpack_require__(12));
const machineModel_1 = __importDefault(__webpack_require__(13));
const monitoringModel_1 = __importDefault(__webpack_require__(14));
const sensorModel_1 = __importDefault(__webpack_require__(15));
const axios_1 = __importDefault(__webpack_require__(21));
// @desc Get all monitorings for a specific machine
// @route GET /api/monitorings/:machineId
// @access Private
const getMonitoringsForMachine = (0, express_async_handler_1.default)(async (req, res) => {
    const machineId = req.params.id; // Use 'id' se for assim que está na rota
    const monitorings = await monitoringModel_1.default.find({ machine: machineId });
    if (monitorings.length > 0) {
        res.json(monitorings);
    }
    else {
        res.status(404);
        throw new Error("No monitorings found for this machine");
    }
});
exports.getMonitoringsForMachine = getMonitoringsForMachine;
// @desc Add a monitoring
// @route POST /api/machines/:machineId/monitorings
// @access Private
const addMonitoring = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { name, type } = req.body; // Usando 'type' em vez de 'sensorModel'
        const machineId = req.params.id;
        const machine = await machineModel_1.default.findById(machineId).lean();
        if (!machine) {
            res.status(404);
            throw new Error("Machine not found");
        }
        console.log("Tipo da Máquina:", machine.type);
        // Verifica se o modelo de sensor é permitido para o tipo de máquina
        if (machine.type === "Bomba" && (type === "TcAg" || type === "TcAs")) {
            res.status(400);
            throw new Error("Sensores 'TcAg' e 'TcAs' não podem ser associados a máquinas do tipo 'Bomba'");
        }
        const monitoring = new monitoringModel_1.default({
            name,
            type, // Salva o tipo de sensor como 'type'
            machine: machineId,
        });
        const createdMonitoring = await monitoring.save();
        res.status(201).json(createdMonitoring);
    }
    catch (error) {
        const typedError = error;
        if (axios_1.default.isAxiosError(typedError)) {
            console.error("Erro ao criar monitoramento:", typedError.response?.data || typedError.message);
        }
        else {
            console.error("Erro desconhecido:", typedError);
            res.status(500).json({ message: "Erro ao criar monitoramento" });
        }
    }
});
exports.addMonitoring = addMonitoring;
// @desc Delete a monitoring and its associated sensors
// @route DELETE /api/machines/:machineId/monitorings/:monitoringId
// @access Private
const deleteMonitoring = (0, express_async_handler_1.default)(async (req, res) => {
    const monitoringId = req.params.monitoringId;
    // Exclui todos os sensores associados ao monitoramento
    await sensorModel_1.default.deleteMany({ monitoring: monitoringId });
    // Exclui o próprio monitoramento
    const monitoring = await monitoringModel_1.default.findById(monitoringId);
    if (monitoring) {
        await monitoringModel_1.default.deleteOne({ _id: monitoringId }); // Usando deleteOne para excluir
        res.json({ message: "Monitoring and its sensors removed" });
    }
    else {
        res.status(404);
        throw new Error("Monitoring not found");
    }
});
exports.deleteMonitoring = deleteMonitoring;
// Função para buscar o monitoramento por ID
const getMonitoringById = (0, express_async_handler_1.default)(async (req, res) => {
    const monitoring = await monitoringModel_1.default.findById(req.params.monitoringId);
    if (monitoring) {
        res.json(monitoring);
    }
    else {
        res.status(404);
        throw new Error('Monitoring not found');
    }
});
exports.getMonitoringById = getMonitoringById;
// @desc Update a monitoring
// @route PUT /api/machines/:machineId/monitorings/:monitoringId
// @access Private
const updateMonitoring = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, type } = req.body;
    const monitoringId = req.params.monitoringId;
    const monitoring = await monitoringModel_1.default.findById(monitoringId);
    if (monitoring) {
        monitoring.name = name || monitoring.name;
        monitoring.type = type || monitoring.type;
        const updatedMonitoring = await monitoring.save();
        res.json(updatedMonitoring);
    }
    else {
        res.status(404);
        throw new Error("Monitoring not found");
    }
});
exports.updateMonitoring = updateMonitoring;


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateSensor = exports.getSensorById = exports.deleteSensor = exports.addSensor = exports.getSensorsForMonitoring = void 0;
const express_async_handler_1 = __importDefault(__webpack_require__(12));
const sensorModel_1 = __importDefault(__webpack_require__(15));
const monitoringModel_1 = __importDefault(__webpack_require__(14));
// @desc Get all sensors for a specific monitoring
// @route GET /api/monitorings/:monitoringId/sensors
// @access Private
const getSensorsForMonitoring = (0, express_async_handler_1.default)(async (req, res) => {
    const sensors = await sensorModel_1.default.find({ monitoring: req.params.monitoringId });
    if (sensors) {
        res.json(sensors);
    }
    else {
        res.status(404);
        throw new Error('No sensors found for this monitoring');
    }
});
exports.getSensorsForMonitoring = getSensorsForMonitoring;
// @desc Add a sensor
// @route POST /api/monitorings/:monitoringId/sensors
// @access Private
const addSensor = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, status } = req.body;
    const monitoringId = req.params.monitoringId;
    // Verifica se o monitoramento existe
    const monitoring = await monitoringModel_1.default.findById(monitoringId);
    if (!monitoring) {
        res.status(404);
        throw new Error('Monitoring not found');
    }
    const sensor = new sensorModel_1.default({
        name,
        status,
        monitoring: monitoringId,
    });
    const createdSensor = await sensor.save();
    res.status(201).json(createdSensor);
});
exports.addSensor = addSensor;
// @desc Delete a sensor
// @route DELETE /api/machines/:machineId/monitorings/:monitoringId/sensors/:sensorId
// @access Private
const deleteSensor = (0, express_async_handler_1.default)(async (req, res) => {
    const sensor = await sensorModel_1.default.findById(req.params.sensorId);
    if (sensor) {
        await sensorModel_1.default.deleteOne({ _id: req.params.sensorId }); // Usando deleteOne para excluir
        res.json({ message: 'Sensor removed' });
    }
    else {
        res.status(404);
        throw new Error('Sensor not found');
    }
});
exports.deleteSensor = deleteSensor;
// Função para obter um sensor pelo ID
const getSensorById = (0, express_async_handler_1.default)(async (req, res) => {
    const sensor = await sensorModel_1.default.findById(req.params.sensorId);
    if (sensor) {
        res.json(sensor);
    }
    else {
        res.status(404);
        throw new Error('Sensor not found');
    }
});
exports.getSensorById = getSensorById;
// Função para atualizar um sensor
const updateSensor = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, status } = req.body; // Usando 'name' e 'status' como os únicos campos editáveis
    const sensor = await sensorModel_1.default.findById(req.params.sensorId);
    if (sensor) {
        sensor.name = name || sensor.name;
        sensor.status = status || sensor.status;
        const updatedSensor = await sensor.save();
        res.json(updatedSensor);
    }
    else {
        res.status(404);
        throw new Error('Sensor not found');
    }
});
exports.updateSensor = updateSensor;


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(6));
const sensorController_1 = __webpack_require__(22);
const authMiddleware_1 = __webpack_require__(17);
const router = express_1.default.Router({ mergeParams: true });
// Rota para obter todos os sensores e adicionar um novo sensor
router.route('/')
    .get(authMiddleware_1.protect, sensorController_1.getSensorsForMonitoring)
    .post(authMiddleware_1.protect, sensorController_1.addSensor);
// Rota para deletar um sensor específico
router.route('/:sensorId')
    .get(authMiddleware_1.protect, sensorController_1.getSensorById) // Adicione essa rota para buscar os dados do sensor
    .put(authMiddleware_1.protect, sensorController_1.updateSensor) // Adicione essa rota para atualizar o sensor
    .delete(authMiddleware_1.protect, sensorController_1.deleteSensor);
exports["default"] = router;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(6));
const authController_1 = __webpack_require__(25);
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
exports["default"] = router;


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(__webpack_require__(12));
const userModel_1 = __importDefault(__webpack_require__(26));
const jsonwebtoken_1 = __importDefault(__webpack_require__(18));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Por favor, forneça email e senha' });
        return;
    }
    let user = await userModel_1.default.findOne({ email });
    if (user) {
        res.status(400).json({ message: 'Usuário já existe' });
        return;
    }
    // A senha será automaticamente hasheada no `pre-save hook` do modelo de usuário
    user = new userModel_1.default({ email, password });
    await user.save();
    const token = generateToken(user.id);
    res.status(201).json({ token });
});
exports.loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Por favor, forneça email e senha' });
        return;
    }
    const user = await userModel_1.default.findOne({ email });
    if (!user) {
        res.status(400).json({ message: 'Credenciais inválidas' });
        return;
    }
    // Use o método `comparePassword` do modelo de usuário
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(400).json({ message: 'Credenciais inválidas' });
        return;
    }
    const token = generateToken(user.id);
    res.status(200).json({ token });
});


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importStar(__webpack_require__(9));
const bcryptjs_1 = __importDefault(__webpack_require__(27));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// Antes de salvar, hash da senha
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (err) {
        return next();
    }
});
// Método para comparar senhas
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model('User', UserSchema);
exports["default"] = User;


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("bcryptjs");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;