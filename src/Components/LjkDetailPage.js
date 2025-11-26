// src/LjkDetailPage.js
import React, { useMemo } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LJK, PERIODS, TEMPLATES, REPORTS } from "../Data/data";
import {
  calculateDenda,
  formatRupiah,
  formatTanggal,
  hitungHariMenujuDeadline,
} from "../Utils/reportHelpers";
import { getStatsForReports } from "../Utils/reportStats";

export default function LjkDetailPage({ ljkId, periodeId, onBack }) {
  const ljk = LJK.find((l) => l.id === ljkId);
  const periode = PERIODS.find((p) => p.id === periodeId);

  const reports = useMemo(
    () => REPORTS.filter((r) => r.ljkId === ljkId && r.periodeId === periodeId),
    [ljkId, periodeId]
  );


  const stats = useMemo(() => getStatsForReports(reports), [reports]);

  const rows = reports.map((r) => {
    const template = TEMPLATES.find((t) => t.id === r.templateId);
    const denda = calculateDenda(r);

    console.log("R: ", r)

    return {
      id: r.id,
      jenisLaporan: template?.nama,
      deadline: r.deadline,
      status: r.status,
      hariMenujuDeadline: hitungHariMenujuDeadline(r.deadline, r.status, r.tanggalSubmit),
      denda,
      tanggalSubmit: r.tanggalSubmit,
      catatan: r.catatan,
    };

  });

  console.log("data: ", rows)

  const columns = [
    { field: "jenisLaporan", headerName: "Jenis Laporan", flex: 1.3 },
    {
      field: "deadline",
      headerName: "Deadline",
      flex: 1,
      valueGetter: (value, row) => {
        return formatTanggal(row.deadline);
      },
    },
    { field: "status", headerName: "Status", flex: 0.8 },
    {
      field: "hariMenujuDeadline",
      headerName: "Hari Menuju Deadline",
      flex: 0.9,
    },
    {
      field: "denda",
      headerName: "Denda",
      flex: 0.8,
      valueGetter: (_, row) => formatRupiah(row.denda),
    },
    {
      field: "tanggalSubmit",
      headerName: "Tanggal Pengumpulan",
      flex: 1,
      valueGetter: (value, row) => {
        if (!row.tanggalSubmit) return "-";    // null / undefined → "-"
        return formatTanggal(row.tanggalSubmit);
      },
    },
    {
      field: "catatan",
      headerName: "Catatan",
      flex: 1.2,
      valueGetter: (_, row) => row.catatan ?? "-",
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        
        <Button
          size="small"
          variant="text"
          onClick={() => {
            // nanti diganti buka modal edit
            alert(`Edit ${params.row.jenisLaporan}`);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, mt: 10}}>
      <Button variant="text" onClick={onBack} sx={{ mb: 2 }}>
        ← Kembali
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {ljk?.name}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right", fontSize: 14 }}>
          <Typography>Email: {ljk?.email}</Typography>
          <Typography>Periode Laporan: {periode?.label}</Typography>
        </Box>
      </Box>

      {/* Cards statistik */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <StatCard title="Belum Lapor" value={stats.belum} />
        <StatCard title="Sudah Lapor" value={stats.sudah} />
        <StatCard title="Terlambat" value={stats.terlambat} />
        <StatCard
          title="Tidak menyampaikan"
          value={stats.tidakMenyampaikan}
        />
        <StatCard title="Total Denda" value={formatRupiah(stats.totalDenda)} />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Laporan {periode?.label}
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
