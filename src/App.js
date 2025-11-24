import "./App.css";
import Box from "@mui/material/Box";
import { useState } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [snackbar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  return (
    <Router>
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Routes>
          {/* Default route redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected page (sementara belum pakai auth) */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
