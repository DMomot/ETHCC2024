import React from "react";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes } from "react-router-dom";
import routes from "../../Config/routes";
import HeaderComponent from "./HeaderComponent";
import FeedbackErrorSnackbar from "./FeedbackErrorSnackbar";
import FeedbackSuccessSnackbar from "./FeedbackSuccessSnackbar";
import "./styles.css";

export default function Layout() {
  return (
    <Stack className="App">
      <CssBaseline />
      <HeaderComponent />
      <FeedbackErrorSnackbar />
      <FeedbackSuccessSnackbar />
      <main className="App-main">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              element={<route.component />}
            />
          ))}
        </Routes>
      </main>
    </Stack>
  );
}
