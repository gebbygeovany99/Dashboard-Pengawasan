import "./App.css";
import Navbar from "./Components/Navbar";
import CardDropZone from "./Components/CardDropZone";
import Dashboard from "./Components/Dashboard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function App() {
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
            {/* <Dashboard /> */}
            <CardDropZone></CardDropZone>
          </Grid>
        </div>
      </div>
    </Box>
  );
}

export default App;
