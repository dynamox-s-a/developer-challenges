"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const machinesController_1 = __importDefault(require("../controllers/machinesController"));
const router = express_1.default.Router();
router.get('/', machinesController_1.default.listAllMachines);
router.post('/', machinesController_1.default.registerMachine);
router.put('/:id', machinesController_1.default.editMachine);
router.delete('/:id', machinesController_1.default.deleteMachine);
exports.default = router;
