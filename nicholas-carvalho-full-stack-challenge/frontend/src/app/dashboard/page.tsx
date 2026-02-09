"use client";

import { Container } from "@mui/material";
import { TablePoints } from "../component/TablePoints";
import SensorDataGraph from "../component/SensorDataGraph";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { SensorDataService } from "../api/sensorData";
import { useEffect } from "react";
import { SensorData } from "../types/sensorData";
import { setSensorDataLoading, setSensorsData } from "../redux/slices/sensorDataSlice";
import Header from "../component/Header";

export default function page() {
    const dispatch = useAppDispatch();
    const { items, isLoading } = useAppSelector(state => state.sensorData);
    const { selectedSensorId } = useAppSelector(state => state.sensor);
    const sensorDataService = new SensorDataService();
    async function fetchData() {
        try {
            dispatch(setSensorDataLoading(true));
            const sensors = await sensorDataService.getManySensorDataById(selectedSensorId);
            dispatch(setSensorsData({ items: sensors, isLoading: false }));

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [dispatch, selectedSensorId]);
    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, py: 4, minHeight: "100vh" }}>
            <Header />
            <TablePoints />
            <SensorDataGraph data={items} />
        </Container>
    );
}