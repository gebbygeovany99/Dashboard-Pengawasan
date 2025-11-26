// src/Dashboard.js
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { PERIODS } from "../Data/data";
import {
  getReportsByPeriode,
  getStatsForReports,
  getStatusPerLjkForPeriode,
  getLaporanFromApi,
} from "../Utils/reportStats";

import {
  getLjkById,
  formatTanggal,
  formatRupiah,
  getLjkFromApi,
} from "../Utils/reportHelpers";
import FilterBar from "./FilterBar";

export default function Dashboard({
  onSelectLjkDetail,
  selectedKategori,
  selectedTahun,
  selectedPeriodeId,
  onChangeKategori,
  onChangeTahun,
  onChangePeriode,
}) {
  const [laporan, setLaporan] = useState([]);
  const [ljkList, setLjkList] = useState([]);
  const [reportsForPeriode, setReportsForPeriode] = useState([]);
  const [stats, setStats] = useState([]);
  const [statusPerLjk, setStatusPerLjk] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getLaporanFromApi();
      // console.log("fetch: ", data)
      setLaporan(data);
    }

    fetchData();
  }, [selectedPeriodeId]);

  useEffect(() => {
    async function fetchData() {
      const data = await getLjkFromApi();
      // console.log("ALL LJK: ", data)
      setLjkList(data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!laporan || laporan.length === 0) {
      setReportsForPeriode([]);
      return;
    }

    const rfp = getReportsByPeriode(selectedPeriodeId, laporan);
    setReportsForPeriode(rfp);
  }, [selectedPeriodeId, laporan]);

  useEffect(() => {
    if (!laporan || laporan.length === 0) {
      setStats([]);
      return;
    }

    if (!reportsForPeriode || reportsForPeriode.length === 0) {
      setStats([]);
      return;
    }

    const s = getStatsForReports(reportsForPeriode, laporan);
    setStats(s);
  }, [reportsForPeriode, laporan]);

  // Laporan Per Periode Complete dengan Statusnya
  useEffect(() => {
    if (!laporan || laporan.length === 0) {
      setStatusPerLjk([]);
      return;
    }

    const result = getStatusPerLjkForPeriode(selectedPeriodeId, laporan);
    setStatusPerLjk(result);
    // console.log("Result: ", result)
  }, [selectedPeriodeId, laporan]);

  

  const selectedPeriode = PERIODS.find((p) => p.id === selectedPeriodeId);

  // DataGrid rows
  const rows = statusPerLjk.map((row) => {
    const ljk = ljkList.find((l) => l.id === row.ljkId);
    
    return {
      id: row.ljkId, // penting buat DataGrid
      name: ljk?.name,
      type: ljk?.type,
      statusPelaporan: row.statusPelaporan,
      terlambat: row.terlambat,
      tidakMenyampaikan: row.tidakMenyampaikan,
      progresPelaporan: row.progresPelaporan,
      totalPelaporan: row.totalPelaporan,
      totalDenda: row.totalDenda,
      lastUpdated: row.lastUpdated,
    };
  });

  const persentaseLaporan = useMemo(() => {
    const totalLjk = rows.length;
  
    if (totalLjk === 0) {
      return {
        percentageBelumLapor: "0%",
        percentageSudahLapor: "0%",
        percentageSudahLaporSebagian: "0%",
      };
    }
  
    let countBelumLapor = 0;
    let countSudahLaporSebagian = 0;
    let countSudahLapor = 0;
  
    rows.forEach((row) => {
      if (row.statusPelaporan === "Belum Lapor") {
        countBelumLapor += 1;
      } else if (row.statusPelaporan === "Sudah Lapor") {
        countSudahLapor += 1;
      } else if (row.statusPelaporan === "Sudah Lapor Sebagian") {
        countSudahLaporSebagian += 1;
      }
    });
  
    const toPercent = (count) =>
      ((count / totalLjk) * 100).toFixed(2) + "%";
  
    return {
      percentageBelumLapor: toPercent(countBelumLapor),
      percentageSudahLapor: toPercent(countSudahLapor),
      percentageSudahLaporSebagian: toPercent(countSudahLaporSebagian),
    };
  }, [rows]);
  

  // console.log(persentaseLaporan());

  const columns = [
    {
      field: "name",
      headerName: "Nama LJK",
      flex: 1.5,
    },
    {
      field: "type",
      headerName: "Jenis",
      flex: 0.5,
    },
    {
      field: "statusPelaporan",
      headerName: "Status Pelaporan",
      flex: 1,
    },
    {
      field: "terlambat",
      headerName: "Terlambat",
      flex: 0.6,
      type: "number",
    },
    {
      field: "tidakMenyampaikan",
      headerName: "Tidak Menyampaikan",
      flex: 0.8,
      type: "number",
    },
    {
      field: "progresPelaporan",
      headerName: "Progres Pelaporan",
      flex: 0.8,
      type: "number",
      valueFormatter: (_, row) => row.progresPelaporan + "/" + row.totalPelaporan
    },
    {
      field: "totalDenda",
      headerName: "Total Denda",
      flex: 1,
      valueFormatter: (_, row) => formatRupiah(row.totalDenda),
    },
    {
      field: "lastUpdated",
      headerName: "Terakhir Update",
      flex: 1,
      valueFormatter: (_, row) => {
        if (!row.lastUpdated) return "-"; // null / undefined → "-"
        return formatTanggal(row.lastUpdated);
      },
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <button
          style={{
            borderRadius: 999,
            padding: "6px 12px",
            border: "none",
            background: "#8B2320",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => onSelectLjkDetail(params.row.id, selectedPeriodeId)}
        >
          Detail
        </button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, mt: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 8 }}>
          Dashboard Laporan
        </Typography>

        <FilterBar
          selectedKategori={selectedKategori}
          selectedTahun={selectedTahun}
          selectedPeriodeId={selectedPeriodeId}
          onChangeKategori={onChangeKategori}
          onChangeTahun={onChangeTahun}
          onChangePeriode={onChangePeriode}
        />
      </Box>

      {/* Cards Statistik */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <StatCard
          title="Belum Lapor"
          value={persentaseLaporan.percentageBelumLapor}
        />
        <StatCard
          title="Sudah Lapor Sebagian"
          value={persentaseLaporan.percentageSudahLaporSebagian}
        />
        {/* <StatCard title="Terlambat" value={stats.terlambat} /> */}
        <StatCard
          title="Sudah Lapor"
          value={persentaseLaporan.percentageSudahLapor}
        />
        {/* <StatCard title="Tidak menyampaikan" value={stats.tidakMenyampaikan} /> */}
        <StatCard
          title="Total Denda Seluruh LJK"
          value={formatRupiah(stats.totalDenda)}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        List LJK 
        <Typography component="span" sx={{ fontSize: 14, ml: 1 }}>
          ({stats.total} kewajiban laporan)
        </Typography>
      </Typography>

      <Box
        sx={{
          height: "60vh",
          width: "100%",
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgba(155, 37, 33, 0.1)",
              borderRadius: 2,
            },
            "& .MuiDataGrid-row": {
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#fafafa",
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
          }}
        />
      </Box>
    </Box>
  );
}

function StatCard({ title, value }) {
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14, mb: 1 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
