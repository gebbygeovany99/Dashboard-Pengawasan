// src/utils/reportHelpers.js
import axios from "axios";
import { LJK } from "../Data/data";

export async function getLjkFromApi() {
  const response = await axios.get(
    "https://dashboard-pengawasan-backend-production-b453.up.railway.app/ljk"
  );
  return response.data; // array
}

export async function getPeriodeFromApi() {
  const response = await axios.get(
    "https://dashboard-pengawasan-backend-production-b453.up.railway.app/periode"
  );
  return response.data; // array
}

export function getLjkById(id) {
  return LJK.find((item) => item.id === id);
}

export const LATE_RATE = 100000; // Rp 100.000 / hari (TERLAMBAT)
export const NO_REPORT_RATE = 300000; // Rp 300.000 / hari (NO REPORT)
export const MAX_DENDA = 5000000; // Plafon maks denda, misalnya 5 juta
export const LATE_WINDOW = 20; // 20 hari pertama dianggap late-report

const MS_PER_DAY = 24 * 60 * 60 * 1000;


// INI SUDAH TIDAK TERPAKAI FUNGSINYA
// export function calculateDenda(laporan) {
//   // const LATE_RATE = 100000; // Rp 100.000 / hari (TERLAMBAT)
//   // const NO_REPORT_RATE = 300000; // Rp 300.000 / hari (NO REPORT)
//   // const MAX_DENDA = 5000000; // Plafon denda, misalnya 5 juta

//   const MS_PER_DAY = 24 * 60 * 60 * 1000;

//   const normalizeDate = (d) =>
//     new Date(d.getFullYear(), d.getMonth(), d.getDate());

//   if (!laporan || !laporan.deadline) return 0;

//   const { status, deadline, tanggalSubmit } = laporan;

//   // Status tanpa denda
//   if (status === "SUDAH" || status === "BELUM") {
//     return 0;
//   }

//   const deadlineDate = normalizeDate(new Date(deadline));
//   const submitDate = normalizeDate(
//     tanggalSubmit ? new Date(tanggalSubmit) : new Date()
//   );

//   let diffMs = submitDate - deadlineDate;
//   let totalDaysLate = Math.round(diffMs / MS_PER_DAY);

//   if (totalDaysLate <= 0) {
//     // Kalau ternyata effective <= deadline, berarti sebenarnya tidak telat
//     return 0;
//   }

//   // ------- TERLAMBAT -------
//   if (status === "TERLAMBAT") {
//     const denda = totalDaysLate * LATE_RATE;
//     return Math.min(denda, MAX_DENDA);
//   }

//   // ------- TIDAK_MENYAMPAIKAN -------
//   if (status === "TIDAK_MENYAMPAIKAN") {
//     const daysLateReport = Math.min(totalDaysLate, LATE_WINDOW);
//     const daysNoReport = Math.max(totalDaysLate - LATE_WINDOW, 0);

//     let denda = daysLateReport * LATE_RATE + daysNoReport * NO_REPORT_RATE;

//     if (denda > MAX_DENDA) {
//       denda = MAX_DENDA;
//     }

//     return denda;
//   }

//   // Fallback kalau status lain
//   return 0;
// }

// ====== NORMALISASI TANGGAL KE 00:00 LOKAL ======
function normalizeToMidnight(dateLike) {
  const d = new Date(dateLike);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Selisih hari lokal (later - earlier) dalam satuan hari kalender
export function diffInDaysLocal(later, earlier) {
  const dLater = normalizeToMidnight(later);
  const dEarlier = normalizeToMidnight(earlier);
  const diffMs = dLater - dEarlier;
  // floor → kalau beda 1 hari pas, hasilnya 1
  return diffMs > 0 ? Math.floor(diffMs / MS_PER_DAY) : 0;
}

/**
 * Menghitung breakdown denda:
 * - totalDaysLate   : total hari telat sejak deadline
 *   (pakai tanggalSubmit || hari ini)
 * - daysLateReport  : hari ke-1 s.d ke-20 (kena rate TERLAMBAT)
 * - daysNoReport    : hari ke-21 dst (kena rate TIDAK_MENYAMPAIKAN)
 * - totalDenda      : denda total (dibatasi MAX_DENDA)
 * - ratePerDay      : rate efektif yang relevan saat ini
 *   (0 / LATE_RATE / NO_REPORT_RATE) 
*/
export function getDendaBreakdown(laporan, today = new Date()) {
  if (!laporan || !laporan.deadline) {
    return {
      totalDaysLate: 0,
      daysLateReport: 0,
      daysNoReport: 0,
      totalDenda: 0,
      ratePerDay: 0,
    };
  }

  const deadline = normalizeToMidnight(laporan.deadline);
  const referenceDate = laporan.tanggalSubmit
    ? normalizeToMidnight(laporan.tanggalSubmit)
    : normalizeToMidnight(today);

    // berapa hari selisih antara referenceDate dan deadline (>= 0)
  const totalDaysLate = diffInDaysLocal(referenceDate, deadline);

  if (totalDaysLate <= 0) {
    return {
      totalDaysLate: 0,
      daysLateReport: 0,
      daysNoReport: 0,
      totalDenda: 0,
      ratePerDay: 0,
    };
  }

  const diffMs = referenceDate - deadline;

  // 1–20 hari → terlambat
  const daysLateReport = Math.min(totalDaysLate, LATE_WINDOW);
  // hari ke-21 dst → tidak menyampaikan
  const daysNoReport = Math.max(totalDaysLate - LATE_WINDOW, 0);

  const dendaLate = daysLateReport * LATE_RATE;
  const dendaNoReport = daysNoReport * NO_REPORT_RATE;

  let totalDenda = dendaLate + dendaNoReport;
  if (totalDenda > MAX_DENDA) {
    totalDenda = MAX_DENDA;
  }

  let ratePerDay = 0;
  if (totalDaysLate === 0) {
    ratePerDay = 0;
  } else if (daysNoReport > 0) {
    ratePerDay = NO_REPORT_RATE;
  } else {
    ratePerDay = LATE_RATE;
  }

  return {
    totalDaysLate,
    daysLateReport,
    daysNoReport,
    totalDenda,
    ratePerDay,
  };
}

// Fungsi yang sudah dipakai di dashboard/detail tetap jalan:
export function calculateDenda(laporan, today) {
  return getDendaBreakdown(laporan, today).totalDenda;
}

export function formatRupiah(amount) {
  if (!amount || amount === 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTanggal(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ====== HARI MENUJU DEADLINE ======
export function hitungHariMenujuDeadline(deadlineIso) {
  if (!deadlineIso) return 0;
  // if(status == "SUDAH"  || status == "TIDAK_MENYAMPAIKAN"  || tanggalSubmit ) return "-"

  // const today = new Date();
  // const deadline = new Date(deadlineIso);
  // const diffMs = deadline - today;
  // const diffHari = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // // if (diffHari == 0) return 0
  // // if (diffHari < 0 ) return "-"
  // return diffHari;

  const today = normalizeToMidnight(new Date());
  const deadline = normalizeToMidnight(deadlineIso);

  const diffMs = deadline - today;
  const diffHari = Math.floor(diffMs / MS_PER_DAY);

  return diffHari; // bisa negatif kalau sudah lewat deadline
}

export function formatHariMenujuDeadline(diffHari, status, tanggalSubmit) {
  if (
    diffHari <= 0 ||
    status === "SUDAH" ||
    status === "TIDAK_MENYAMPAIKAN" ||
    tanggalSubmit
  )
    return "-";
  return `${diffHari} Hari Lagi`;
}
