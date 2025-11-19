import "./App.css";
import Navbar from "./Components/Navbar";
import CardDropZone from "./Components/CardDropZone";
import Grid from "@mui/material/Grid";

function App() {
  return (
    <div className="App">
      <div>
        <Navbar ></Navbar>
        <Grid container spacing={2} style={{ marginTop: 1 }}>
          <Grid size={1}></Grid>
          <Grid size={10}>
            <CardDropZone></CardDropZone>
          </Grid>
          <Grid size={1}></Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
