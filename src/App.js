// src/App.js
import React from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Box sx={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
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
  );
}

export default App;
