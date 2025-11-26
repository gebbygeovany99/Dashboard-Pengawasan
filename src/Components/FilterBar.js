// src/Components/FilterBar.js
import React, { useMemo } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { PERIODS } from "../Data/data";

export default function FilterBar({
  selectedKategori,
  selectedTahun,
  selectedPeriodeId,
  onChangeKategori,
  onChangeTahun,
  onChangePeriode,
}) {
  // dropdown Jenis Laporan
  const kategoriOptions = useMemo(() => {
    const set = new Set(PERIODS.map((p) => p.kategori));
    return Array.from(set);
  }, []);

  // dropdown Tahun
  const tahunOptions = useMemo(() => {
    const set = new Set(PERIODS.map((p) => p.tahun));
    return Array.from(set).sort();
  }, []);

  // dropdown Periode, tergantung kategori + tahun
  const periodeOptions = useMemo(() => {
    return PERIODS.filter(
      (p) => p.kategori === selectedKategori && p.tahun === selectedTahun
    );
  }, [selectedKategori, selectedTahun]);

  // handler lokal (cuma nerusin ke parent)
  const handleKategoriChange = (event) => {
    onChangeKategori(event.target.value);
  };

  const handleTahunChange = (event) => {
    onChangeTahun(event.target.value);
  };

  const handlePeriodeChange = (event) => {
    onChangePeriode(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {/* Dropdown 1: Jenis Laporan */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="kategori-label">Jenis Laporan</InputLabel>
        <Select
          labelId="kategori-label"
          label="Jenis Laporan"
          value={selectedKategori}
          onChange={handleKategoriChange}
        >
          {kategoriOptions.map((k) => (
            <MenuItem key={k} value={k}>
              {k.charAt(0) + k.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dropdown 2: Tahun */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="tahun-label">Tahun</InputLabel>
        <Select
          labelId="tahun-label"
          label="Tahun"
          value={selectedTahun}
          onChange={handleTahunChange}
        >
          {tahunOptions.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dropdown 3: Periode */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="periode-label">Periode</InputLabel>
        <Select
          labelId="periode-label"
          label="Periode"
          value={selectedPeriodeId}
          onChange={handlePeriodeChange}
        >
          {periodeOptions.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
