// src/Dashboard.js
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
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
  const [stats, setStats] = useState({});
  const [statusPerLjk, setStatusPerLjk] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch laporan
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getLaporanFromApi();
      setLaporan(data);
      setLoading(false);
    }
    fetchData();
  }, [selectedPeriodeId]);

  // Fetch LJK
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getLjkFromApi();
      setLjkList(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Reports per periode
  useEffect(() => {
    if (!laporan || laporan.length === 0) {
      setReportsForPeriode([]);
      return;
    }
    const rfp = getReportsByPeriode(selectedPeriodeId, laporan);
    setReportsForPeriode(rfp);
  }, [selectedPeriodeId, laporan]);

  // Stats
  useEffect(() => {
    if (!reportsForPeriode || reportsForPeriode.length === 0) {
      setStats({});
      return;
    }
    const s = getStatsForReports(reportsForPeriode, laporan);
    setStats(s);
  }, [reportsForPeriode, laporan]);

  // Status per LJK
  useEffect(() => {
    if (!laporan || laporan.length === 0) {
      setStatusPerLjk([]);
      return;
    }
    const result = getStatusPerLjkForPeriode(selectedPeriodeId, laporan);
    setStatusPerLjk(result);
  }, [selectedPeriodeId, laporan]);

  const selectedPeriode = PERIODS.find((p) => p.id === selectedPeriodeId);

  // DataGrid rows
  const rows = statusPerLjk.map((row) => {
    const ljk = ljkList.find((l) => l.id === row.ljkId);
    return {
      id: row.ljkId,
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

  // Persentase laporan
  const persentaseLaporan = useMemo(() => {
    const totalLjk = rows.length;
    if (totalLjk === 0) return { percentageBelumLapor: "0%", percentageSudahLapor: "0%", percentageSudahLaporSebagian: "0%" };
    let countBelumLapor = 0, countSudahLaporSebagian = 0, countSudahLapor = 0;
    rows.forEach((row) => {
      if (row.statusPelaporan === "Belum Lapor") countBelumLapor++;
      else if (row.statusPelaporan === "Sudah Lapor") countSudahLapor++;
      else if (row.statusPelaporan === "Sudah Lapor Sebagian") countSudahLaporSebagian++;
    });
    const toPercent = (count) => ((count / totalLjk) * 100).toFixed(2) + "%";
    return {
      percentageBelumLapor: toPercent(countBelumLapor),
      percentageSudahLapor: toPercent(countSudahLapor),
      percentageSudahLaporSebagian: toPercent(countSudahLaporSebagian),
    };
  }, [rows]);

  const columns = [
    { field: "name", headerName: "Nama LJK", flex: 1.5 },
    { field: "type", headerName: "Jenis", flex: 0.5 },
    { field: "statusPelaporan", headerName: "Status Pelaporan", flex: 1 },
    { field: "terlambat", headerName: "Terlambat", flex: 0.6, type: "number" },
    { field: "tidakMenyampaikan", headerName: "Tidak Menyampaikan", flex: 0.8, type: "number" },
    { field: "progresPelaporan", headerName: "Progres Pelaporan", flex: 0.8, type: "number", valueFormatter: (_, row) => row.progresPelaporan + "/" + row.totalPelaporan },
    { field: "totalDenda", headerName: "Total Denda", flex: 1, valueFormatter: (_, row) => formatRupiah(row.totalDenda) },
    { field: "lastUpdated", headerName: "Terakhir Update", flex: 1, valueFormatter: (_, row) => (!row.lastUpdated ? "-" : formatTanggal(row.lastUpdated)) },
    { field: "action", headerName: "", sortable: false, width: 120, align: "right", renderCell: (params) => (
        <button style={{ borderRadius: 999, padding: "6px 12px", border: "none", background: "#8B2320", color: "white", cursor: "pointer" }}
          onClick={() => onSelectLjkDetail(params.row.id, selectedPeriodeId)}>
          Detail
        </button>
      ),
    },
  ];

  // Dummy skeleton rows
  const skeletonRows = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    name: "loading",
    type: "loading",
    statusPelaporan: "loading",
    terlambat: 0,
    tidakMenyampaikan: 0,
    progresPelaporan: 0,
    totalPelaporan: 0,
    totalDenda: 0,
    lastUpdated: null,
  }));

  return (
    <Box sx={{ p: 4, mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 8 }}>Dashboard Laporan</Typography>
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
        <StatCard title="Belum Lapor" value={persentaseLaporan.percentageBelumLapor} loading={loading} />
        <StatCard title="Sudah Lapor Sebagian" value={persentaseLaporan.percentageSudahLaporSebagian} loading={loading} />
        <StatCard title="Sudah Lapor" value={persentaseLaporan.percentageSudahLapor} loading={loading} />
        <StatCard title="Total Denda Seluruh LJK" value={formatRupiah(stats.totalDenda)} loading={loading} />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        List LJK
        <Typography component="span" sx={{ fontSize: 14, ml: 1 }}>
          ({stats.total} kewajiban laporan)
        </Typography>
      </Typography>

      <Box
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <DataGrid
          rows={loading ? skeletonRows : rows}
          columns={columns}
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "rgba(155, 37, 33, 0.1)", borderRadius: 2 },
            "& .MuiDataGrid-row": { borderRadius: 2, "&:hover": { backgroundColor: "#fafafa" } },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
          }}
        />
      </Box>
    </Box>
  );
}

function StatCard({ title, value, loading }) {
  return (
    <Card sx={{ flex: 1, borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14, mb: 1 }}>{title}</Typography>
        {loading ? <Skeleton variant="text" width={100} height={40} /> :
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{value}</Typography>}
      </CardContent>
    </Card>
  );
}
