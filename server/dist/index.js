"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const machines_1 = __importDefault(require("./routes/machines"));
const monitoringPoints_1 = __importDefault(require("./routes/monitoringPoints"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.connectToDatabase)();
app.use('/api/auth', authRoutes_1.default);
app.use('/api/machines', machines_1.default);
app.use('/api/monitoring-points', monitoringPoints_1.default);
const clientBuildPath = path_1.default.join(__dirname, '..', '..', 'client', 'dist');
app.use(express_1.default.static(clientBuildPath));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
