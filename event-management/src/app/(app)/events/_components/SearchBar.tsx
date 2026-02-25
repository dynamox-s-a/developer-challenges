'use client';

import { Box, Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortMenu from './SortMenu';

interface SearchBarProps {
  isAdmin: boolean;
  eventsSearch: string;
  setEventsSearch: (search: string) => void;
  sortName: 'date' | 'name';
  setSortName: (sort: 'date' | 'name') => void;
  sortType: 'asc' | 'desc';
  setSortType: (sort: 'asc' | 'desc') => void;
  onCreateEvent: () => void;
}

const SearchBar = ({
  isAdmin,
  eventsSearch,
  setEventsSearch,
  sortName,
  setSortName,
  sortType,
  setSortType,
  onCreateEvent,
}: SearchBarProps) => {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        justifyContent: { xs: 'flex-start', lg: 'space-between' },
        alignItems: 'center',
        margin: '2rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '1rem',
          width: { xs: '100%', lg: '50%' },
        }}
      >
        <TextField
          label="Search events by name"
          variant="outlined"
          data-testid="search-input"
          size="small"
          sx={{ width: { xs: '100%', lg: '50%' } }}
          slotProps={{ input: { endAdornment: <SearchIcon /> } }}
          value={eventsSearch}
          onChange={(e) => setEventsSearch(e.target.value)}
        />
        <SortMenu sortName={sortName} setSortName={setSortName} sortType={sortType} setSortType={setSortType} />
      </Box>
      <Box
        sx={{
          display: isAdmin ? 'block' : 'none',
          marginTop: { xs: '1rem', lg: '0' },
          width: { xs: '100%', lg: 'auto' },
        }}
      >
        <Button variant="contained" color="primary" onClick={onCreateEvent} data-testid="create-event-button">
          Create event
        </Button>
      </Box>
    </Box>
  );
};

export default SearchBar;
