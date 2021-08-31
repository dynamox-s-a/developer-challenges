import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from "@material-ui/core/styles";
import logodynamox from '../assets/img/logodynamox.png';
import { IconButton, Link, Menu, MenuItem } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';




const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    logo: {
        padding: 3,
        marginLeft: 30,
        '@media (max-width:768px)': {
            width:98,
            padding: 10            
          },
      
       
    },
    navbar: {
        background: "#263252",

    },
    links: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        },


    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    navButton: {
        '&:hover': {
            backgroundColor: '#546492',
            borderColor: '#546492',
            boxShadow: 'none',
        },
        fontFamily: 'Raleway',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '23px',
        color: ' #FFFFFF',
    }


}));

export default function Navbar() {
    const classes = useStyles();


    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);



    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };


    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >

        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton color="inherit" href={'https://dynamox.net/dynapredict/'}>
                    DynaPredict
                </IconButton>
            </MenuItem>
            <MenuItem>
                <IconButton color="inherit" href={'#sensores'}>
                    Sensores
                </IconButton>
            </MenuItem>
            <MenuItem>
                <IconButton color="inherit" href={'#footer'}>
                    Contato
                </IconButton>
            </MenuItem>
        </Menu>

    );

    return (
        <React.Fragment>
            <div className={classes.grow}>
                <AppBar className={classes.navbar}>
                    <Toolbar>
                        <Link href={'https://dynamox.net/'}>
                            <img
                                className={classes.logo}
                                alt={"Logo "}
                                width={172}
                                src={logodynamox}                               
                            />
                        </Link>
                        <div className={classes.grow} />
                        <div className={classes.links}>
                            <IconButton className={classes.navButton} color="inherit" href={'https://dynamox.net/dynapredict/'}>
                                DynaPredict
                            </IconButton>
                            <IconButton className={classes.navButton} color="inherit"  href={'#sensores'}>
                                Sensores
                            </IconButton>
                            <IconButton className={classes.navButton} color="inherit"  href={'#footer'}>
                                Contato
                            </IconButton>
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton

                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                {renderMenu}
            </div>
            <Toolbar />


        </React.Fragment>
    );
}
