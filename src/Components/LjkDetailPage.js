import React, { useMemo, useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { calculateDenda, hitungHariMenujuDeadline, formatRupiah, formatTanggal, formatHariMenujuDeadline } from "../Utils/reportHelpers";
import { getStatsForReports, getLaporanFromApi } from "../Utils/reportStats";
import { getLjkFromApi, getPeriodeFromApi } from "../Utils/reportHelpers";

export default function LjkDetailPage({ ljkId, periodeId, onBack }) {
  const [ljkList, setLjkList] = useState([]);
  const [periode, setPeriode] = useState([]);
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getLjkFromApi();
      setLjkList(data);

      const periodeTemp = await getPeriodeFromApi();
      setPeriode(periodeTemp.find((l) => l.id === periodeId)?.label);

      const laporanTemp = await getLaporanFromApi();
      setLaporanList(
        laporanTemp.filter(
          (l) => l.ljkId === ljkId && l.periodeId === periodeId
        )
      );
      setLoading(false);
    }

    fetchData();
  }, [ljkId, periodeId]);

  const ljk = ljkList.find((l) => l.id === ljkId);

  const reports = useMemo(
    () => laporanList.filter((r) => r.ljkId === ljkId && r.periodeId === periodeId),
    [ljkId, periodeId, laporanList]
  );

  const stats = useMemo(() => getStatsForReports(reports), [reports]);

  const rows = reports.map((r) => ({
    id: r.id,
    jenisLaporan: r.jenis,
    deadline: r.deadline,
    status: r.status,
    hariMenujuDeadline: hitungHariMenujuDeadline(r.deadline),
    denda: calculateDenda(r),
    tanggalSubmit: r.tanggalSubmit,
    catatan: r.catatan,
  }));

  const columns = [
    { field: "jenisLaporan", headerName: "Jenis Laporan", flex: 1.3 },
    {
      field: "deadline",
      headerName: "Deadline",
      flex: 1,
      valueFormatter: (_, row) => formatTanggal(row.deadline),
    },
    { field: "status", headerName: "Status", flex: 0.8 },
    {
      field: "hariMenujuDeadline",
      headerName: "Hari Menuju Deadline",
      flex: 0.9,
      valueFormatter: (_, row) =>
        formatHariMenujuDeadline(hitungHariMenujuDeadline(row.deadline), row.status, row.tanggalSubmit),
    },
    {
      field: "denda",
      headerName: "Denda",
      flex: 0.8,
      valueFormatter: (_, row) => formatRupiah(row.denda),
    },
    {
      field: "tanggalSubmit",
      headerName: "Tanggal Pengumpulan",
      flex: 1,
      valueFormatter: (_, row) => (row.tanggalSubmit ? formatTanggal(row.tanggalSubmit) : "-"),
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
          onClick={() => alert(`Edit ${params.row.jenisLaporan}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, mt: 9 }}>
      <Button variant="text" onClick={onBack} sx={{ mb: 2 }}>
        ← Kembali
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "flex-start" }}>
        <Box>
          {loading ? (
            <Skeleton variant="text" width={200} height={60} />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {ljk?.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, fontSize: 14 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: 11, fontWeight: "bold", color: "#555" }}>Email</Typography>
            {loading ? <Skeleton variant="text" height={30} width={150} /> : <Typography>{ljk?.email}</Typography>}
          </Box>

          <Box sx={{ borderRight: "1px dashed #999", height: "28px" }} />

          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: 11, fontWeight: "bold", color: "#555" }}>Periode Laporan</Typography>
            {loading ? <Skeleton variant="text" height={30} width={100} /> : <Typography>{periode}</Typography>}
          </Box>
        </Box>
      </Box>

      {/* Statistik cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {["Belum Lapor", "Sudah Lapor", "Terlambat", "Tidak menyampaikan", "Total Denda"].map((title, i) => (
          <StatCard key={i} title={title} value={loading ? <Skeleton height={50} width={130} /> : stats[title.toLowerCase().replace(/\s/g, "")] || formatRupiah(stats.totalDenda)} />
        ))}
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        {loading ? <Skeleton height={60} width={200} /> : `Laporan ${periode}`}
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
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={50} sx={{ mb: 1, borderRadius: 2 }} />
          ))
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
              sorting: { sortModel: [{ field: "deadline", sort: "asc" }] },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(155, 37, 33, 0.1)",
                borderRadius: 2,
              },
              "& .MuiDataGrid-row": { borderRadius: 2, "&:hover": { backgroundColor: "#fafafa" } },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
            }}
          />
        )}
      </Box>
    </Box>
  );
}

function StatCard({ title, value }) {
  return (
    <Card sx={{ flex: 1, borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14, mb: 1 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
