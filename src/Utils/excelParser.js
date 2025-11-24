// utils/excelParser.js
import * as XLSX from "xlsx";

export const excelParser = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Sheet pertama
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "", // supaya cell kosong tetap string kosong
        });

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};
