import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import Button from '@material-ui/core/Button';
import { Route, Switch, Link, BrowserRouter } from 'react-router-dom';
import Produtos from '../views/Produtos';
import CadProdutos from '../views/CadProdutos';
import Login from '../views/Login'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RouteHandler from '../components/RouteHandler'
import { doLogout } from '../helpers/AuthHandler';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,

    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#3f51b5',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },

    search: {

        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 30,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },

    button: {
        color: '#FFFF',
        textDecoration: 'none',
        width: 200
    }


}));

const NavBar = (prop) => {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);



    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        if (window.confirm('Deseja mesmo sair?')) {
            doLogout();
            window.location.href = '/login';
        }

    }

    return (
        <BrowserRouter>
            <div className={classes.root}>

                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>

                        </Typography>

                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem>
                            <Link className={classes.button} to="/produtos">
                                <Button
                                    className={classes.button}
                                    startIcon={<AllInboxIcon />}
                                    href={'/produtos'}
                                >
                                    Produtos</Button>
                            </Link>

                        </ListItem>
                        <ListItem>
                            <Link className={classes.button} to="/login">
                                <Button
                                    className={classes.button}
                                    startIcon={<ExitToAppIcon />}
                                    href={'/login'}
                                    onClick={handleLogout}
                                >
                                    Sair</Button>
                            </Link>

                        </ListItem>
                    </List>

                </Drawer>

            </div>
            <Switch>
                <RouteHandler exact path='/login'>
                    <Login />
                </RouteHandler>
                <RouteHandler private path='/produtos'>
                    <Produtos />
                </RouteHandler>
                <RouteHandler private path='/cadprodutos'>
                    <CadProdutos />
                </RouteHandler>

            </Switch>
        </BrowserRouter>

    )
}
export default NavBar;