import "./App.css";
import Navbar from "./Components/Navbar";
import CardDropZone from "./Components/CardDropZone";
import Dashboard from "./Components/Dashboard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function App() {
  return (
    <div className="App">
      <div>
        <Navbar></Navbar>
        <Grid item xs={12} sx={{padding: 2}}>
          <Dashboard />
        </Grid>
      </div>
    </div>
  );
}

export default App;
