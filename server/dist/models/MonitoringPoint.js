"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringPoint = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../utils/constants");
const monitoringPointSchema = new mongoose_1.default.Schema({
    machineId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sensor: {
        model: { type: String, required: true, enum: constants_1.VALID_SENSOR_MODELS },
        serialNumber: { type: String, required: true, unique: true },
    }
});
exports.MonitoringPoint = mongoose_1.default.model('MonitoringPoint', monitoringPointSchema);
