// src/utils/reportHelpers.js
import axios from "axios";
import { LJK } from "../Data/data";

export async function getLjkFromApi() {
  const response = await axios.get("https://dashboard-pengawasan-backend-production-b453.up.railway.app/ljk");
  return response.data; // array
}

export async function getPeriodeFromApi() {
  const response = await axios.get("https://dashboard-pengawasan-backend-production-b453.up.railway.app/periode");
  return response.data; // array
}

export function getLjkById(id) {
  return LJK.find((item) => item.id === id);
}

// Dummy rule denda – ntar tinggal disesuaikan
export function calculateDenda(laporan) {
  if (laporan.status === "TERLAMBAT") return 100000;
  if (laporan.status === "TIDAK_MENYAMPAIKAN") return 300000;
  return 0;
}

export function formatRupiah(amount) {
  if (!amount || amount === 0) return "Rp0";
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

export function hitungHariMenujuDeadline(deadlineIso, status, tanggalSubmit) {
  if (!deadlineIso) return "-";
  if (status == "SUDAH" || status == "TIDAK_MENYAMPAIKAN" || tanggalSubmit)
    return "-";

  const today = new Date();
  const deadline = new Date(deadlineIso);
  const diffMs = deadline - today;
  const diffHari = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffHari == 0) return 0;
  if (diffHari < 0) return "-";
  return diffHari;
}
