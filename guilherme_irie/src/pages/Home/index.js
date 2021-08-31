import React, { useState } from 'react';
import backgroundImage from '../../assets/grafismo.png';
import SensorTca from '../../assets/sensor-tca.png';
import SensorHf from '../../assets/sensor-hf.png';
import SensorAs from '../../assets/sensor-af.png';
import dynapredict from '../../assets/logo-dynapredict.png';
import desktop from '../../assets/desktop-and-mobile.png';
import { makeStyles } from '@material-ui/core/styles';
import InputMask from 'react-input-mask';

const useStyles = makeStyles({
    margem: {
        maxWidth: '80%',
        margin: 'auto',
    },
    background: {
        backgroundImage: `url(${backgroundImage})`,
        height: '100vh',
        width: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    },
    section: {
        backgroundColor: '#F4F7FC',
        height: 'auto'
    },
    sectionDois: {
        backgroundColor: '#263252',
        height: 'auto'
    },
    titulo: {
        paddingTop: '40px',
        fontSize: '40px',
        fontWeight: '700',
        textAlign: 'center'
    },
    content: {
        paddingBottom: '15px',
        fontSize: '24px',
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: '28px'
    },
    button: {
        background: '#263252',
        borderRadius: '5px',
        color: '#fff',
        padding: '10px 40px',
        fontSize: '20px',
        fontWeight: '700',
        textDecoration: 'none',
        '&:hover': {
            opacity: '0.75',
            cursor: 'pointer'
        }
    },
    areaInput: {
        minWidth: '400px',
        padding: '20px',
        margin: '2%',
        borderRadius: '5px',
        border: '1px solid #E8E8E8',
        '@media (max-width:768px)': {
            minWidth:'300px'
          },
        '&:focus': {
            border: '1px solid #00ffff',
            outline: 'none',
            transition: 'all ease .4s'
        },
        
        
        
    },
    formContainer: {
        display: 'flex',
        height: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '50px'

    },
    sensores: {
        display: 'flex',
        marginTop: '20px',
        justifyContent: 'center',
        '@media (max-width:768px)': {
          flexDirection:'column',
          alignItems: 'center'
        }
    },
    sensor: {
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (max-width:768px)': {
            maxWidth:'300px'
          }
    },
    sensorTitulo: {
        color: '#5D7A8C',
        fontSize: '40px',
        fontWeight: '700'

    },
    backgroundContentTitle: {
        color: '#fff',
        fontSize: '80px',
        fontWeight: '700',
        '@media (max-width:768px)': {
            fontSize:'50px'
          }
    },
    backgroundContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '@media (max-width:768px)': {
            flexDirection:'column'
          }
    },
    imagemGrande: {
        '@media (max-width:768px)': {
            maxWidth:'300px'
          }
    }
});

const Page = () => {
    const classes = useStyles();

    const [nome, setNome] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    const submit = async () => {
        alert(" Nome: " + nome + "\n Empresa: " + empresa + "\n Email: " + email + "\n Telefone: " + telefone + "\n")
    }

    return (
        <div >
            {/* <h1>Página Inicial</h1>
            <Link to="/sobre">Sobre</Link> */}
            <div className={classes.background}>
                <div className={classes.margem}>
                    <div className={classes.backgroundContent}>
                        <div style={{paddingBottom: '50px'}}>
                            <p className={classes.backgroundContentTitle}>Solução <br />DynaPredict</p>
                            <img src={dynapredict} alt="" />
                        </div>
                        <div style={{paddingTop: '50px'}}>
                            <img className={classes.imagemGrande} src={desktop} alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="section1" className={classes.section}>
                <div className={classes.margem}>
                    <p className={classes.titulo}>Sensores para Manutenção Preditiva</p>
                    <p className={classes.content}>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
                        temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
                        registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
                        são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.</p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <a className={classes.button} href="https://dynamox.net/dynapredict/">VER MAIS</a>
                    </div>
                    <div className={classes.sensores}>
                        <div className={classes.sensor}>
                            <img className={classes.imagemGrande} src={SensorTca} alt="" />
                            <p className={classes.sensorTitulo}>TcA+</p>
                        </div>
                        <div className={classes.sensor}>
                            <img className={classes.imagemGrande} src={SensorAs} alt="" />
                            <p className={classes.sensorTitulo}>AS</p>
                        </div>
                        <div className={classes.sensor}>
                            <img className={classes.imagemGrande} src={SensorHf} alt="" />
                            <p className={classes.sensorTitulo}>HF</p>
                        </div>

                    </div>

                </div>
            </div>
            <div id="section2" className={classes.sectionDois}>
                <div className={classes.margem}>
                    <p className={classes.titulo} style={{ color: '#fff' }}>Ficou com dúvida?<br />Nós entramos em contato com você</p>
                    <div className={classes.formContainer}>
                        <div>
                            <input
                                onChange={(event) => setNome(event.target.value)}
                                value={nome}
                                placeholder="Como gostaria de ser chamado?"
                                type="text"
                                className={classes.areaInput}
                            />
                        </div>
                        <div>
                            <input
                                onChange={(event) => setEmpresa(event.target.value)}
                                value={empresa}
                                placeholder="Em qual empresa você trabalha?"
                                type="text"
                                className={classes.areaInput}
                            />
                        </div>
                        <div>
                            <input
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                                placeholder="Digite aqui o seu email"
                                type="email"
                                className={classes.areaInput}
                            />
                        </div>
                        <div>
                            <InputMask
                                mask="(99) 99999-9999"
                                maskChar=""
                                value={telefone}
                                onChange={(event) => setTelefone(event.target.value)}
                            >
                                {() => <input
                                    placeholder="Qual o seu telefone?"
                                    type="text"
                                    className={classes.areaInput}
                                />}
                            </InputMask>

                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", paddingBottom: '50px' }}>
                        <button className={classes.button} style={{ backgroundColor: '#0165DB' }} onClick={() => submit()}> ENVIAR</button>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default Page;