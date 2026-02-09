import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';
import { fetchMachines } from 'store/slices/machinesSlice';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MachinesSection from 'components/sections/machines';
import PageTitle from 'components/common/PageTitle';

const Machines = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  return (
    <>
      <PageTitle title="Manage Machines" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MachinesSection />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Machines;
