import { EngineeringOutlined } from '@mui/icons-material';
import {
  Container,
  Box,
  Button,
  Avatar,
  Typography,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import UserCard from './components/UserCard';
import { MACHINE_TYPES } from './constants';
import { useNavigate } from 'react-router-dom';
import {
  useCreateMachineMutation,
  useGetMachinesQuery,
} from './features/monitor/monitorSlice';
import useAuth from './useAuth';

export default function CreateMachine() {
  const n = useNavigate();
  const authContext = useAuth();
  const { refetch } = useGetMachinesQuery(authContext!.user.id);
  const [createMachine] = useCreateMachineMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);

    createMachine({
      name: `${d.get('name')}`,
      type: `${d.get('type')}`,
      userId: authContext!.user.id,
    })
      .unwrap()
      .then(() => {
        refetch().then(() => n('/machines'));
      })
      .catch((error: Error) => {
        alert('Error: try update later');
        console.log('Error: ', error);
      });
  };

  return (
    <Container component={'main'} maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Button variant="outlined" onClick={() => n('/machines')}>
            Back
          </Button>
        </Box>

        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <EngineeringOutlined />
        </Avatar>

        <Typography component="h1" variant="h5">
          Create Machine
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem 0',
            alignSelf: 'stretch',
          }}
        >
          <FormControl fullWidth>
            <TextField
              name="name"
              label="New machine name"
              required
              fullWidth
              autoFocus
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="sslId">Type</InputLabel>
            <Select
              name="type"
              labelId="sslId"
              label="Type"
              defaultValue={MACHINE_TYPES[0]}
              required
            >
              {MACHINE_TYPES.map((i: string | number, k: number) => (
                <MenuItem key={k} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="outlined">
            Save
          </Button>
        </Box>

        <UserCard />
      </Box>
    </Container>
  );
  // const auth = useAuth();
  // const { id } = auth!.user;
  // const [data, setdata] = useState({
  //   name: '',
  //   type: MACHINE_TYPES[0],
  // });

  // const { refetch } = useGetMachinesQuery(auth!.user.id);

  // const { name, type } = data;
  // const setName = (value: string) => setdata({ ...data, name: value });
  // const setType = (value: string) => setdata({ ...data, type: value });

  // const okFunc = (data: string) => {
  //   alert('New machine created!');
  //   console.log(data);
  //   refetch();
  // };

  // const errFunc = (data: string) => {
  //   alert('Error! No new machine created.');
  //   console.log(data);
  // };

  // const handleCreate = () => {
  //   console.log('New Machine: ', { id, name, type });
  //   const machine: newMachineParams = { userId: id, name, type };
  //   requestNewMachine(machine, okFunc, errFunc);
  // };

  // return (
  //   <div id="createMachine">
  //     <div>
  //       <h2>Create a new machine</h2>
  //     </div>
  //     <div>
  //       <label htmlFor="name">Machine Name:</label>{' '}
  //       <input
  //         id="name"
  //         type="text"
  //         onChange={({ target: { value } }) => setName(value)}
  //       />
  //     </div>
  //     <div>
  //       <label htmlFor="name">Machine Type:</label>{' '}
  //       <select onChange={({ target: { value } }) => setType(value)}>
  //         {MACHINE_TYPES.map((i, k) => (
  //           <option key={k} value={i}>
  //             {i}
  //           </option>
  //         ))}
  //       </select>
  //     </div>
  //     <div id="buttonBox">
  //       <button type="button" onClick={handleCreate}>
  //         Create
  //       </button>
  //       {/* <button type="button">Cancel</button> */}
  //     </div>
  //   </div>
  // );
}

export type newMachineParams = { userId: string; name: string; type: string };
