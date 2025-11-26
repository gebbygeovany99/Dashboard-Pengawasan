// src/utils/reportStats.js
import { REPORTS } from "../Data/data";
import { calculateDenda } from "./reportHelpers";

export function getReportsByPeriode(periodeId) {
  return REPORTS.filter((r) => r.periodeId === periodeId);
}

export function getStatsForReports(reports) {
  const total = reports.length;
  let belum = 0;
  let sudah = 0;
  let terlambat = 0;
  let tidak = 0;
  let totalDenda = 0;

  reports.forEach((r) => {
    if (r.status === "BELUM") belum++;
    if (r.status === "SUDAH") sudah++;
    if (r.status === "TERLAMBAT") terlambat++;
    if (r.status === "TIDAK_MENYAMPAIKAN") tidak++;

    totalDenda += calculateDenda(r);
  });

  return { total, belum, sudah, terlambat, tidakMenyampaikan: tidak, totalDenda };
}

// status per LJK untuk tabel dashboard
export function getStatusPerLjkForPeriode(periodeId) {
  const reports = getReportsByPeriode(periodeId);
  const byLjk = {};

  reports.forEach((r) => {
    if (!byLjk[r.ljkId]) byLjk[r.ljkId] = [];
    byLjk[r.ljkId].push(r);
  });

  const result = [];

  Object.entries(byLjk).forEach(([ljkId, list]) => {
    const stats = getStatsForReports(list);

    let statusPelaporan = "Belum Lapor";
    if (stats.total === 0) {
      statusPelaporan = "-";
    } else if (
      stats.sudah === stats.total &&
      stats.terlambat === 0 &&
      stats.tidakMenyampaikan === 0
    ) {
      statusPelaporan = "Sudah Lapor";
    } else if (
      stats.sudah === 0 &&
      stats.terlambat === 0 &&
      stats.tidakMenyampaikan === 0
    ) {
      statusPelaporan = "Belum Lapor";
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
      totalDenda: stats.totalDenda,
      lastUpdated,
    });
  });

  return result;
}
