import * as React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

const headersData = [
    {
        label: "Logout",
        href: "/auth/login"
    }
];


export default function Header() {
    const isOnMobile = false;

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
        <Typography variant="h6" component="h1">
            Dynamox
        </Typography>
    )

    const getMenuButtons = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Button
                    {...{
                        key: label,
                        color: "inherit",
                        to: href,
                        sx: {
                            "fontWeight": 700,
                            "size": "18px",
                            "marginLeft": "38px"
                        }
                    }}
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