'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { machine_types } from '@/types';
import { useRouter } from 'next/navigation';
import '../../../app/dashboard/machines/edit/page.css';


export function MachineForm(params): React.JSX.Element {
  const router = useRouter();

  const handleCancelClick = React.useCallback(() => {
    router.back();   
  }, []);

  return (
    <form 
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        /*const response = await fetch('/api/submit', {
          method: 'POST',
          body: formData,
        })
     
        // Handle response if necessary
        const data = await response.json()
        // ...
        */

        //router.back();
        console.log("SAVED!", params.id, formData)
      }}
    >
      <Card>
        <CardHeader />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={9} xs={12} item >
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput name="name" />
              </FormControl>
            </Grid>
            <Grid md={3} xs={12} item >
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select label="Type" name="type" variant="outlined">
                  {machine_types.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>  
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">{params.id ? 'Save' : 'Add'}</Button>
          <Button color="error" variant="contained" onClick={handleCancelClick}>Cancel</Button>
        </CardActions>
      </Card>
    </form>
  );
}
