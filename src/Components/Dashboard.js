// src/Dashboard.js
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Chip,
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
import Calendar from "./Calendar";
import dayjs from "dayjs";

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
  const [calendarOpened, setCalendarOpened] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null); // null = semua
  const [deadlines, setDeadlines] = useState([]); // null = semua

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

  useEffect(() => {
    if (laporan && laporan.length > 0) {
      const allDeadlines = laporan.map((item) =>
        dayjs(item.deadline).format("YYYY-MM-DD")
      );

      console.log("Daftar deadline (clean):", allDeadlines);
      setDeadlines(allDeadlines);
    }
  }, [laporan]);

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

  const filteredRows = useMemo(() => {
    if (!statusFilter) return rows;

    // statusFilter pakai label persis seperti di kolom "Status Pelaporan"
    if (statusFilter === "HAS_DENDA") {
      return rows.filter((row) => row.totalDenda > 0);
    }

    return rows.filter((row) => row.statusPelaporan === statusFilter);
  }, [rows, statusFilter]);

  // Persentase laporan
  const persentaseLaporan = useMemo(() => {
    const totalLjk = rows.length;
    if (totalLjk === 0)
      return {
        percentageBelumLapor: "0%",
        percentageSudahLapor: "0%",
        percentageSudahLaporSebagian: "0%",
      };
    let countBelumLapor = 0,
      countSudahLaporSebagian = 0,
      countSudahLapor = 0;
    rows.forEach((row) => {
      if (row.statusPelaporan === "Belum Lapor") countBelumLapor++;
      else if (row.statusPelaporan === "Sudah Lapor") countSudahLapor++;
      else if (row.statusPelaporan === "Sudah Lapor Sebagian")
        countSudahLaporSebagian++;
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
    {
      field: "statusPelaporan",
      headerName: "Status Pelaporan",
      flex: 1,
      renderCell: (params) => {
        const value = params.value;

        let bg = "#E5E7EB";
        let color = "#111827";
        let border = "transparent";

        if (value === "Belum Lapor") {
          bg = "#FEE2E2";
          color = "#B91C1C";
          border = "#FCA5A5";
        } else if (value === "Sudah Lapor Sebagian") {
          bg = "#FEF3C7";
          color = "#D97706";
          border = "#FACC15";
        } else if (value === "Sudah Lapor") {
          bg = "#DCFCE7";
          color = "#15803D";
          border = "#86EFAC";
        }

        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor: bg,
              color,
              borderColor: border,
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              height: 24,
            }}
          />
        );
      },
    },

    { field: "terlambat", headerName: "Terlambat", flex: 0.6, type: "number" },
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
      valueFormatter: (_, row) =>
        row.progresPelaporan + "/" + row.totalPelaporan,
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
      valueFormatter: (_, row) =>
        !row.lastUpdated ? "-" : formatTanggal(row.lastUpdated),
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      width: 120,
      align: "right",
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
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // memastikan vertical align middle
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Dashboard Laporan
          </Typography>

          {/* Grup kanan */}
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <FilterBar
              selectedKategori={selectedKategori}
              selectedTahun={selectedTahun}
              selectedPeriodeId={selectedPeriodeId}
              onChangeKategori={onChangeKategori}
              onChangeTahun={onChangeTahun}
              onChangePeriode={onChangePeriode}
            />
          </Box>
        </Box>
      </Box>

      {/* Cards Statistik */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <StatCard
          title="Belum Lapor"
          value={persentaseLaporan.percentageBelumLapor}
          loading={loading}
          color="#B91C1C"
          bgColor="rgba(185, 28, 28, 0.08)"
          active={statusFilter === "Belum Lapor"}
          onClick={() =>
            setStatusFilter(
              statusFilter === "Belum Lapor" ? null : "Belum Lapor"
            )
          }
        />
        <StatCard
          title="Sudah Lapor Sebagian"
          value={persentaseLaporan.percentageSudahLaporSebagian}
          loading={loading}
          color="#D97706"
          bgColor="rgba(217, 119, 6, 0.08)"
          active={statusFilter === "Sudah Lapor Sebagian"}
          onClick={() =>
            setStatusFilter(
              statusFilter === "Sudah Lapor Sebagian"
                ? null
                : "Sudah Lapor Sebagian"
            )
          }
        />
        <StatCard
          title="Sudah Lapor"
          value={persentaseLaporan.percentageSudahLapor}
          loading={loading}
          color="#15803D"
          bgColor="rgba(21, 128, 61, 0.08)"
          active={statusFilter === "Sudah Lapor"}
          onClick={() =>
            setStatusFilter(
              statusFilter === "Sudah Lapor" ? null : "Sudah Lapor"
            )
          }
        />
        <StatCard
          title="Total Denda Seluruh LJK"
          value={formatRupiah(stats.totalDenda)}
          loading={loading}
          color="#7E0E0B" // maroon OJK
          bgColor="rgba(126, 14, 11, 0.06)"
          active={statusFilter === "HAS_DENDA"}
          onClick={() =>
            setStatusFilter(statusFilter === "HAS_DENDA" ? null : "HAS_DENDA")
          }
        />
      </Box>

      <Box sx={{ mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // memastikan vertical align middle
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            List LJK
            <Typography component="span" sx={{ fontSize: 14, ml: 1 }}>
              ({stats.total} kewajiban laporan)
            </Typography>
          </Typography>

          {/* Grup kanan */}
          <Box
            onClick={() => setCalendarOpened(true)}
            sx={{ display: "flex", gap: 1, mb: 1 }}
          >
            <Calendar highlightedDates={deadlines}></Calendar>
          </Box>
        </Box>
      </Box>

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
          rows={loading ? skeletonRows : filteredRows}
          columns={columns}
          // disableColumnFilter
          // disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
            sorting: { sortModel: [{ field: "name", sort: "asc" }] },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgba(126, 14, 11, 0.08)", // maroon OJK soft
              borderRadius: 2,
            },
            "& .MuiDataGrid-row": {
              borderRadius: 2,
              "&:hover": { backgroundColor: "#F9FAFB" },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #F3F4F6",
              fontSize: 13,
            },
          }}
        />
      </Box>
    </Box>
  );
}

function StatCard({ title, value, loading, onClick, active }) {
  // Warna kontras
  let color = "#111827";
  let bgColor = "white";

  if (title === "Belum Lapor") {
    color = "#B91C1C";
    bgColor = "rgba(185, 28, 28, 0.20)"; // 20% opacity
  } else if (title === "Sudah Lapor Sebagian") {
    color = "#D97706";
    bgColor = "rgba(217, 119, 6, 0.18)";
  } else if (title === "Sudah Lapor") {
    color = "#15803D";
    bgColor = "rgba(21, 128, 61, 0.20)";
  } else if (title === "Total Denda Seluruh LJK" || title === "Total Denda") {
    color = "#7E0E0B";
    bgColor = "rgba(126, 14, 11, 0.20)";
  } else if (title === "Tidak menyampaikan") {
    color = "#7E0E0B";
    bgColor = "rgba(126, 14, 11, 0.20)";
  }

  return (
    <Card
      onClick={onClick}
      sx={{
        flex: 1,
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        backgroundColor: bgColor,
        border: active ? `2px solid ${color}` : "1px solid transparent",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
              transform: "translateY(-1px)",
            }
          : {},
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14, mb: 1, color: "#4B5563" }}>
          {title}
        </Typography>

        {loading ? (
          <Skeleton variant="text" width={100} height={40} />
        ) : (
          <Typography variant="h5" sx={{ fontWeight: "bold", color }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
