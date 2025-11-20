// import { 
//   Card,
//   CardActions,
//   CardContent,
//   Box,
//   Typography,
//  } from '@mui/material';
import React, { useState, useRef } from "react";
import { ColorPallete } from './ColorPallete';
import InputFileUpload from './InputFileUpload';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FileList from './FileList';
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
} from "@mui/material";



export default function BasicCard() {

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFiles = async (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    const incomingFile = incomingFiles[0];
    const jsonData = await parseExcelFile(incomingFile);

    setRows(jsonData);
    if (jsonData.length > 0) {
      setColumns(Object.keys(jsonData[0]));
    }
    // Convert FileList → Array
    const list = Array.from(incomingFiles);

    // Tambahkan ke list sebelumnya (ini versi append semua file yang diupload bukan replace)
    setFiles((prev) => [...prev, ...list]);

      // GANTI: Replace file lama dengan file baru
    // setFiles(list);
    console.log(list);
    console.log(jsonData);
    console.log(jsonData[0]['Nama LJK']);

  };

  
  // untuk 1 file saja
  // const [fileName, setFileName] = useState("");

  // const handleFiles = (files) => {
  //   if (!files || files.length === 0) return;

  //   const file = files[0]; // ambil satu dulu
  //   setFileName(file.name);

  //   // Di sini nanti kamu proses / kirim ke backend
  //   console.log("Files selected:", files);
  // };

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
    
    // Untuk 1 file 
    // const files = Array.from(event.dataTransfer.files || []);
    // handleFiles(files);
  };

  const handleRemove = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setRows([]);
  };


  return (
    <Card sx={{ 
      minWidth: 275, 
      mt: 5, 
      borderRadius: '30px', 
      height: "80vh",
      alignContent: 'center',
      backgroundColor: isDragging ? "#fff6f0" : "#ffffff",
      transition: "background-color 0.2s",
      }}
      // AREA DROP / CLICK
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent>
          <InsertDriveFileOutlinedIcon sx={{
            fontSize:'100px', 
            borderRadius: '50%',
            background: ColorPallete.abuMuda,
            padding: 2,
            marginBottom: 2
            }}
          />
          <Box>
            <InputFileUpload 
              text="Unggah File"
              onFilesSelected={handleFiles}
            />
            <Box sx={{
              justifyContent:'center',
              marginTop: 1,
            }}>
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
              Atau seret dan letakkan file Excel atau CSV di sini untuk mengunggah.
            </Typography>
            <Typography variant="subtitle1" lineHeight={1}>
              Anda juga dapat mengklik area ini untuk memilih file dengan format .xlsx, .xls, atau .csv dari perangkat Anda.
            </Typography>
            </Box>

            <FileList sx={{
              overflowY: "auto",
              pr: 1,                   
            }} files={files} onRemove={handleRemove} />

{rows.length > 0 && (
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
              {rows.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}



            {/* Untuk 1 File
            {fileName && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              File terpilih: <strong>{fileName}</strong>
            </Typography>
            )} */}
          </Box>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  );
}