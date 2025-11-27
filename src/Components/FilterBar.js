import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import axios from "axios";

export default function FilterBar({
  selectedKategori,
  selectedTahun,
  selectedPeriodeId,
  onChangeKategori,
  onChangeTahun,
  onChangePeriode,
}) {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await axios.get("https://dashboard-pengawasan-backend-production-b453.up.railway.app/periode");
        setPeriods(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeriodes();
  }, []);

  // ----------------------------------------------------------
  // 2. Kategori unik
  const kategoriOptions = useMemo(() => {
    const set = new Set(periods.map((p) => p.kategori));
    return Array.from(set);
  }, [periods]);

  useEffect(() => {
    if (!selectedKategori && kategoriOptions.length > 0) {
      onChangeKategori(kategoriOptions[3]);
    }
  }, [kategoriOptions, selectedKategori]);

  // ----------------------------------------------------------
  // 3. Tahun
  const tahunOptions = useMemo(() => {
    return Array.from(
      new Set(
        periods
          .filter((p) => p.kategori === selectedKategori)
          .map((p) => p.tahun)
      )
    ).sort();
  }, [periods, selectedKategori]);

  useEffect(() => {
    if (selectedKategori && !selectedTahun && tahunOptions.length > 0) {
      onChangeTahun(tahunOptions[0]);
    }
  }, [tahunOptions, selectedKategori]);

  // ----------------------------------------------------------
  // 4. Periode
  const periodeOptions = useMemo(() => {
    return periods.filter(
      (p) => p.kategori === selectedKategori && p.tahun === selectedTahun
    );
  }, [periods, selectedKategori, selectedTahun]);

  useEffect(() => {
    if (
      selectedKategori &&
      selectedTahun &&
      selectedPeriodeId &&
      periodeOptions.length > 0
    ) {
      onChangePeriode(periodeOptions[0].id);
    }
  }, [periodeOptions, selectedKategori, selectedTahun]);

  // ----------------------------------------------------------
  // Skeleton loader item (3 bar)
  const skeletonItems = (
    <>
      <MenuItem disabled>
        <Skeleton variant="rectangular" width="100%" height={32} />
      </MenuItem>
      <MenuItem disabled>
        <Skeleton variant="rectangular" width="100%" height={32} />
      </MenuItem>
      <MenuItem disabled>
        <Skeleton variant="rectangular" width="100%" height={32} />
      </MenuItem>
    </>
  );

  // ----------------------------------------------------------
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {/* Dropdown 1: Jenis Laporan */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="kategori-label">Jenis Laporan</InputLabel>
        <Select
          labelId="kategori-label"
          label="Jenis Laporan"
          value={selectedKategori || ""}
          onChange={(e) => onChangeKategori(e.target.value)}
        >
          {loading && skeletonItems}

          {!loading &&
            kategoriOptions.map((k) => (
              <MenuItem key={k} value={k}>
                {k.charAt(0).toUpperCase() + k.slice(1).toLowerCase()}
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
          value={selectedTahun || ""}
          onChange={(e) => onChangeTahun(e.target.value)}
        >
          {loading && skeletonItems}

          {!loading &&
            tahunOptions.map((t) => (
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
          value={selectedPeriodeId || ""}
          onChange={(e) => onChangePeriode(e.target.value)}
        >
          {loading && skeletonItems}

          {!loading &&
            periodeOptions.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
