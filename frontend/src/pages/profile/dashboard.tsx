import React, { useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Box, Button, Card, CardActions, CardContent, Grid, IconButton, Modal, Typography, FormControl, InputLabel, Input, InputAdornment, Select, SelectChangeEvent, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ImageListItem } from "@mui/material";
import { List, Abc, Delete, Edit } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { updateMachine } from "@/features/machine";
import { updateMonitoringPoint } from "@/features/monitoringPoint";
import axios from "axios";

interface MonitoringPointListData {
    machineId: string;
    id: string;
    name: string;
    sensorName: string;
    imageSource: string;
  }

function createMonitoringPointListData(
    machineId: string,
    id: string,
    name: string,
    sensorName: string,
    imageSource: string,
  ): MonitoringPointListData {
    return {
      machineId,
      id,
      name,
      sensorName,
      imageSource
    };
  }

  

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 700,
    bgcolor: 'background.paper',
    border: '2px solid primary',
    boxShadow: 24,
    p: 4,
  };

export default function Dashboard() {
    //Redux variables
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.value);
    const machines = useSelector((state: any) => state.machine.value);
    const monitoringPoints = useSelector((state: any) => state.monitoringPoint.value);

    useEffect(() => {

        if(user.userId !== "") {
            renewStoreMachineVariables();
            renewStoreMonitoringPointsVariables();
        }
            
    }, []);

    useEffect(() => {
        setUserMachines(machines);
        renewMonitoringPointsLists();
    }, [monitoringPoints, machines]);

    const renewStoreMachineVariables = () => {
        //Request that gets all the user Machines
        const urlMachines = 'http://localhost:8000/machines/' + user.userId;

        axios
        .get(urlMachines)
        .then(response => {
            dispatch(updateMachine(response.data));
        })
        .catch((error) => {
            console.log(error);
            alert(error.response.data.message);                    
        });        
    }

    const renewStoreMonitoringPointsVariables = () => {
        //Request that gets all the user Monitoring Points   
        const urlMonitoringPoints = 'http://localhost:8000/monitoringPoints/' + user.userId;

        axios
        .get(urlMonitoringPoints)
        .then(response => {
            dispatch(updateMonitoringPoint(response.data));
            })
        .catch((error) => {
            console.log(error);
            alert(error.response.data.message);
        })
        
    }

    const renewMonitoringPointsLists = () => {
        let thisMonitoringPoints = [];

        monitoringPoints.map((monitoringPoint) => {
            let thisSensorImageUrl = "";
            switch(monitoringPoint.sensorName){ 
                case "HF+": 
                    thisSensorImageUrl = "/sensors/sensor-hf.png";
                break;   
                case "TcAg": 
                    thisSensorImageUrl = "/sensors/sensor-af.png";
                break;
                case "TcAs": 
                    thisSensorImageUrl = "/sensors/sensor-tca.png";
                break; 
                default: 
                break;   
                }
            thisMonitoringPoints.push(
                createMonitoringPointListData(monitoringPoint._machineId, monitoringPoint._id, monitoringPoint.name, monitoringPoint.sensorName, thisSensorImageUrl),
            )
        })

        setMonitoringPointRows(thisMonitoringPoints);
    }

    const [ userMachines, setUserMachines ] = React.useState(machines);
    const [ userMonitoringPoints, setUserMonitoringPoints ] = React.useState(monitoringPoints);
    const [ monitoringPointsByMachine, setMonitoringPointsByMachine ] = React.useState({});

    //Modal's variables
    const [ addMonitoringPointModal, setAddMonitoringPointModal ] = React.useState(false);
    const [ addMachineModal, setAddMachineModal ] = React.useState(false);
    const [ listMonitoringPointsModal, setListMonitoringPointsModal ] = React.useState(false);
    //Create new Monitoring Point variables
    const [ selectedMachineId, setSelectedMachineId] = React.useState("");
    const [ selectedMachineName, setSelectedMachineName] = React.useState("");
    const [ selectedMachineType, setSelectedMachineType] = React.useState("");
    const [ newMonitoringPointName, setNewMonitoringPointName] = React.useState("");
    const [ newMonitoringPointType, setNewMonitoringPointType] = React.useState("");
    //Create new Machine variables
    const [ isMachineUpdate, setIsMachineUpdate] = React.useState(false);
    const [ newMachineName, setNewMachineName] = React.useState("");
    const [ newMachineType, setNewMachineType] = React.useState("");
    //Select input variables
    const [ monitoringPointTypes, setMonitoringPointTypes] = React.useState(["TcAg", "TcAs", "HF+"]);
    const [ machineTypes, setMachineTypes] = React.useState(["Fan", "Pump"]);
    //Monitoring Point list variables
    const [ monitoringPointRows, setMonitoringPointRows] = React.useState([]);

    //State management variables
    //Monitoring Point creation
    const handleMonitoringPointOpen = (machineId: string, machineName: string, machineType: string) => {
        setSelectedMachineId(machineId);
        setSelectedMachineName(machineName);
        setSelectedMachineType(machineType);

        machineType === "Pump" ? setMonitoringPointTypes(["HF+"] ) : setMonitoringPointTypes(["TcAg", "TcAs", "HF+"]) ;

        setAddMonitoringPointModal(true);   
    }
    const handleMonitoringPointClose = () => setAddMonitoringPointModal(false);
    const handleNewMonitoringTypeChange = (event: SelectChangeEvent) => {
        setNewMonitoringPointType(event.target.value as string);
    }
    //Machine
    const handleMachineOpen = (isUpdate: boolean, machineId: string, machineName: string, machineType: string) => {
        setIsMachineUpdate(isUpdate);
        setSelectedMachineId(machineId);
        setSelectedMachineName(machineName);
        setSelectedMachineType(machineType);
        setNewMachineName(machineName);
        setNewMachineType(machineType);

        setAddMachineModal(true);
    }
    const handleMachineClose = () => setAddMachineModal(false);
    const handleNewMachineTypeChange = (event: SelectChangeEvent) => {
        setNewMachineType(event.target.value as string);
    }
    //Monitoring Point list
    const handleMonitoringPoingListOpen = (machineId: string, machineName: string, machineType: string) => {
        setSelectedMachineId(machineId);
        setSelectedMachineName(machineName);
        setSelectedMachineType(machineType);

        setListMonitoringPointsModal(true);   
    }

    const handleMonitoringPoingListClose = () => setListMonitoringPointsModal(false);

    //Functions for Monitoring Points Management
    //Create new Monitoring Point
    const handleCreateMonitoringPoint = () =>  {
        
        const url = "http://localhost:8000/monitoringPoints";

        axios
            .post(url, { "userId": user.userId, "machineId": selectedMachineId, "machineName": selectedMachineName, "machineType": selectedMachineType, "name": newMonitoringPointName, "sensorName": newMonitoringPointType, }, { headers: { "Content-Type": "application/json" }})
            .then(response => {
                renewStoreMonitoringPointsVariables();
                setNewMonitoringPointName("");
                setNewMonitoringPointType("");
                setAddMonitoringPointModal(false);
                alert("Adicionado com sucesso");
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.message);
            })
    }
    //Delete Monitoring Point
    const handleDeleteMonitoringPoint = (thisMonitoringPointId: string) =>  {
        
        const url = "http://localhost:8000/monitoringPoints/" + thisMonitoringPointId;

        axios
            .delete(url, { headers: { "Content-Type": "application/json" }})
            .then(response => {
                renewStoreMonitoringPointsVariables();
                alert("Deletado com sucesso");
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.message);
            })
    }
    

    //Functions for Machine Management
    //Create Machine
    const handleCreateMachine = () =>  {
        
        const url = (isMachineUpdate) ? "http://localhost:8000/machines/" + selectedMachineId : "http://localhost:8000/machines";

        (isMachineUpdate) ? 
            axios
                .put(url, { "userId": user.userId, "name": newMachineName, "type": newMachineType, }, { headers: { "Content-Type": "application/json" }})
                .then(response => {
                    renewStoreMachineVariables();
                    setNewMachineName("");
                    setNewMachineType("");
                    setAddMachineModal(false);
                    alert("Máquina atualizada com sucesso");
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.response.data.message);
                })
        :
            axios
                .post(url, { "userId": user.userId, "name": newMachineName, "type": newMachineType, }, { headers: { "Content-Type": "application/json" }})
                .then(response => {
                    renewStoreMachineVariables();
                    setNewMachineName("");
                    setNewMachineType("");
                    setAddMachineModal(false);
                    alert("Máquina adicionada com sucesso");
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.response.data.message);
                });
        
    }
    //Delete Machine
    const handleDeleteMachine = (thisMachineId: string) =>  {
        
        const url = "http://localhost:8000/machines/" + thisMachineId;

        axios
            .delete(url, { headers: { "Content-Type": "application/json" }})
            .then(response => {
                renewStoreMachineVariables();
                alert("Máquina deletada com sucesso");
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.message);
            })
    }

    const isMobile = false;

    return (
        <Box sx={{ display: "flex" }}>
            <Header></Header>
            { isMobile ? null : <Sidebar></Sidebar> }
            <Box component="main"  sx={{ flexGrow: 1, p: 3, marginTop: 7 }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h6">Minhas máquinas</Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleMachineOpen(false, "", "", "");
                            }}
                        >
                            Adicionar Máquina
                        </Button>
                    </Grid>
                </Grid>
                <Grid 
                    container 
                    spacing={{ sm: 1, md: 2 }} columns={{ sm: 12, md: 4 }}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        userMachines.length === 0 ? (
                            <Grid item>
                                <Typography>Procurando máquinas...</Typography>
                            </Grid>
                        ) : userMachines.map((machine: any) => {
                                return (
                                    <Grid item>
                                        <Card>
                                            <CardContent>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Grid item>
                                                        <Typography gutterBottom variant="h5" component="div">
                                                            { machine.name }
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton
                                                            aria-label="Editar máquina"
                                                            onClick={() => {
                                                                handleMachineOpen(true, machine._id, machine.name, machine.type);
                                                            }}
                                                        >
                                                            <Edit></Edit>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Grid item>
                                                        <Typography color="primary">
                                                            { machine.type }
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Grid
                                                            container
                                                            direction="row"
                                                            justifyContent="flex-end"
                                                            alignItems="center"
                                                        >
                                                            <Typography>
                                                                Pontos de monitoramento
                                                            </Typography>
                                                            <IconButton
                                                                aria-label="Listar pontos de monitoramento"
                                                                onClick={() => {
                                                                    handleMonitoringPoingListOpen(machine._id, machine.name, machine.type);
                                                                }}
                                                            >
                                                                <List></List>
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            <CardActions variant="align-right">
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        handleMonitoringPointOpen(machine._id, machine.name, machine.type);
                                                    }}
                                                >
                                                    Adicionar Ponto de Monitoramento
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        handleDeleteMachine(machine._id);
                                                    }}
                                                >
                                                    Deletar
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            }
                        )
                    }
                </Grid>
            </Box>
            <Modal
                open={addMonitoringPointModal}
                onClose={handleMonitoringPointClose}
                aria-labelledby="addMonitoringPointLabel"
                aria-describedby="addMonitoringPointDescription"
            >
                <Box sx={style}>
                  <Typography id="addMonitoringPointLabel" variant="h6" component="h2">
                    Adicione um Ponto de Monitoramento para a {selectedMachineName}
                  </Typography>
                  <FormControl fullWidth sx={{ m: 1, marginTop: 4 }}>
                        <InputLabel htmlFor="monitoringPoint-name">Nome do sensor</InputLabel>
                        <Input
                            id="monitoringPoint-name"
                            value={newMonitoringPointName}
                            onChange={(e) => { setNewMonitoringPointName(e.target.value) }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Abc />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="monitoringPoint-type">Tipo do sensor</InputLabel>
                        <Select
                            id="monitoringPoint-type"
                            value={newMonitoringPointType}
                            label="Tipo do sensor"
                            onChange={handleNewMonitoringTypeChange}
                        >
                            { monitoringPointTypes.map((type) => {
                                return (
                                    <MenuItem value={type}>{type}</MenuItem>
                                );
                            }) }
                        </Select>
                    </FormControl>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{ marginTop: 4 }}
                    >
                        <Button
                                    variant="contained"
                                    onClick={handleCreateMonitoringPoint}
                                >
                                    Adicionar
                                </Button>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={addMachineModal}
                onClose={handleMachineClose}
                aria-labelledby="addMachineLabel"
                aria-describedby="addMachineDescription"
            >
                <Box sx={style}>
                  <Typography id="addMachineLabel" variant="h6" component="h2">
                    Adicione uma nova Máquina
                  </Typography>
                  <FormControl fullWidth sx={{ m: 1, marginTop: 4 }}>
                        <InputLabel htmlFor="machine-name">Nome da Máquina</InputLabel>
                        <Input
                            id="machine-name"
                            value={newMachineName}
                            onChange={(e) => { setNewMachineName(e.target.value) }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Abc />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="machine-type">Tipo da Máquina</InputLabel>
                        <Select
                            id="machine-type"
                            value={newMachineType}
                            label="Tipo do sensor"
                            onChange={handleNewMachineTypeChange}
                        >
                            { machineTypes.map((type) => {
                                return (
                                    <MenuItem value={type}>{type}</MenuItem>
                                );
                            }) }
                        </Select>
                    </FormControl>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{ marginTop: 4 }}
                    >
                        <Button
                                    variant="contained"
                                    onClick={handleCreateMachine}
                                >
                                    Adicionar
                                </Button>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={listMonitoringPointsModal}
                onClose={handleMonitoringPoingListClose}
                aria-labelledby="monitoringPointListLabel"
                aria-describedby="monitoringPointListDescription"
            >
                <Box sx={style}>
                    <Typography id="monitoringPointListLabel" variant="h6" component="h2">
                        Adicione uma nova Máquina
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table stickyHeader sx={{ minWidth: 600 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align="center">Tipo</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {monitoringPointRows.map((row: any) => {
                                   return (row.machineId === selectedMachineId) ? (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={4}>
                                                    <ImageListItem  sx={{ width: 50, height: 50 }}>
                                                        <img 
                                                            src={row.imageSource}
                                                            srcSet={row.imageSource}
                                                            alt={row.sensorName}
                                                            loading="lazy"
                                                        />
                                                    </ImageListItem>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    {row.sensorName}
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                aria-label="Listar pontos de monitoramento"
                                                color="error"
                                                onClick={() => {
                                                    handleDeleteMonitoringPoint(row.id);
                                                }}
                                            >
                                                <Delete></Delete>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <></>
                                )})}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </Box>
    );
}