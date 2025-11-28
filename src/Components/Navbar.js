import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";

import OJKLogo from "../assets/OJK_Logo.png";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        boxShadow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64, py: 0 }}>
  {/* Logo OJK */}
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
    <img
      src={OJKLogo}
      alt="logo"
      style={{ width: 80, height: 80, objectFit: "contain" }}
    />
    </Box>
    
    {/* Vertical Divider */}
  <Box
    sx={{
      width: "1px",
      height: 40,
      backgroundColor: "#D1D5DB", // soft grey (UI friendly)
      mx: 2,                      // jarak kiri-kanan
    }}
  />

    {/* Judul SIMOLA */}
  <Box sx={{ display: "flex", flexDirection: "column", marginTop: '6px' }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#7E0E0B", // maroon OJK
        lineHeight: 1.1,
      }}
    >
      SIMOLA
    </Typography>

    <Typography
      variant="body2"
      sx={{
        fontSize: 11,
        color: "#4B5563",
      }}
    >
      Sistem Monitoring Laporan Pengawasan
    </Typography>
  </Box>
  </Box>

  {/* Spacer biar avatar ke kanan */}
  <Box sx={{ flexGrow: 1 }} />

  {/* Avatar user */}
  <Box sx={{ flexGrow: 0 }}>
    <Tooltip title="Open settings">
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar alt="Remyarp" src="/static/images/avatar/2.jpg" />
      </IconButton>
    </Tooltip>
    <Menu
      sx={{ mt: "45px" }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
    >
      {settings.map((setting) => (
        <MenuItem key={setting} onClick={handleCloseUserMenu}>
          <Typography sx={{ textAlign: "center" }}>
            {setting}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  </Box>
</Toolbar>

        {/* <Toolbar disableGutters sx={{ minHeight: 64, py: 0 }}>
          <img
            src={OJKLogo}
            alt="logo"
            style={{ width: 80, height: 80 , objectFit: "contain"}}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Profile" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting === "Logout") handleLogout();
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar> */}
      </Container>
    </AppBar>
  );
}

export default Navbar;
