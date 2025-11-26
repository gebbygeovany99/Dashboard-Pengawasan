// src/utils/reportStats.js
import { REPORTS } from "../Data/data";
import { calculateDenda } from "./reportHelpers";
import axios from "axios";

export async function getLaporanFromApi() {
  const response = await axios.get("https://dashboard-pengawasan-backend-production-b453.up.railway.app/laporan");
  return response.data; // array
}

export function getReportsByPeriode(periodeId, laporan = []) {
  if (!Array.isArray(laporan)) return [];
  const filtered = laporan.filter((r) => r.periodeId === periodeId);
  // console.log(filtered);
  return filtered;
}

export function getPersentaseLaporan(rows, stats) {
  let countBelumLapor = 0;
  let countSudahLaporSebagian = 0;
  let countSudahLapor = 0;

  const totalLapor = stats.total;
  // console.log("Total: ", totalLapor)

  rows.map((data) => {
    if (data.statusPelaporan == "Belum Lapor") {
      countBelumLapor += 1;
      // console.log("data: ", countBelumLapor)

    } else if (data.statusPelaporan == "Sudah Lapor") {
      countSudahLapor += 1;
    } else {
      countSudahLaporSebagian += 1;
    }
  });

  const percentageBelumLapor =
    ((countBelumLapor / totalLapor) * 100).toFixed(2) + "%";
  const percentageSudahLapor =
    ((countSudahLapor / totalLapor) * 100).toFixed(2) + "%";
  const percentageSudahLaporSebagian =
    ((countSudahLaporSebagian / totalLapor) * 100).toFixed(2) + "%";

  return {
    percentageBelumLapor,
    percentageSudahLapor,
    percentageSudahLaporSebagian,
  };
};

export function getStatsForReports(reports) {
  const total = reports.length;
  let belum = 0;
  let sudah = 0;
  let terlambat = 0;
  let tidak = 0;
  let totalDenda = 0;
  const submittedCount = reports.filter((r) => r.tanggalSubmit != null).length;

  reports.forEach((r) => {
    if (r.status === "BELUM") belum++;
    if (r.status === "SUDAH") sudah++;
    if (r.status === "TERLAMBAT") terlambat++;
    if (r.status === "TIDAK_MENYAMPAIKAN") tidak++;

    totalDenda += calculateDenda(r);
  });

  return {
    total,
    belum,
    sudah,
    terlambat,
    tidakMenyampaikan: tidak,
    totalDenda,
    submittedCount,
  };
}

// status per LJK untuk tabel dashboard
export function getStatusPerLjkForPeriode(periodeId, laporan) {
  const reports = getReportsByPeriode(periodeId, laporan);
  const byLjk = {};

  reports.forEach((r) => {
    if (!byLjk[r.ljkId]) byLjk[r.ljkId] = [];
    byLjk[r.ljkId].push(r);
  });

  const result = [];

  Object.entries(byLjk).forEach(([ljkId, list]) => {
    const stats = getStatsForReports(list);

    // logic untuk mendapatkan status tiap LJK berdasarkan status
    // let statusPelaporan = "Belum Lapor";
    // if (stats.total === 0) {
    //   statusPelaporan = "-";
    // } else if (
    //   stats.sudah === stats.total &&
    //   stats.terlambat === 0 &&
    //   stats.tidakMenyampaikan === 0
    // ) {
    //   statusPelaporan = "Sudah Lapor";
    // } else if (
    //   stats.sudah === 0 &&
    //   stats.terlambat === 0 &&
    //   stats.tidakMenyampaikan === 0
    // ) {
    //   statusPelaporan = "Belum Lapor";
    // } else {
    //   statusPelaporan = "Sudah Lapor Sebagian";
    // }

    let statusPelaporan = "Belum Lapor";

    if (stats.total === 0) {
      statusPelaporan = "-";
    } else if (stats.submittedCount === 0) {
      statusPelaporan = "Belum Lapor";
    } else if (stats.submittedCount === stats.total) {
      statusPelaporan = "Sudah Lapor";
    } else {
      statusPelaporan = "Sudah Lapor Sebagian";
    }

    const lastUpdated = list.reduce(
      (latest, r) =>
        !latest || new Date(r.updatedAt) > new Date(latest)
          ? r.updatedAt
          : latest,
      null
    );

    result.push({
      ljkId,
      totalLaporan: stats.total,
      statusPelaporan,
      terlambat: stats.terlambat,
      tidakMenyampaikan: stats.tidakMenyampaikan,
      progresPelaporan: stats.submittedCount,
      totalPelaporan: stats.total,
      totalDenda: stats.totalDenda,
      lastUpdated,
    });
  });

  return result;
}
