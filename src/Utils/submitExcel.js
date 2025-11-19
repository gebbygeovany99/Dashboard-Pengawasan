import axios from "axios";

const API_URL =
  "https://dashboard-pengawasan-backend-production-b453.up.railway.app/laporan";

export const submitExcel = async (payload) => {
  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // kembalikan hasil backend
  } catch (error) {
    console.error("submitLaporan API error:", error);
    throw error;
  }
};