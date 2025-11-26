import Navbar from "../Components/Navbar";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import Dashboard from "../Components/Dashboard";
import LjkDetailPage from "../Components/LjkDetailPage";
import { PERIODS } from "../Data/data";

function Home() {
  const [view, setView] = useState("dashboard");
  const [selectedLjkId, setSelectedLjkId] = useState(null);
  // const [selectedPeriodeId, setSelectedPeriodeId] = useState(null);

   // 🔹 FILTER STATE DISIMPAN DI SINI
   const [selectedKategori, setSelectedKategori] = useState("BULANAN");
   const [selectedTahun, setSelectedTahun] = useState(2025);
   const [selectedPeriodeId, setSelectedPeriodeId] = useState("prd-2025-b01");
 
   const handleChangeKategori = (kategoriBaru) => {
     setSelectedKategori(kategoriBaru);
 
     const firstPeriode = PERIODS.find(
       (p) => p.kategori === kategoriBaru && p.tahun === selectedTahun
     );
     if (firstPeriode) {
       setSelectedPeriodeId(firstPeriode.id);
     }
   };
 
   const handleChangeTahun = (tahunBaru) => {
     setSelectedTahun(tahunBaru);
 
     const firstPeriode = PERIODS.find(
       (p) => p.kategori === selectedKategori && p.tahun === tahunBaru
     );
     if (firstPeriode) {
       setSelectedPeriodeId(firstPeriode.id);
     }
   };
 
   const handleChangePeriode = (periodeBaru) => {
     setSelectedPeriodeId(periodeBaru);
   };
 
   const handleSelectLjkDetail = (ljkId) => {
     setSelectedLjkId(ljkId);
     setView("detail");
   };
 
   const handleBack = () => {
     setView("dashboard"); // filter TIDAK ke-reset, karena state ada di App
   };
 


  // const handleSelectLjkDetail = (ljkId, periodeId) => {
  //   setSelectedLjkId(ljkId);
  //   setSelectedPeriodeId(periodeId);
  //   setView("detail");
  // };

  // const handleBack = () => {
  //   setView("dashboard");
  // };


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
          <>
      {view === "dashboard" && (
        <Dashboard 
        selectedKategori={selectedKategori}
          selectedTahun={selectedTahun}
          selectedPeriodeId={selectedPeriodeId}
          onChangeKategori={handleChangeKategori}
          onChangeTahun={handleChangeTahun}
          onChangePeriode={handleChangePeriode}
          onSelectLjkDetail={handleSelectLjkDetail}
        />
      )}
      {view === "detail" && selectedLjkId && selectedPeriodeId && (
        <LjkDetailPage
          ljkId={selectedLjkId}
          periodeId={selectedPeriodeId}
          onBack={handleBack}
        />
      )}
    </>
        </div>
      </div>
    </Box>
  );
}

export default Home;