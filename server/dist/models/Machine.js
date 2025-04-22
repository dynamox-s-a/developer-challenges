"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machine = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const machineSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Pump', 'Fan'], required: true },
});
exports.Machine = mongoose_1.default.model('Machine', machineSchema);
