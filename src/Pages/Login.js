import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import OJKLogo from "../assets/OJK_Logo.png";
import Cover from "../assets/background.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false); // <<< LOADING STATE

  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true); // start loading

    try {
      const response = await axios.post(
        "https://dashboard-pengawasan-backend-production-b453.up.railway.app/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.href = "/"; // atau window.location.replace("/") untuk tidak menyimpan history
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setErrorMsg(
        err.response?.data?.error || "Gagal login. Terjadi kesalahan server."
      );
    } finally {
      setLoading(false); // stop loading
    }
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
        {/* Logo */}
        <Box
          sx={{
            position: "absolute",
            top: 30,
            left: 60,
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

        {/* Error Message */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Form */}
        <TextField
          fullWidth
          label="Email"
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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

        {/* Login Button */}
        <Button
          fullWidth
          loading={loading}
          onClick={handleLogin}
          variant="contained"
          disabled={loading} // disable saat loading
          sx={{
            py: 1.5,
            backgroundColor: "#7E0E0B",
            ":hover": { backgroundColor: "#5E0A07" },
          }}
        >
          Sign in
        </Button>

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
