import { Sequelize, DataTypes } from "sequelize";
import db from "../db";

export default db.define("monitoring_point", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    machine_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull:false,
    }
});


