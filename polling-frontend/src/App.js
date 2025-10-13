import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import PollList from "./components/pollList";
import PollDetail from "./components/pollDetail";
import CreatePoll from "./components/createPoll";
import Results from "./components/results";
import Register from "./components/register";
import Login from "./components/login";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Fade,
  useScrollTrigger,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// ------------------------- Styled Components -----------------------------

const GlassAppBar = styled(AppBar)(({ scrolled }) => ({
  background: scrolled
    ? "linear-gradient(90deg, rgba(15,15,25,0.95) 0%, rgba(25,25,40,0.95) 100%)"
    : "linear-gradient(90deg, rgba(15,15,25,0.8) 0%, rgba(25,25,40,0.8) 100%)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(99,102,241,0.2)",
  boxShadow: scrolled
    ? "0 4px 30px rgba(99,102,241,0.25)"
    : "0 2px 20px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
}));

const Logo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)",
  },
  transition: "all 0.3s ease",
});

const LogoIcon = styled(Box)({
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
});

const LogoText = styled(Typography)({
  fontWeight: "800",
  fontSize: "20px",
  color: "#f1f5f9",
  letterSpacing: "-0.5px",
});

const NavButton = styled(Button)(({ active }) => ({
  color: active ? "#fff" : "#94a3b8",
  fontWeight: active ? "700" : "600",
  fontSize: "15px",
  textTransform: "none",
  padding: "8px 20px",
  borderRadius: "12px",
  marginLeft: "8px",
  position: "relative",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "20px",
    right: "20px",
    height: "3px",
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    borderRadius: "3px",
    opacity: active ? 1 : 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    background: "rgba(99, 102, 241, 0.15)",
    color: "#fff",
    transform: "translateY(-2px)",
  },
}));

const CreateButton = styled(Button)({
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#fff",
  fontWeight: "700",
  textTransform: "none",
  padding: "10px 24px",
  borderRadius: "12px",
  marginLeft: "16px",
  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
  "&:hover": {
    background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 30px rgba(99, 102, 241, 0.6)",
  },
});

const UserAvatar = styled(Avatar)({
  width: "36px",
  height: "36px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  border: "2px solid rgba(255,255,255,0.15)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const RoleChip = styled(Chip)({
  background: "rgba(168,85,247,0.15)",
  color: "#e9d5ff",
  border: "1px solid rgba(168,85,247,0.3)",
  fontWeight: "700",
  fontSize: "12px",
  height: "26px",
  marginLeft: "12px",
});

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    background: "rgba(20, 25, 45, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  "& .MuiMenuItem-root": {
    color: "#e2e8f0",
    padding: "12px 20px",
    fontWeight: "600",
    "&:hover": {
      background: "rgba(99,102,241,0.15)",
      color: "#fff",
    },
  },
});

// -------------------------- Navbar Scroll Handler ------------------------

function ScrollHandler({ children }) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });
  return React.cloneElement(children, { scrolled: trigger ? 1 : 0 });
}

// -------------------------- Navigation Component -------------------------

function Navigation({ role, handleLogout }) {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const isActive = (path) => location.pathname === path;

  return (
    <ScrollHandler>
      <GlassAppBar position="fixed" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ padding: "8px 0", minHeight: "64px" }}>
            <Logo component={Link} to="/" sx={{ flexShrink: 0 }}>
              <LogoIcon>🗳️</LogoIcon>
              <LogoText variant="h6">VoteHub</LogoText>
            </Logo>

            {/* Scrollable Navbar */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(99,102,241,0.5) transparent",
                marginLeft: "24px",
                marginRight: "24px",
                "&::-webkit-scrollbar": { height: "6px" },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                  borderRadius: "3px",
                },
              }}
            >
              <NavButton
                component={Link}
                to="/"
                startIcon={<HowToVoteIcon />}
                active={isActive("/") ? 1 : 0}
              >
                Polls
              </NavButton>

              {role === "admin" && (
                <>
                  <NavButton
                    component={Link}
                    to="/create"
                    startIcon={<AddCircleOutlineIcon />}
                    active={isActive("/create") ? 1 : 0}
                  >
                    Create Poll
                  </NavButton>
                  <RoleChip
                    icon={<AdminPanelSettingsIcon />}
                    label="Admin"
                    size="small"
                  />
                </>
              )}
            </Box>

            {/* User Menu */}
            <Box sx={{ flexShrink: 0 }}>
              <UserAvatar onClick={handleMenuOpen}>
                <PersonIcon />
              </UserAvatar>
              <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
              >
                <MenuItem disabled sx={{ opacity: 0.7 }}>
                  <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  {role === "admin" ? "Administrator" : "User"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                  sx={{ color: "#f87171 !important" }}
                >
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </StyledMenu>
            </Box>
          </Toolbar>
        </Container>
      </GlassAppBar>
    </ScrollHandler>
  );
}

// -------------------------- Main App Component --------------------------

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const handleLogout = () => {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <Router>
      {!token ? (
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setToken={setToken} setRole={setRole} />}
          />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      ) : (
        <>
          <Navigation role={role} handleLogout={handleLogout} />
          <Box
            sx={{
              marginTop: "80px",
              minHeight: "100vh",
              background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
              color: "#e2e8f0",
              padding: "20px",
            }}
          >
            <Routes>
              <Route path="/" element={<PollList />} />
              <Route path="/polls/:id" element={<PollDetail />} />
              <Route path="/polls/:id/results" element={<Results />} />
              <Route
                path="/create"
                element={
                  role === "admin" ? <CreatePoll /> : <Navigate to="/" />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </>
      )}
    </Router>
  );
}

export default App;
