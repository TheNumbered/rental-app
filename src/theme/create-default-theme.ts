import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const createDefaultTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#027173",
      },
      secondary: {
        main: "#003547",
      },
      error: {
        main: red.A400,
      },
      background: {
        default: mode === "light" ? "#cbe8e2" : "#015559",
      }
    },
    typography: {
      fontFamily: 'Arial, sans-serif', // Change the font family
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px', // Example style override for buttons
          },
          containedPrimary: {
            backgroundColor: '#027173', // Example primary button color
          },
          containedSecondary: {
            backgroundColor: '#003547', // Example secondary button color
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: '#f0f0f0', // Example text field background color
            borderRadius: '8px', // Example border radius
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1f1f1f', // Example paper background color
            //borderRadius: '12px', // Example border radius for paper
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Example box shadow
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#2c2c2c', // Example card background color
            borderRadius: '8px', // Example border radius for cards
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Example box shadow
            border: '1px solid #e0e0e0', // Example border
          },
        },
      },
      // Add more component styles as needed
    },
  });
};

export default createDefaultTheme;
