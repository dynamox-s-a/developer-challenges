import { ReactElement, useCallback, useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/store';
import DashboardLayout from 'layouts/dashboard';
import AddMachineDialog from 'components/machines/add-machine-dialog';
import { getMachines } from 'store/features/machines-slice';
import Machine from 'components/machines/machine';

export const Index = () => {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machine.machines);
  const isGettingMachines = useAppSelector(
    (state) => state.loading.getMachines
  );

  const [isAddMachineDialogOpen, setAddMachineDialogOpen] = useState(false);

  console.log('machines', machines);
  const onToggleAddMachineDialog = useCallback(() => {
    setAddMachineDialogOpen((prevState) => !prevState);
  }, []);

  useEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);

  const content = useMemo(() => {
    if (isGettingMachines) {
      return 'Loading';
    }

    return machines.map((machine) => (
      <Machine
        key={machine.id}
        id={machine.id}
        name={machine.name}
        type={machine.type}
      />
    ));
  }, [isGettingMachines, machines]);
  return (
    <>
      <Head>
        <title>Machines</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Machines</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={onToggleAddMachineDialog}
                >
                  Add
                </Button>
              </div>
            </Stack>
            {/* <CompaniesSearch /> */}
            <Stack direction="column" spacing={1}>
              {content}
              {/* {companies.map((company) => (
            <Grid
              xs={12}
              md={6}
              lg={4}
              key={company.id}
            >
              <CompanyCard company={company} />
            </Grid>
          ))} */}
            </Stack>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Pagination count={3} size="small" />
            </Box>
          </Stack>
        </Container>
        {isAddMachineDialogOpen && (
          <AddMachineDialog handleClose={onToggleAddMachineDialog} />
        )}
      </Box>
    </>
  );
};

Index.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default Index;
