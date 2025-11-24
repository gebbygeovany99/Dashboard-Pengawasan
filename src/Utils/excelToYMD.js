import * as XLSX from "xlsx";

export const excelToYMD = (value) => {
  // Jika sudah Date object
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  // Jika masih angka Excel (serial number)
  if (typeof value === "number") {
    const { y, m, d } = XLSX.SSF.parse_date_code(value);
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  // Jika string date (fallback)
  if (typeof value === "string" && value.trim() !== "") {
    return new Date(value).toISOString().split("T")[0];
  }

  return null;
};
