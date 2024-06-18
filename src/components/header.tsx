import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Avatar, Badge, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { ProfileMenu } from './profile-menu';

const Header: React.FC = () => {
    const isLargeScreen = useMediaQuery('(min-width:600px)');

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="logo">
                    <Avatar src="/logo192.png" alt="Logo" />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Rental App
                </Typography>
                {isLargeScreen && (
                    <IconButton edge="end" color="inherit" aria-label="notifications" style={{marginRight: "5px", backgroundColor: "rgba(0, 0, 0, 0.1)"}}>
                        <Badge badgeContent={0} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                )}
                <ProfileMenu />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
