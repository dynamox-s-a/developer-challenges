import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/user";
import machineReducer from "@/features/machine";
import monitoringPointReducer from "@/features/monitoringPoint";

const store = configureStore({
    reducer: {
        user: userReducer,
        machine: machineReducer,
        monitoringPoint: monitoringPointReducer
    }
});

export default store;