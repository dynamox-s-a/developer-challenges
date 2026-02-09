import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconifyIcon from 'components/base/IconifyIcon';
import { TaskProps } from 'data/tasksData';

interface TaskItemProps {
  data: TaskProps;
  tasks: TaskProps[];
  setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>;
}

const Task = ({ data, tasks, setTasks }: TaskItemProps) => {
  const handleChange = (id: number | string) => {
    const newTasks = tasks.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    setTasks(newTasks);
  };

  return (
    <Stack mb={2} alignItems="center" justifyContent="space-between">
      <FormGroup>
        <FormControlLabel
          sx={(theme) => ({
            '& .MuiFormControlLabel-label': {
              ml: 1,
              mt: 0.05,
              color: !data.checked ? theme.palette.text.disabled : null,
              fontSize: theme.typography.body1.fontSize,
              fontWeight: data.checked ? 700 : 500,
            },
          })}
          control={
            <Checkbox
              onChange={() => handleChange(data.id)}
              checked={data.checked ? true : false}
            />
          }
          label={data.task}
        />
      </FormGroup>

      <IconButton
        edge="start"
        color="inherit"
        aria-label="card-menu"
        sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent' } }}
        disableRipple
      >
        <IconifyIcon icon="ic:sharp-drag-indicator" color="text.disabled" />
      </IconButton>
    </Stack>
  );
};

export default Task;
