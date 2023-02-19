import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControl from '@mui/material/FormControl';
import { Button, Checkbox, FormControlLabel, Stack, TextField, createTheme } from '@mui/material';
import styles from '../styles/create.module.css';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useRouter } from 'next/router';
import DataCreate from '@/interfaces/dataCreate';
import validateData from '@/middlewares/createMiddlewate';

export default function FormDyna(props: { title: string; btnName: string; func: Function; values:any }) {
    const { title, btnName, func, values } = props

    const router = useRouter()

    const [name, setName] = useState('');
    const [fabricationDate, setFabricationDate] = useState<Dayjs | null>(dayjs('2023-02-15'));
    const [isPerecive, setIsPerecive] = useState(false);
    const [validate, setValidate] = useState<Dayjs | null>(dayjs('2023-02-15'))
    const [price, setPrice] = useState(0.0);
    const [errorName, setErrorName] = useState(false);

    
    const valuesToShow = () => {
      if(values === undefined) {
        return 
      }
      
      setName(values.name)
      setFabricationDate(dayjs(values.fabricationDate));
      setIsPerecive(values.perevice);
      setValidate(dayjs(values.fabricationDate));
      setPrice(values.price);
    }
    
    const handleChangeFabricationDate = (newValue: Dayjs | null) => {
        setFabricationDate(newValue)
      };

      const handleChangeValidateDate = (newValue: Dayjs | null) => {
        setValidate(newValue)
      };

      const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPerecive(event.target.checked);
      };

      const Submit = (data:DataCreate) => {
        const isValid = validateData(data)
        if(isValid==='O campo nome é obrigatorio') return setErrorName(true)
        if(isValid==='A data de fabricação não pode ser maior que a data de válidade!') return window.alert('A data de fabricação não pode ser maior que a data de válidade!')
        if(isValid==='O preço precisa ser maior que 0') return window.alert('O preço precisa ser maior que 0')
        func(data)
      }

      const handleSubmit = () => {
        const data:DataCreate = {
          name, 
          fabricationDate,
          isPerecive,
          validate: isPerecive? validate: null,
          price,
        }
        Submit(data);
      }

      useEffect(() => {
        valuesToShow()
      },[])
    return(
    <div className={styles.create}>
            <Box sx={{ 
              width: 400,
              height:700,
              backgroundColor:'white',
              display:'flex', 
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              borderRadius:3
              }}>
                <FormControl>
                    <Stack spacing={3} width={320}>
                        <h1>{title}</h1>
                        <TextField 
                        id="outlined-basic" 
                        label="Nome do produto" 
                        variant="outlined"
                        error={errorName}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value) 
                            setErrorName(false)}}/>
                        
                        <LocalizationProvider   LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Data de Fabricação"
                                inputFormat="DD/MM/YYYY"
                                value={fabricationDate}
                                onChange={handleChangeFabricationDate}
                                renderInput={(params) => <TextField {...params} />}
                        />
                            {/* <MobileDatePicker
                            label="Date mobile"
                            inputFormat="MM/DD/YYYY"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                            /> */}
                        </LocalizationProvider>
                        <FormControlLabel  control={<Checkbox onChange={handleChangeCheckBox} checked={isPerecive} />} label="Perecivel" />
                        <LocalizationProvider   LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Data de Validade"
                                inputFormat="DD/MM/YYYY"
                                value={validate}
                                onChange={handleChangeValidateDate}
                                disabled={!isPerecive?true:false}
                                renderInput={(params) => <TextField {...params} />}
                        />
                            {/* <MobileDatePicker
                            label="Date mobile"
                            inputFormat="MM/DD/YYYY"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                            /> */}
                        </LocalizationProvider>
                        <TextField 
                        id="outlined-basic" 
                        label="Preço" 
                        variant="outlined"
                        inputProps={{ inputMode: 'numeric', pattern: '^((\d+)|(\d{1,3})(\,\d{3}|)*)(\.\d{2}|)$' }} 
                        value={price}
                        type='number'
                        onChange={(e) => setPrice(parseInt(e.target.value))}/>
                        <Button variant="outlined" onClick={handleSubmit}>{btnName}</Button>
                    </Stack>
                </FormControl>
                <Stack marginTop={5}>
                <Button variant="outlined" onClick={() => router.push('/Dashboard')}>dashboard</Button>                  
                </Stack>
            </Box>
            
        </div>
    )
}