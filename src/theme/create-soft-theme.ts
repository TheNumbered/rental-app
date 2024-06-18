import { createTheme } from '@mui/material/styles';

const createSoftTheme = (mode: "dark" | "light") => {
  const isDarkMode = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#0f4c5c",
      },
      secondary: {
        main: '#34C759', // Soft green
      },
      error: {
        main: '#FF3B30', // Soft red
      },
      background: {
        default: isDarkMode ? '#1c1c1e' : '#FFFFFF', // Dark mode background color and light mode background color
        paper: isDarkMode ? '#1c1c1e' : '#FFFFFF', // Dark mode paper color and light mode paper color
      },
    },
    typography: {
      fontFamily: 'Arial, sans-serif', // Change the font family
    },
    shape: {
      borderRadius: 12, // Rounded corners similar to Dona AI components
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Rounded buttons
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow
          },
        },
        defaultProps: {
          component: "section"
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
          },
        },
        defaultProps: {
          component: "article"
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none', // No shadow for app bar
            //backgroundColor: 'transparent', // Transparent app bar
          },
        },
        defaultProps: {
          component: "header"
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? '#1c1c1e' : '#FFFFFF', // Dark mode drawer background color and light mode drawer background color
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" // Light shadow for drawer
          },
        },
        defaultProps: {
          component: "nav"
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s, transform 0.3s', // Smooth hover effect
            cursor: 'pointer', // Pointer cursor
            borderRadius: 8, // Rounded corners
            marginBottom: 12, // Spacing between items
            '&:hover': {
              backgroundColor: isDarkMode ? '#333' : '#f0f0f0', // Dark mode hover background color and light mode hover background color
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#007AFF' : '#34C759', // Checkbox color based on mode
          },
        },
      },
    },
  });
};

export default createSoftTheme;
