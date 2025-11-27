export const laporanLabelMap = {
  RBBPR: "Laporan Rencana Bisnis BPR (RBBPR)",
  PENYESUAIAN_RBBPR: "Penyesuaian RBBPR",
  REALISASI_RBBPR: "Laporan Realisasi Rencana Bisnis BPR (RBBPR)",
  PENGAWASAN_RBBPR: "Laporan Pengawasan Rencana Bisnis BPR (RBBPR)",
  LK_TAHUNAN: "Laporan Keuangan Tahunan",
  LK_PUBLIKASI: "Laporan Keuangan Publikasi",
  LK_PUBLIKASI_BUKTI: "LK Publikasi (Bukti)",
  BMPK: "Laporan Batas Maksimum Pemberian Kredit (BMPK)",
  KOREKSI_BMPK: "Koreksi Laporan BMPK",
  TATA_KELOLA: "Laporan Penerapan Tata Kelola",
  LAPORAN_DIREKSI:
    "Laporan pokok-pokok pelaksanaan tugas Anggota Direksi yang Membawahkan Fungsi Kepatuhan dan/atau Laporan Khusus",
  ACTION_PLAN:
    "Laporan Realisasi Rencana Tindak (Action Plan) Penerapan Manajemen Risiko",
  PROFIL_RISIKO: "Laporan Profil Risiko",
  AUDIT_INTERN:
    "Laporan pelaksanaan dan pokok-pokok hasil audit intern termasuk informasi hasil audit yang bersifat rahasia",
  PENGADUAN_NASABAH: "Laporan Penyelesaian Pengaduan Nasabah",
  LK_TAHUNAN_BUKANANAK:
    "Laporan Keuangan Tahunan (bagi badan hukum yang memiliki saham pada BPR ≥25%)",
};

export const getJenisLabel = (jenis) => laporanLabelMap[jenis] || jenis;
