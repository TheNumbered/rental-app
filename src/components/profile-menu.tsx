import ThemeSwitcherModal from '@/theme/theme-switcher-modal';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileMenu: React.FC = () => {
    const {user} = useUser();
    const {signOut} = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openThemeSwitcher, setOpenThemeSwitcher] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (MenuItem : string) => {
        if (MenuItem === "Switch Theme") {
            setOpenThemeSwitcher(true);
        }
        if (MenuItem === "Logout") {
            signOut();
        }
        if (MenuItem === "Manage Tenants") {
            navigate("/tenants");
        }
        if (MenuItem === "Manage Expenses") {
            navigate("/dashboard");
        }
        handleMenuClose();
    } 

    return (
        <>
            <IconButton edge="end" color="inherit" aria-label="user" onClick={handleMenuOpen}>
                <Avatar src={user?.imageUrl} alt={user?.fullName ?? "UserProfile"} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleMenuClose}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={user?.imageUrl} alt="User Avatar" sx={{ mr: 1 }} />
                        <div>
                            <Typography variant="subtitle1">
                                {user?.fullName ?? "User Profile"}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                {user?.emailAddresses[0].emailAddress ?? "username@mail.com"}
                            </Typography>
                        </div>
                    </Box>
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("Manage Expenses")}>Manage Expenses</MenuItem>
                <MenuItem onClick={() => handleMenuClick("Manage Tenants")}>Manage Tenants </MenuItem>
                <MenuItem onClick={() => handleMenuClick("Switch Theme")}>Switch Theme</MenuItem>
                <MenuItem onClick={() => handleMenuClick("Logout")}>Logout</MenuItem>
            </Menu>
            <ThemeSwitcherModal open={openThemeSwitcher} onClose={() => setOpenThemeSwitcher(false)} />
        </>
    );
};
