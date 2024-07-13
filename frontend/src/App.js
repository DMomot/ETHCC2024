import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import { ThemeProvider } from "@mui/material";
import { StyledEngineProvider, createTheme } from "@mui/material/styles";

import "./App.css";
import "./fonts.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(86, 137, 241)",
    },
    secondary: {
      main: "rgb(86, 137, 241)",
    },
    black: {
      main: "#000000DD",
    },
    grey: {
      main: "rgba(108, 134, 173, .6)",
    },
  },
  typography: {
    fontFamily: "Roboto, serif",
    color: "rgb(34, 34, 34)",
  },
});

function App() {
  return (
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route exact path="*" element={<Layout />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
