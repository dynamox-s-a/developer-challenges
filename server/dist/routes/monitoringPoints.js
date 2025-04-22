"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const monitoringPointsController_1 = __importDefault(require("../controllers/monitoringPointsController"));
const router = express_1.default.Router();
router.post('/', monitoringPointsController_1.default.create);
router.get('/', monitoringPointsController_1.default.listPaginated);
exports.default = router;
