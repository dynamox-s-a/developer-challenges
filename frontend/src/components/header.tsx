import React, { useEffect } from "react";
import { AppBar, Button, Toolbar, Typography, Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '@/features/user';
import { updateMachine } from "@/features/machine";
import { updateMonitoringPoint } from "@/features/monitoringPoint";
import Router from "next/router";
import axios from "axios";


export default function Header() {
    const isOnMobile = false;

    //Redux variables
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.value);

    

    const headersData = [
        {
            label: "Logout",
            action: () => {
                dispatch(logout());
                dispatch(updateMonitoringPoint([]));
                dispatch(updateMachine([]));
                Router.push("/auth/login");
            }
        }
    ];

    const displayDesktop = () => {
        return (
                <Toolbar sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    { dynamoxLogo }
                    {getMenuButtons()}
                </Toolbar>
            )
    }

    const displayMobile = () => {
        return (
            <div>Mobile Header</div>
        )
    }

    const dynamoxLogo = (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-end"
            spacing={2}
        >
            <Grid item>
                <Typography variant="h6" component="h1">
                    Dynamox
                </Typography>
            </Grid>
            <Grid item>
                <Typography sx={{fontSize: 10}}>Seja bem vindo {user.name}</Typography>
            </Grid>
        </Grid>
    )

    const getMenuButtons = () => {
        return headersData.map(({ label, action }) => {
            return (
                <Button
                    {...{
                        key: label,
                        color: "inherit",
                        sx: {
                            "fontWeight": 700,
                            "size": "18px",
                            "marginLeft": "38px"
                        }
                    }}
                    onClick={action}
                >
                    {label}
                </Button>
            );
        });
    };

    return (
        <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>{ isOnMobile ? displayMobile() : displayDesktop() }</AppBar>
    )
}