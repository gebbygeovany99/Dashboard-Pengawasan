import Navbar from "../Components/Navbar";
import CardDropZone from "../Components/CardDropZone";
import Dashboard from "../Components/Dashboard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";

function Home() {
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
        <div>
          <Navbar></Navbar>
          <Grid item xs={12} sx={{ padding: 2 }}>
            {/* Jika showDashboard TRUE → tampilkan Dashboard */}
            {showDashboard ? (
              <Dashboard />
            ) : (
              <CardDropZone
                onUploadSuccess={() => setShowDashboard(true)}
                showSnackbar={showSnackBar}
              />
            )}
          </Grid>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </Box>
  );
}

export default Home;