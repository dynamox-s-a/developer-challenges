import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar'
import grafismo from '../assets/img/grafismo.png';
import logodynapredict from '../assets/img/logodynapredict.png';
import desktopandmobile from '../assets/img/desktopandmobile.png';
import sensoraf from '../assets/img/sensoraf.png';
import sensorhf from '../assets/img/sensorhf.png';
import sensortca from '../assets/img/sensortca.png';
import { Button, Grid } from '@material-ui/core';
import '../assets/css/styled.css';





const useStyles = makeStyles((theme) => ({
    capa: {
        backgroundImage: `url(${grafismo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        height: '91.5vh',
        width: '100%',
        '@media (max-width:768px)': {
            backgroundColor:'#263252',
            backgroundImage: 'none',
          },
    },
    tituloCapa: {
        width: '472px',
        height: '188px',
        fontFamily: 'Raleway, sans-serif',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '80px',
        lineHeight: '94px',
        color: ' #FFFFFF',
        '@media (max-width:768px)': {
            fontSize:'40px',           
           
          },

    },
    logocapa: {
        width: 'auto',
        height: '35px',
        padding: 20
    },
    imgcapa: {

        width: '100%',
        height: '527px',
        '@media (max-width:768px)': {
            height:'200px',
            
          },


    },
    divcapa: {
        padding: 80,
        '@media (max-width:768px)': {
            padding:'40px',
            
            textAlign:'center'
            
          },
    },
    divcapa1: {
        marginTop: 80,
        

    },
    section1: {
        padding: 15,
        marginTop: 25
    },
    titleSensores: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '40px',
        fontStyle: 'normal',
        fontWeight: 800,
        lineHeight: '47px',
        letterSpacing: '0em',
        textAlign: 'center',
        color: '#37383D',
        '@media (max-width:768px)': {
            fontSize:'30px'
          },

    },
    text: {
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '24px',
        lineHeight: '28px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#454545',
        padding: 20

    },
    btn: {
        width: '183px',
        height: '39px',
        background: '#263252',
        borderRadius: '5px',
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '23px',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#546492',
            borderColor: '#546492',
            boxShadow: 'none',
        },
    },
    btnForm: {
        width: '183px',
        height: '39px',
        background: '#2f4da8',
        borderRadius: '5px',
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '23px',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#546492',
            borderColor: '#546492',
            boxShadow: 'none',
        },

    },
    imgSensor: {
        width: 'auto',
        height: '297.84px',
        '@media (max-width:768px)': {
            height:'270px'
          },
        
    },
    divsensor: {
        padding: 15,
        marginTop: 15,
        
    },
    footer: {
        backgroundColor: '#263252',
        paddingBottom: 30
    },
    footerTitle: {
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '30px',
        lineHeight: '35px',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    input: {
        backgroundColor: '#FFFFFF',
        width: 426,
        color: '#454545',
        textAlign: 'center',
        height: '41px',
        borderRadius: '5px',
        '@media (max-width:768px)': {
            width:'200px'
          },

    }

}));


const Home = () => {
    const classes = useStyles();
    const [nome, setNome] = useState('')
    const [empresa, setEmpresa] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
   
    const getForm = () => {               
        alert(" Nome: " + nome + "\n Empresa: " + empresa + "\n Email: " + email + "\n Telefone: " + telefone + "\n")
    }

    return (<>
        <Navbar />
        
        <div className={classes.capa}>
            <Grid container className={classes.divcapa}>
                <Grid item lg={6} className={classes.divcapa1}>
                    <span className={classes.tituloCapa}>Solução <br /> DynaPredict</span>
                    <div><img src={logodynapredict} className={classes.logocapa} alt={'logodynapredict'} /></div>
                </Grid>
                <Grid item lg={6}>
                    <div><img src={desktopandmobile} className={classes.imgcapa} alt={'desktopandmobile'} /></div>
                </Grid>
            </Grid>
        </div >
        <div id={'sensores'}></div>
        <div className={classes.section1} >
            <Grid container align={'center'} >
                <div>
                    <h2 className={classes.titleSensores}>Sensores para Manutenção Preditiva</h2>
                    <p className={classes.text}>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
                        temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
                        registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
                        são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão. </p>
                    <Button variant="contained" className={classes.btn} href={'https://dynamox.net/dynapredict/'}>VER MAIS</Button>
                </div>
            </Grid>
            <Grid container className={classes.divsensor} align={'center'}>
                <Grid item lg={4}>
                    <img src={sensortca} className={classes.imgSensor} alt={'sensortca'} />
                    <div><h1 style={{ color: '#5D7A8C' }}>TcA+</h1></div>
                </Grid>
                <Grid item lg={4}>
                    <img src={sensoraf} className={classes.imgSensor} alt={'sensoraf'} />
                    <div><h1 style={{ color: '#5D7A8C' }}>AS</h1></div>
                </Grid>
                <Grid item lg={4}>
                    <img src={sensorhf} className={classes.imgSensor} alt={'sensorhf'} />
                    <div><h1 style={{ color: '#5D7A8C' }}>HF</h1></div>
                </Grid>
            </Grid>
        </div>
        <div className={classes.footer} id={'footer'}>
            <Grid container align={'center'}>
                <Grid item lg={12}>
                    <h2 className={classes.footerTitle}>Ficou com dúvida? <br />
                        Nós entramos em contato com você</h2>
                    <form noValidate autoComplete="off" align={'center'}>
                        <div>
                            <input placeholder="Como gostaria de ser chamado?"
                                className={classes.input}
                                onChange={(event) => setNome(event.target.value)} />
                        </div>
                        <div>
                            <input placeholder="Em qual empresa você trabalha?"
                                className={classes.input} 
                                onChange={(event) => setEmpresa(event.target.value)}/>
                        </div>
                        <div>
                            <input placeholder="Digite aqui o seu email"
                                className={classes.input} 
                                onChange={(event) => setEmail(event.target.value)}/>
                        </div>
                        <div>
                            <input placeholder="Qual o seu telefone?"
                                className={classes.input}
                                onChange={(event) => setTelefone(event.target.value)} />
                        </div>
                        <div style={{ paddingTop: 12 }}>
                            <Button variant="contained"
                                className={classes.btnForm}
                                onClick={() => getForm()}
                               
                            >
                                Enviar
                            </Button>
                        </div>

                    </form>

                </Grid>
            </Grid>

        </div>

    </>
    )

}

export default Home;