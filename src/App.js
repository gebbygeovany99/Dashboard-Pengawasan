// src/App.js
import React from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";


const ojkTheme = createTheme({
  palette: {
    primary: {
      main: "#7E0E0B", // maroon OJK
    },
    secondary: {
      main: "#0E4C92", // biru dokumen/tautan
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={ojkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ height: "100vh", backgroundColor: "background.default" }}>
          <Routes>
            {/* Default route redirect */}
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected route → Dashboard */}
            <Route
              path="/"
              element={
                localStorage.getItem("token")?(
                  <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
                ):(
                  <Login />
                )
              
              }
            />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  )}


export default App;
