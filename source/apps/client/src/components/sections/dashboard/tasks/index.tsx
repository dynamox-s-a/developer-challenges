import { useState } from 'react';
import { tasksData } from 'data/tasksData';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ActionMenu from './ActionMenu';
import Task from './Task';

const Tasks = () => {
  const [tasks, setTasks] = useState(tasksData);

  const handleAllToggle = () => {
    const isAllChecked = tasks.every((item) => item.checked);

    if (isAllChecked) {
      const updatedTasks = tasks.map((item) => {
        return { ...item, checked: false };
      });
      setTasks(updatedTasks);
    } else {
      const updatedTasks = tasks.map((item) => {
        return { ...item, checked: true };
      });
      setTasks(updatedTasks);
    }
  };

  return (
    <Paper sx={{ p: 2.5, height: 350 }}>
      <Stack alignItems="center" justifyContent="space-between">
        <FormGroup>
          <FormControlLabel
            sx={(theme) => ({
              '& .MuiFormControlLabel-label': {
                ml: 1,
                mt: 0.15,
                fontSize: theme.typography.h6.fontSize,
                fontWeight: 700,
              },
            })}
            control={
              <Checkbox onClick={handleAllToggle} checked={tasks.some((item) => item.checked)} />
            }
            label="Maintenance Log"
          />
        </FormGroup>

        <ActionMenu />
      </Stack>

      <Box mt={2.5}>
        {tasks.map((item) => (
          <Task key={item.id} tasks={tasks} setTasks={setTasks} data={item} />
        ))}
      </Box>
    </Paper>
  );
};

export default Tasks;
