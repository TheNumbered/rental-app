import { ThemeProvider } from "@emotion/react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import useColorMode, { ColorModeProvider } from "./color-mode-provider";
import createDefaultTheme from "./create-default-theme";
import createLpTheme from "./create-lp-theme";
import createSoftTheme from "./create-soft-theme";

const ThemeWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
    const { colorMode, theme } = useColorMode();

    const getTheme = (theme: string, colorMode: "dark" | "light") => {
        switch (theme) {
            case 'lp':
                return createLpTheme(colorMode);
            case 'soft':
                return createSoftTheme(colorMode);
            default:
                return createDefaultTheme(colorMode);
        }
    }

    const appliedTheme = getTheme(theme, colorMode);

    return (
        <ThemeProvider theme={appliedTheme}>
            <GlobalStyles
                styles={{
                    ul: { margin: 0, padding: 0, listStyle: "none" },
                    html: { WebkitFontSmoothing: "auto" },
                }}
            />
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

const ExtendThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    return <ColorModeProvider><ThemeWrapper>{children}</ThemeWrapper></ColorModeProvider>
}

export default ExtendThemeProvider;
