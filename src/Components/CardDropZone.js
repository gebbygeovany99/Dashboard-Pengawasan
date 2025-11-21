import React, { useState, useRef, useEffect } from "react";
import { ColorPallete } from "./ColorPallete";
import InputFileUpload from "./InputFileUpload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FileList from "./FileList";
import { parseExcelFile } from "../Utils/excelParser";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  SnackbarCloseReason,
  Alert,
} from "@mui/material";
import { excelToYMD } from "../Utils/excelToYMD";
import { submitExcel } from "../Utils/submitExcel";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

export default function BasicCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [submittedFile, setSubmittedFile] = useState([]);
  const [data, setData] = useState([]); // data atau isi tiap barisnya
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [openNotif, setOpenNotif] = useState(false);

  const handleFiles = async (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    const incomingFile = incomingFiles[0]; // pilih file awal
    const jsonData = await parseExcelFile(incomingFile);

    setData(jsonData);
    if (jsonData.length > 0) {
      // ambil judul kolom
      setColumns(Object.keys(jsonData[0]));
    }

    // Convert FileList → Array
    const list = Array.from(incomingFiles);

    // Tambahkan ke list sebelumnya (ini versi append semua file yang diupload bukan replace)
    setFiles((prev) => [...prev, ...list]);
    // setFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    handleFiles(event.dataTransfer.files);
  };

  const handleRemove = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setData([]);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotif(false);
  };

  const handleSubmit = async (index) => {
    console.log(index);

    if (!data || data.length === 0) return;

    const mapped = data.map((row) => ({
      namaLaporan: row[columns[0]],
      jenisLaporan: row[columns[1]],
      tanggalLapor: excelToYMD(row[columns[2]]),
    }));

    // bentuk request ke API POST
    const payload = { laporan: mapped };

    console.log("mapped: ", mapped);
    console.log("Payload: ", payload);

    setLoading(true); // mulai loading
    setUploadResult(null); // reset hasil

    try {
      const result = await submitExcel(payload);
      setUploadResult({ success: true, message: "Upload berhasil!" });
    } catch (err) {
      setUploadResult({
        success: false,
        message: err.response?.data?.error || "Upload gagal",
      });
    }

    setLoading(false); // selesai loading
    setOpenNotif(true);

    return null;
  };

  // useEffect(() => {
  //   console.log("Status updated:", statusList);
  // }, [statusList]);

  return (
    <Card
      sx={{
        minWidth: 275,
        mt: 5,
        borderRadius: "30px",
        height: "80vh",
        alignContent: "center",
        backgroundColor: isDragging ? "#fff6f0" : "#ffffff",
        transition: "background-color 0.2s",
      }}
      // AREA DROP / CLICK
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent>
        <InsertDriveFileOutlinedIcon
          sx={{
            fontSize: "100px",
            borderRadius: "50%",
            background: ColorPallete.abuMuda,
            padding: 2,
            marginBottom: 2,
          }}
        />
        <Box>
          <InputFileUpload text="Unggah File" onFilesSelected={handleFiles} />
          <Box
            sx={{
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Atau seret dan letakkan file Excel atau CSV di sini untuk
              mengunggah.
            </Typography>
            <Typography variant="subtitle1" lineHeight={1}>
              Anda juga dapat mengklik area ini untuk memilih file dengan format
              .xlsx, .xls, atau .csv dari perangkat Anda.
            </Typography>
          </Box>

          <FileList
            sx={{
              overflowY: "auto",
              pr: 1,
            }}
            files={files}
            onRemove={handleRemove}
            onSubmit={handleSubmit}
          />

          {loading && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <CircularProgress />
              <Typography sx={{ mt: 1 }}>Mengunggah laporan...</Typography>
            </Box>
          )}

          {uploadResult && (
            // <Box sx={{ mt: 2 }}>
            //   <Typography
            //     sx={{
            //       color: uploadResult.success ? "green" : "red",
            //       fontWeight: 600,
            //     }}
            //   >
            //     {uploadResult.message}
            //   </Typography>
            // </Box>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={6000}
              open={openNotif}
              onClose={handleClose}
            >
              <Alert
                severity={uploadResult.success ? "success" : "error"}
                onClose={handleClose}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {uploadResult.message}
              </Alert>
            </Snackbar>
          )}

          {/* untuk tampilkan data file dalam bentuk table */}
          {/* {data.length > 0 && (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col} sx={{ fontWeight: 600 }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )} */}

          {/* Untuk 1 File
            {fileName && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              File terpilih: <strong>{fileName}</strong>
            </Typography>
            )} */}
        </Box>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
