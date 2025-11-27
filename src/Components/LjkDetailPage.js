import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Skeleton,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MailIcon from "@mui/icons-material/Mail";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { DataGrid } from "@mui/x-data-grid";
import {
  calculateDenda,
  formatHariMenujuDeadline,
  hitungHariMenujuDeadline,
  formatRupiah,
  formatTanggal,
  getDendaBreakdown,
} from "../Utils/reportHelpers";
import { getStatsForReports, getLaporanFromApi } from "../Utils/reportStats";
import { getLjkFromApi, getPeriodeFromApi } from "../Utils/reportHelpers";
import axios from "axios";
import { LATE_RATE, NO_REPORT_RATE } from "../Utils/reportHelpers";
import { diffInDaysLocal, LATE_WINDOW } from "../Utils/reportHelpers";

const API_BASE =
  "https://dashboard-pengawasan-backend-production-b453.up.railway.app";

export default function LjkDetailPage({ ljkId, periodeId, onBack }) {
  const [ljkList, setLjkList] = useState([]); // data LJK dari /ljk/:id
  const [periode, setPeriode] = useState([]); // laporan untuk periode ini
  const [laporanList, setLaporanList] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // ====== STATE UNTUK MODAL EDIT ======
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tanggalSubmitInput, setTanggalSubmitInput] = useState("");
  const [catatanInput, setCatatanInput] = useState("");
  const [saving, setSaving] = useState(false);

  // ====== DIALOG EMAIL PER ROW ======
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedEmailRow, setSelectedEmailRow] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getLjkFromApi();
      setLjkList(data);

      const periodeTemp = await getPeriodeFromApi();
      const periodeObj = periodeTemp.find((l) => l.id === periodeId);
      setPeriode(periodeObj ? periodeObj.label : "-");

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
    () =>
      laporanList.filter((r) => r.ljkId === ljkId && r.periodeId === periodeId),
    [ljkId, periodeId, laporanList]
  );

  const stats = useMemo(() => getStatsForReports(reports), [reports]);

  // const rows = reports.map((r) => {
  //   const template = TEMPLATES.find((t) => t.id === r.templateId);
  //   const denda = calculateDenda(r);

  //   // console.log("R: ", r)

  //   return {
  //     id: r.id,
  //     jenisLaporan: template?.nama,
  //     deadline: r.deadline,
  //     status: r.status,
  //     hariMenujuDeadline: hitungHariMenujuDeadline(r.deadline),
  //     denda,
  //     tanggalSubmit: r.tanggalSubmit,
  //     catatan: r.catatan,
  //   };

  // });

  const rows = reports.map((r) => {

    const denda = calculateDenda(r);
    return {
      id: r.id,
      jenisLaporan: r.jenis,
      deadline: r.deadline,
      status: r.status,
      hariMenujuDeadline: hitungHariMenujuDeadline(r.deadline),
      denda,
      tanggalSubmit: r.tanggalSubmit,
      catatan: r.catatan,
    };
  });

  // helper: apakah baris ini boleh kirim email?
  const canSendEmailForRow = (row) => {
    const hasPenalty =
      row.denda > 0 ||
      row.status === "TERLAMBAT" ||
      row.status === "TIDAK_MENYAMPAIKAN";
    return Boolean(ljk?.email) && hasPenalty;
  };

  const columns = [
    { field: "jenisLaporan", headerName: "Jenis Laporan", flex: 1.3 },
    {
      field: "deadline",
      headerName: "Deadline",
      flex: 1,
      valueFormatter: (_, row) => formatTanggal(row.deadline),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      valueFormatter: (_, row) => {
        if (row.status === "TIDAK_MENYAMPAIKAN") return "TIDAK MENYAMPAIKAN";
        return row.status;
      },
    },
    {
      field: "hariMenujuDeadline",
      headerName: "Hari Menuju Deadline",
      flex: 0.9,
      valueFormatter: (_, row) => {
        return formatHariMenujuDeadline(
          hitungHariMenujuDeadline(row.deadline),
          row.status,
          row.tanggalSubmit
        );
      },
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
      valueFormatter: (_, row) => {
        if (!row.tanggalSubmit) return "-"; // null / undefined → "-"
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
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{}}>
          <Button
            size="small"
            variant="text"
            onClick={() => handleOpenModal(params.row)}
          >
            <ModeEditIcon sx={{ color: "#8B2320" }}></ModeEditIcon>
          </Button>
          <Button
            size="small"
            variant="text"
            color="#8B2320"
            disabled={!canSendEmailForRow(params.row)}
            onClick={() => handleOpenEmailDialog(params.row)}
          >
            <MailIcon
              sx={{
                color: !canSendEmailForRow(params.row) ? "grey" : "#8B2320",
              }}
            ></MailIcon>
          </Button>
        </Box>
      ),
    },
    // {
    //   field: "actionEmail",
    //   headerName: "Notifikasi",
    //   width: 100,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <Button
    //         size="small"
    //         variant="outlined"
    //         disabled={!canSendEmailForRow(params.row)}
    //         onClick={() => handleOpenEmailDialog(params.row)}
    //       >
    //         Email
    //       </Button>
    //   ),
    //   },
  ];

  // // ====== HITUNG STATUS BARU BERDASARKAN RULE ======
  // const getNewStatus = (row, tanggalSubmitIso) => {
  //   // kalau tidak ada tanggal submit, jangan ubah status
  //   if (!tanggalSubmitIso) return row.status;

  //   // kalau sudah TERLAMBAT atau TIDAK_MENYAMPAIKAN → status lock
  //   if (row.status === "TERLAMBAT" || row.status === "TIDAK_MENYAMPAIKAN") {
  //     return row.status;
  //   }

  //   // kalau awalnya BELUM → tentukan SUDAH / TERLAMBAT
  //   if (row.status === "BELUM") {
  //     const deadline = new Date(row.deadline);
  //     const submitDate = new Date(tanggalSubmitIso);

  //     if (submitDate <= deadline) {
  //       return "SUDAH";
  //     }
  //     return "TERLAMBAT";
  //   }

  //   // kalau SUDAH, dibiarkan SUDAH saja
  //   return row.status;
  // };

  // ====== HITUNG STATUS BARU BERDASARKAN TANGGAL SUBMIT ======
  const getNewStatus = (row, tanggalSubmitIso) => {
    // 1. kalau tidak ada tanggal submit → pakai status lama
    if (!tanggalSubmitIso || !row.deadline) return row.status;

    // 2. hitung berapa hari telat berdasarkan tanggal lokal (tanpa jam)
    //    logika sama persis seperti hitung denda
    const daysLate = diffInDaysLocal(tanggalSubmitIso, row.deadline);
    // daysLate:
    //   0  → tepat di hari deadline (atau sebelum, kalau diff <= 0)
    //   1  → telat 1 hari
    //   dst...

    // 3. mapping aturan:
    //    ≤ 0 hari    → SUDAH
    //    1–20 hari   → TERLAMBAT
    //    > 20 hari   → TIDAK_MENYAMPAIKAN
    if (daysLate <= 0) {
      return "SUDAH";
    }

    if (daysLate <= LATE_WINDOW) {
      return "TERLAMBAT";
    }

    return "TIDAK_MENYAMPAIKAN";
  };

  // ====== HANDLE BUKA MODAL EDIT LAPORAN ======
  const handleOpenModal = (row) => {
    setSelectedRow(row);

    // Tanggal input di field date harus format YYYY-MM-DD
    const existingSubmitDate = row.tanggalSubmit
      ? row.tanggalSubmit.slice(0, 10)
      : "";

    setTanggalSubmitInput(existingSubmitDate);
    setCatatanInput(row.catatan || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
    setTanggalSubmitInput("");
    setCatatanInput("");
    setSaving(false);
  };

  // ====== HANDLE SIMPAN (PATCH KE API) ======
  const handleSave = async () => {
    if (!selectedRow) return;
    if (!tanggalSubmitInput) {
      alert("Tanggal pengumpulan harus diisi.");
      return;
    }

    setSaving(true);
    try {
      const isoSubmit = new Date(tanggalSubmitInput).toISOString();

      console.log("Tanggall submit: ", isoSubmit)

      // cari objek laporan asli di state
      const originalLap = laporanList.find((lap) => lap.id === selectedRow.id);
      if (!originalLap) throw new Error("Laporan tidak ditemukan di state");

      const newStatus = getNewStatus(originalLap, isoSubmit);

      const payload = {
        tanggalSubmit: isoSubmit,
        catatan: catatanInput,
        status: newStatus,
      };

      console.log("PAYLOAD: ", payload);

      await axios.patch(`${API_BASE}/laporan/${selectedRow.id}`, payload);

      // update state lokal, TANPA reload
      setLaporanList((prev) =>
        prev.map((lap) =>
          lap.id === selectedRow.id
            ? {
                ...lap,
                tanggalSubmit: isoSubmit,
                catatan: catatanInput,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : lap
        )
      );

      setSaving(false);
      handleCloseModal();
    } catch (err) {
      console.error("Gagal update laporan:", err);
      alert("Gagal menyimpan perubahan.");
      setSaving(false);
    }
  };

  // ====== EMAIL PER ROW ======
  const handleOpenEmailDialog = (row) => {
    setSelectedEmailRow(row);
    setEmailDialogOpen(true);
  };

  const handleCloseEmailDialog = () => {
    setEmailDialogOpen(false);
    setSelectedEmailRow(null);
    setSendingEmail(false);
  };

  function getRateDendaForRow(row) {
    if (row.status === "TERLAMBAT") return LATE_RATE;
    if (row.status === "TIDAK_MENYAMPAIKAN") return NO_REPORT_RATE;
    return 0;
  }

  const handleSendEmail = async () => {
    if (!ljk?.email || !selectedEmailRow) return;

    setSendingEmail(true);
    try {
      const breakdownDenda = getDendaBreakdown(selectedEmailRow);
      const { totalDenda, ratePerDay, totalDaysLate } = breakdownDenda;

      const emailPayload = {
        to: ljk.email,
        subject: "Reminder Laporan Pengawasan",
        reports: [
          {
            namaLaporan: selectedEmailRow.jenisLaporan,
            deadline: selectedEmailRow.deadline.slice(0, 10),
            dendaPerHari: ratePerDay,
            hariTerlambat: totalDaysLate,
            ljk: ljk.name,
            totalDenda: selectedEmailRow.denda,
          },
        ],
      };

      console.log("email Payload: ", emailPayload);

      await axios.post(`${API_BASE}/send-email`, emailPayload);

      setSendingEmail(false);
      setEmailDialogOpen(false);
      setSelectedEmailRow(null);
      alert("Email reminder berhasil dikirim.");
    } catch (err) {
      console.error("Gagal mengirim email reminder:", err);
      alert("Gagal mengirim email reminder.");
      setSendingEmail(false);
    }
  };

  // const handleSendEmail = async (row) => {
  //   try {
  //     // Breakdown denda dari helper (supaya konsisten dengan tampilan UI)
  //     const breakdown = getDendaBreakdown(row);
  //     const { totalDenda, ratePerDay, totalDaysLate } = breakdown;

  //     // nama LJK bisa kamu ambil dari state / props, misal:
  //     const ljkName = ljk?.name || "-";         // sesuaikan dengan variabelmu
  //     const ljkEmail = ljk?.email || "";        // kalau mau kirim ke email LJK

  //     const payload = {
  //       to: ljkEmail,
  //       subject: "Reminder Laporan Pengawasan",
  //       reports: [
  //         {
  //           namaLaporan: row.jenisLaporan || row.template?.nama || "-", // sesuaikan
  //           deadline: new Date(row.deadline).toISOString().slice(0, 10), // YYYY-MM-DD
  //           ljk: ljkName,
  //           rateDenda: ratePerDay,          // ⬅️ rate per hari yang dipakai
  //           denda: totalDenda,              // ⬅️ total denda hari ini
  //           totalHariTerlambat: totalDaysLate, // ⬅️ ini yang kamu mau kirim
  //         },
  //       ],
  //     };

  //     console.log("PAYLOAD: ", payload);

  //     await axios.post(
  //       "https://dashboard-pengawasan-backend-production-b453.up.railway.appsend-email",
  //       payload
  //     );

  //     // kasih snackbar sukses dsb
  //   } catch (err) {
  //     console.error("Gagal mengirim email reminder:", err);
  //     // snackbar error
  //   }
  // };

  return (
    <Box sx={{ p: 4, mt: 9 }}>
      <Button
        variant="text"
        onClick={onBack}
        sx={{ mt: 2, mb: 3, p: 0, color: "#8B2320" }}
      >
        <ArrowBackIosNewIcon></ArrowBackIosNewIcon> Kembali
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
          {loading ? (
            <Skeleton variant="text" width={200} height={60} />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {ljk?.name}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 3,
            fontSize: 14,
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{ fontSize: 11, fontWeight: "bold", color: "#8B2320" }}
            >
              Email
            </Typography>
            {loading ? (
              <Skeleton variant="text" height={30} width={150} />
            ) : (
              <Typography>{ljk?.email}</Typography>
            )}
          </Box>

          <Box sx={{ borderRight: "1px dashed #999", height: "28px" }} />

          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{ fontSize: 11, fontWeight: "bold", color: "#8B2320" }}
            >
              Periode Laporan
            </Typography>
            {loading ? (
              <Skeleton variant="text" height={30} width={100} />
            ) : (
              <Typography>{periode}</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Statistik cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <StatCard title="Belum Lapor" value={stats.belum} loading={loading} />
        <StatCard title="Sudah Lapor" value={stats.sudah} loading={loading} />
        <StatCard title="Terlambat" value={stats.terlambat} loading={loading} />
        <StatCard
          title="Tidak menyampaikan"
          value={stats.tidakMenyampaikan}
          loading={loading}
        />
        <StatCard
          title="Total Denda"
          value={formatRupiah(stats.totalDenda)}
          loading={loading}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        {loading ? <Skeleton height={60} width={200} /> : `Laporan ${periode}`}
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
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={50}
              sx={{ mb: 1, borderRadius: 2 }}
            />
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
              "& .MuiDataGrid-row": {
                borderRadius: 2,
                "&:hover": { backgroundColor: "#fafafa" },
              },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
            }}
          />
        )}
      </Box>
      {/* ====== MODAL EDIT LAPORAN ====== */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Laporan</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Jenis Laporan"
                value={selectedRow.jenisLaporan || ""}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Deadline"
                value={formatTanggal(selectedRow.deadline)}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Tanggal Pengumpulan"
                type="date"
                fullWidth
                value={tanggalSubmitInput}
                onChange={(e) => setTanggalSubmitInput(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Catatan"
                multiline
                minRows={3}
                fullWidth
                value={catatanInput}
                onChange={(e) => setCatatanInput(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ pr: 3, py: 2 }}>
          <Button onClick={handleCloseModal} color="inherit" disabled={saving}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{ backgroundColor: "#8B2320" }}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG KONFIRMASI EMAIL PER ROW */}
      <Dialog
        open={emailDialogOpen}
        onClose={handleCloseEmailDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Konfirmasi Kirim Email</DialogTitle>
        <DialogContent dividers>
          {selectedEmailRow && (
            <>
              <Typography sx={{ mb: 1 }}>Kirim email reminder ke:</Typography>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                {ljk?.name} ({ljk?.email || "email tidak tersedia"})
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 1 }}>
                Laporan: <b>{selectedEmailRow.jenisLaporan}</b>
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 1 }}>
                Deadline: <b>{formatTanggal(selectedEmailRow.deadline)}</b>
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 2 }}>
                Denda saat ini: <b>{formatRupiah(selectedEmailRow.denda)}</b>
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#555" }}>
                Email ini berisi pengingat bahwa laporan tersebut{" "}
                {selectedEmailRow.status === "TERLAMBAT"
                  ? "terlambat disampaikan."
                  : selectedEmailRow.status === "TIDAK_MENYAMPAIKAN"
                  ? "belum disampaikan melewati batas waktu."
                  : "memiliki denda terkait keterlambatan."}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ pr: 3, py: 2 }}>
          <Button
            color=""
            onClick={handleCloseEmailDialog}
            disabled={sendingEmail}
          >
            Batal
          </Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            disabled={sendingEmail || !selectedEmailRow}
            sx={{ backgroundColor: "#8B2320" }}
          >
            {sendingEmail ? "Mengirim..." : "Kirim Email"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function StatCard({ title, value, loading }) {
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

        {loading ? (
          <Skeleton variant="text" width={130} height={50} />
        ) : (
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
