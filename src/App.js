// src/App.js
import React, { useState } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";


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
        <Box
          sx={{
            height: "100vh",
            backgroundColor: "background.default",
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}


export default App;
