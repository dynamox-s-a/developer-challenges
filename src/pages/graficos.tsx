import React, { useEffect } from 'react';
import { CardContent, Typography, Box } from "@mui/material";
import { fetchAnotherSensorData } from '../store/sensor-slice';
import { AppDispatch, RootState } from '../store/configure-store';
import { useDispatch, useSelector } from 'react-redux';
import Cabecalho from '../components/cabecalho';
import GraficosComponent from '../components/graficos-component';

/**
 * @returns Folha de cabeçalho e implementação dos graficos 
 */
const Graficos: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const sensorData = useSelector((state: RootState) => state.sensor.data);

    useEffect(() => {
      dispatch(fetchAnotherSensorData());
    }, [dispatch]);

    /**
     * Filtro dos dados separando dados para os graficos
     */
    const accelerationData = sensorData.filter((d: any) => d.name.startsWith('accelerationRms'));
    const velocityData = sensorData.filter((d: any) => d.name.startsWith('velocityRms'));
    const temperatureData = sensorData.filter((d: any) => d.name === 'temperature');

    if (!sensorData || sensorData.length === 0) {
        return <div>Carregando...</div>;
      }

    return (
        <Box
            alignItems="center"
            flexDirection="column"
            marginTop="100px"
            marginBottom="20px"
            width="calc(100% - 40px)"
            maxWidth="1000px"
            bgcolor="#f8fafc"
            mx="auto"
        >
        <CardContent>
            <Box>
                <Box width="100%" bgcolor="#ffffff" marginBottom="16px">
                    <Typography variant="h6" gutterBottom marginLeft="10px">
                        Análise de dados
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                    justifyContent="space-around"
                    width="100%"
                    bgcolor="#ffffff"
                    marginBottom="16px">
                    <Cabecalho icone="settings" nome="Máquina 1023"></Cabecalho>
                    <Cabecalho icone="gps_fixed" nome="Ponto 20192"></Cabecalho>
                    <Cabecalho icone="refresh" nome="200"></Cabecalho>
                    <Cabecalho icone="show_chart" nome="16g"></Cabecalho>
                    <Cabecalho icone="history_toggle_off" nome="20 min"></Cabecalho>
                </Box>
                <Box marginBottom="16px" border="1px solid rgba(0, 0, 0, 0.3)" padding="16px">
                        <Typography variant="h6" gutterBottom>
                            Aceleração RMS
                        </Typography>
                        <GraficosComponent 
                            data={accelerationData} 
                            seriesLabels={accelerationData.map((d: any) => d.name)}
                        />
                </Box>
                <Box marginBottom="16px" border="1px solid rgba(0, 0, 0, 0.3)" padding="16px">
                    <Typography variant="h6" gutterBottom>
                        Temperatura
                    </Typography>
                    <GraficosComponent 
                        data={temperatureData} 
                        seriesLabels={temperatureData.map((d: any) => d.name)}
                    />
                </Box> 
                <Box marginBottom="16px" border="1px solid rgba(0, 0, 0, 0.3)" padding="16px">
                    <Typography variant="h6" gutterBottom>
                        Velocidade RMS
                    </Typography>
                    <GraficosComponent 
                        data={velocityData} 
                        seriesLabels={velocityData.map((d: any) => d.name)}
                    />
                </Box>
            </Box>
        </CardContent>
    </Box>
    );
}

export default Graficos;
