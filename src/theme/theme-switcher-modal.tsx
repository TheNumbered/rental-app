import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import useColorMode from './color-mode-provider';

interface ThemeSwitcherModalProps {
    open: boolean;
    onClose: () => void;
}

const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({ open, onClose }) => {
    const { colorMode, theme, toggleColorMode, changeTheme } = useColorMode();

    const handleColorModeChange = () => {
        toggleColorMode();
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeTheme(event.target.value as 'default' | 'lp' | 'soft');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Switch Theme</DialogTitle>
            <DialogContent
            sx={{
                minWidth: 300,
            }}
            >
                <div>
                    <h3>Color Mode</h3>
                    <Button onClick={handleColorModeChange}>
                        Switch to {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                    </Button>
                </div>
                <div>
                    <h3>Select Theme</h3>
                    <RadioGroup value={theme} onChange={handleThemeChange}>
                        <FormControlLabel value="default" control={<Radio />} label="Default Theme" />
                        <FormControlLabel value="lp" control={<Radio />} label="LP Theme" />
                        <FormControlLabel value="soft" control={<Radio />} label="Soft Theme" />
                    </RadioGroup>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ThemeSwitcherModal;
