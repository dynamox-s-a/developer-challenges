import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import palette from './palette';
import typography from './typography';
import customShadows from './shadows';
import CssBaseline from './components/utils/CssBaseline';
import Stack from './components/layout/Stack';
import Paper from './components/surfaces/Paper';
import Button from './components/buttons/Button';
import ButtonBase from './components/buttons/ButtonBase';
import IconButton from './components/buttons/IconButton';
import Toolbar from './components/buttons/Toolbar';
import Chip from './components/data-display/Chip';
import Badge from './components/data-display/Badge';
import Checkbox from './components/inputs/Checkbox';
import FilledInput from './components/inputs/FilledInput';
import FormControlLabel from './components/inputs/FormControlLabel';
import InputAdornment from './components/inputs/InputAdornment';
import InputBase from './components/inputs/InputBase';
import OutlinedInput from './components/inputs/OutlinedInput';
import Select from './components/inputs/Select';
import Collapse from './components/list/Collapse';
import List from './components/list/List';
import ListItemButton from './components/list/ListItemButton';
import ListItemIcon from './components/list/ListItemIcon';
import ListItemText from './components/list/ListItemText';
import MenuItem from './components/list/MenuItem';
import AppBar from './components/navigation/AppBar';
import Drawer from './components/navigation/Drawer';
import Link from './components/navigation/Link';
import YearCalendar from './components/date-picker/YearCalendar';
import MonthCalendar from './components/date-picker/MonthCalendar';
import PaginationItem from './components/pagination/PaginationItem';
import DataGrid from './components/data-grid/DataGrid';
import Avatar from './components/data-display/Avatar';
import AvatarGroup from './components/data-display/AvatarGroup';
import Card from './components/cards/Card';
import CardMedia from './components/cards/CardMedia';
import CardContent from './components/cards/CardContent';
import DateCalendar from './components/date-picker/DateCalendar';
import InputLabel from './components/inputs/InputLabel';
import Divider from './components/data-display/Divider';

export const theme = createTheme({
  palette,
  typography,
  customShadows,
  mixins: {
    toolbar: {
      minHeight: 130,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1420,
      xl: 1780,
    },
  },
  components: {
    MuiStack: Stack,
    MuiPaper: Paper,
    MuiButton: Button,
    MuiButtonBase: ButtonBase,
    MuiIconButton: IconButton,
    MuiToolbar: Toolbar,
    MuiBadge: Badge,
    MuiChip: Chip,
    MuiCheckbox: Checkbox,
    MuiFilledInput: FilledInput,
    MuiFormControlLabel: FormControlLabel,
    MuiInputAdornment: InputAdornment,
    MuiInputBase: InputBase,
    MuiOutlinedInput: OutlinedInput,
    MuiSelect: Select,
    MuiCollapse: Collapse,
    MuiList: List,
    MuiListItemButton: ListItemButton,
    MuiListItemIcon: ListItemIcon,
    MuiListItemText: ListItemText,
    MuiMenuItem: MenuItem,
    MuiInputLabel: InputLabel,
    MuiAppBar: AppBar,
    MuiDrawer: Drawer,
    MuiLink: Link,
    MuiCard: Card,
    MuiCardMedia: CardMedia,
    MuiCardContent: CardContent,
    MuiDivider: Divider,
    MuiAvatar: Avatar,
    MuiDataGrid: DataGrid,
    MuiAvatarGroup: AvatarGroup,
    MuiDateCalendar: DateCalendar,
    MuiMonthCalendar: MonthCalendar,
    MuiYearCalendar: YearCalendar,
    MuiPaginationItem: PaginationItem,
    MuiCssBaseline: CssBaseline,
  },
});
