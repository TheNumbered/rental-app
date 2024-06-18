import React, { createContext, useEffect, useState } from 'react';

type ColorMode = 'light' | 'dark';
type ThemeType = 'default' | 'lp' | 'soft';

interface ColorModeContextProps {
    colorMode: ColorMode;
    theme: ThemeType;
    toggleColorMode: () => void;
    changeTheme: (theme: ThemeType) => void;
}

const ColorModeContext = createContext<ColorModeContextProps>({
    colorMode: 'light',
    theme: 'default',
    toggleColorMode: () => {},
    changeTheme: () => {},
});

export const ColorModeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [colorMode, setColorMode] = useState<ColorMode>('light');
    const [theme, setTheme] = useState<ThemeType>('default');

    const toggleColorMode = () => {
        setColorMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
        localStorage.setItem('color-mode', colorMode === 'light' ? 'dark' : 'light');
    };

    const changeTheme = (theme: ThemeType) => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    };

    useEffect(() => {
        const savedColorMode = localStorage.getItem('color-mode') as ColorMode;
        const savedTheme = localStorage.getItem('theme') as ThemeType;
        setColorMode(savedColorMode || 'light');
        setTheme(savedTheme || 'default');
    }, []);

    return (
        <ColorModeContext.Provider value={{ colorMode, theme, toggleColorMode, changeTheme }}>
            {children}
        </ColorModeContext.Provider>
    );
};

const useColorMode = () => {
    const context = React.useContext(ColorModeContext);
    if (!context) {
        throw new Error('useColorMode must be used within a ColorModeProvider');
    }
    return context;
};

export default useColorMode;
