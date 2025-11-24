import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import OJKLogo from "../assets/OJK_Logo.png";
import Cover from "../assets/background.png";

export default function Signup() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* LEFT SIDE */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 4, md: 8 },
          position: "relative",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            position: "absolute",
            top: 30,
            left: 35,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={OJKLogo}
            alt="OJK Logo"
            style={{ width: 110, height: "auto" }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, mt: 10 }}>
          Buat Akun
        </Typography>

        <Typography sx={{ mb: 3, color: "#555" }}>
          Daftarkan akun Anda untuk menggunakan sistem.
        </Typography>

        <Divider sx={{ my: 2 }}>Lengkapi Form</Divider>

        {/* Form Input */}
        <TextField fullWidth label="Nama Lengkap" sx={{ mb: 2 }} />
        <TextField fullWidth label="Email Institusi" sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} />
        <TextField
          fullWidth
          label="Konfirmasi Password"
          type="password"
          sx={{ mb: 2 }}
        />

        {/* Terms & Policy */}
        <FormControlLabel
          control={<Checkbox />}
          label={
            <span style={{ fontSize: 14 }}>
              Saya menyetujui{" "}
              <span style={{ color: "#0E4C92", textDecoration: "underline" }}>
                Kebijakan Keamanan & Penggunaan Sistem
              </span>
            </span>
          }
          sx={{ mb: 2 }}
        />

        {/* Sign Up Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            py: 1.5,
            backgroundColor: "#7E0E0B",
            ":hover": { backgroundColor: "#5E0A07" },
          }}
        >
          Sign Up
        </Button>

        {/* Footer */}
        <Typography sx={{ mt: 6, fontSize: 13, textAlign: "center", color: "#777" }}>
          © Sistem Pengawasan OJK 2025
        </Typography>
      </Box>

      {/* RIGHT SIDE (SAME AS LOGIN) */}
      <Box
        sx={{
          width: "50%",
          position: "relative",
          backgroundImage: `url(${Cover})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          display: { xs: "none", md: "block" },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        />
      </Box>
    </Box>
  );
}
