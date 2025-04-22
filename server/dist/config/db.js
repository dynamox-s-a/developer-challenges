"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToDatabase() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            dbName: 'Dynamox',
            ssl: true
        });
        console.log('🟢 Conecting to MongoDB Atlas');
    }
    catch (error) {
        console.error('🔴 MongoDB connection error:', error);
        process.exit(1);
    }
    mongoose_1.default.connection.on('connected', () => {
        console.log('✅ MongoDB connected!');
    });
    mongoose_1.default.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
    });
}
