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
import { useNavigate } from "react-router-dom";

import OJKLogo from "../assets/OJK_Logo.png";
import Cover from "../assets/background.png";

export default function Login() {
  const navigate = useNavigate(); // ✔ di dalam komponen

  const handleLogin = () => {
    navigate("/home");
  };
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
        {/* 🔥 TOP-LEFT LOGO */}
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
          Sign in
        </Typography>

        <Typography sx={{ mb: 3, color: "#555" }}>
          Login untuk mengakses dashboard pengawasan.
        </Typography>

        <Divider sx={{ my: 2 }}>Masuk</Divider>

        {/* Form input */}
        <TextField fullWidth label="Email" sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} />

        {/* Remember & Forgot */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <FormControlLabel control={<Checkbox />} label="Remember me" />

          <Typography
            sx={{
              cursor: "pointer",
              color: "#0E4C92",
              fontSize: 14,
              textDecoration: "underline",
            }}
          >
            Forgot password?
          </Typography>
        </Box>

        {/* Submit Button */}
        <Button
          fullWidth
          onClick={handleLogin}
          variant="contained"
          sx={{
            py: 1.5,
            backgroundColor: "#7E0E0B",
            ":hover": { backgroundColor: "#5E0A07" },
          }}
        >
          Sign in
        </Button>

        {/* Footer */}
        <Typography
          sx={{ mt: 6, fontSize: 13, textAlign: "center", color: "#777" }}
        >
          © Sistem Pengawasan OJK 2025
        </Typography>
      </Box>

      {/* RIGHT SIDE IMAGE */}
      <Box
        sx={{
          width: "50%",
          position: "relative",
          backgroundImage: `url(${Cover})`,
          backgroundSize: "cover",
          backgroundPosition: "top center", // crop ke atas
          backgroundRepeat: "no-repeat",
          display: { xs: "none", md: "block" },
          overflow: "hidden",
        }}
      >
        {/* Overlay for darkness + blur */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            // backdropFilter: "blur(1px)", // efek blur
            backgroundColor: "rgba(0,0,0,0.45)", // gelap 45%
          }}
        />
      </Box>
    </Box>
  );
}
