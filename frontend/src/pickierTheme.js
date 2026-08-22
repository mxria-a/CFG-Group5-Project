import { createTheme } from "@mui/material/styles";

const pickierTheme = createTheme({
  palette: {
    success: { main: "#5A8F3C", dark: "#46702E", contrastText: "#FFFFFF" },
    error: { main: "#E8462A", dark: "#C4361D", contrastText: "#FFFFFF" },
    warning: { main: "#F5B701", dark: "#c99400", contrastText: "#2E1A12" },
    info: { main: "#2E1A12", dark: "#1a0e08", contrastText: "#FFFFFF" },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          border: "2px solid #2E1A12",
          borderRadius: "12px",
          boxShadow: "4px 4px 0 #2E1A12",
          alignItems: "center",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: "3px solid #2E1A12",
          borderRadius: "16px",
          boxShadow: "6px 6px 0 #2E1A12",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "10px",
        },
      },
    },
  },
});

export default pickierTheme;
