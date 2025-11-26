// src/Dashboard.js
import React, { useMemo, useState } from "react";
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
} from "../Utils/reportStats";

import {
  getLjkById,
  formatTanggal,
  formatRupiah,
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
  const reportsForPeriode = useMemo(
    () => getReportsByPeriode(selectedPeriodeId),
    [selectedPeriodeId]
  );
  const stats = useMemo(
    () => getStatsForReports(reportsForPeriode),
    [reportsForPeriode]
  );

  // Laporan Per Periode Complete dengan Statusnya
  const statusPerLjk = useMemo(
    () => getStatusPerLjkForPeriode(selectedPeriodeId),
    [selectedPeriodeId]
  );

  // const persentaseLaporan = {
  //   belumLapor: (stats.belum / stats.total * 100).toFixed(2) + "%",
  //   sudahLapor: (stats.sudah / stats.total * 100).toFixed(2) + "%",
  //   // sudahLaporSebagian: (stats.)
  // }

  const selectedPeriode = PERIODS.find((p) => p.id === selectedPeriodeId);

  // DataGrid rows
  const rows = statusPerLjk.map((row) => {
    const ljk = getLjkById(row.ljkId);
    return {
      id: row.ljkId, // penting buat DataGrid
      name: ljk?.name,
      type: ljk?.type,
      statusPelaporan: row.statusPelaporan,
      terlambat: row.terlambat,
      tidakMenyampaikan: row.tidakMenyampaikan,
      totalDenda: row.totalDenda,
      lastUpdated: row.lastUpdated,
    };
  });

  const persentaseLaporan = () => {

    let countBelumLapor = 0;
    let countSudahLaporSebagian = 0;
    let countSudahLapor = 0;

    const totalLapor = stats.total;

    rows.map((data) => {
      if (data.statusPelaporan == "Belum Lapor") {
        countBelumLapor += 1;
      } else if (data.statusPelaporan == "Sudah Lapor") {
        countSudahLapor += 1;
      } else {
        countSudahLaporSebagian += 1;
      }
    });

    const percentageBelumLapor = (countBelumLapor / totalLapor * 100).toFixed(2) + '%';
    const percentageSudahLapor = (countSudahLapor / totalLapor * 100).toFixed(2) + '%';
    const percentageSudahLaporSebagian = (countSudahLaporSebagian / totalLapor * 100).toFixed(2) + '%';

    return {
      percentageBelumLapor,
      percentageSudahLapor,
      percentageSudahLaporSebagian
    };
  };

  console.log(persentaseLaporan())

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
      field: "totalDenda",
      headerName: "Total Denda",
      flex: 1,
      valueGetter: (_, row) => formatRupiah(row.totalDenda),
    },
    {
      field: "lastUpdated",
      headerName: "Terakhir Update",
      flex: 1,
      valueGetter: (_, row) => {
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
    <Box sx={{ p: 4, mt: 10}}>
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
          value={persentaseLaporan().percentageBelumLapor}
        />
        <StatCard
          title="Sudah Lapor Sebagian"
          value={persentaseLaporan().percentageSudahLaporSebagian}
        />
        {/* <StatCard title="Terlambat" value={stats.terlambat} /> */}
        <StatCard title="Sudah Lapor" value={persentaseLaporan().percentageSudahLapor} />
        {/* <StatCard title="Tidak menyampaikan" value={stats.tidakMenyampaikan} /> */}
        <StatCard title="Total Denda" value={formatRupiah(stats.totalDenda)} />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        List LJK – {selectedPeriode?.label}{" "}
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
