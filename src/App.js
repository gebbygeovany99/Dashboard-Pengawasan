import "./App.css";
import Navbar from "./Components/Navbar";
import CardDropZone from "./Components/CardDropZone";
import Dashboard from "./Components/Dashboard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [snackbar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackBar = (message, severity = "success") => {
    setSnackBar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackBar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        height: "100vh", // Box mengambil seluruh tinggi layar
        backgroundColor: "#f5f5f5", // Ganti dengan warna latar belakang abu
      }}
    >
      <div className="App">
        <SignUp></SignUp>
      </div>
    </Box>
  );
}

export default App;
