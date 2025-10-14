// Import React and useState hook for managing component state
import React, { useState } from "react";
// Import React Router components for navigation and routing
import {
  BrowserRouter as Router, // Main router wrapper
  Routes, // Container for all route definitions
  Route, // Individual route component
  Link, // Navigation link component
  Navigate, // Component for programmatic navigation/redirects
  useLocation, // Hook to access current URL location
} from "react-router-dom";
// Import custom page components
import PollList from "./components/pollList"; // Main poll listing page
import PollDetail from "./components/pollDetail"; // Individual poll voting page
import CreatePoll from "./components/createPoll"; // Poll creation page (admin only)
import Results from "./components/results"; // Poll results page
import Register from "./components/register"; // User registration page
import Login from "./components/login"; // User login page
// Import Material-UI components for UI elements
import {
  AppBar, // Top navigation bar
  Toolbar, // Container for navbar content
  Button, // Button component
  Typography, // Text component
  Box, // Flexible container component
  Container, // Responsive container with max-width
  Avatar, // Circular avatar component
  Menu, // Dropdown menu
  MenuItem, // Individual menu item
  Chip, // Small label/badge component
  Fade, // Fade animation component
  useScrollTrigger, // Hook to detect scroll position
} from "@mui/material";
import { styled } from "@mui/material/styles"; // MUI styled components
// Import Material-UI icons
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// ------------------------- Styled Components -----------------------------

// Glassmorphism navigation bar with scroll-based styling
const GlassAppBar = styled(AppBar)(({ scrolled }) => ({
  // Background changes opacity and darkness based on scroll position
  background: scrolled
    ? "linear-gradient(90deg, rgba(15,15,25,0.95) 0%, rgba(25,25,40,0.95) 100%)"
    : "linear-gradient(90deg, rgba(15,15,25,0.8) 0%, rgba(25,25,40,0.8) 100%)",
  backdropFilter: "blur(20px)", // Glassmorphism blur effect
  borderBottom: "1px solid rgba(99,102,241,0.2)", // Subtle border
  // Box shadow intensifies when scrolled
  boxShadow: scrolled
    ? "0 4px 30px rgba(99,102,241,0.25)"
    : "0 2px 20px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease", // Smooth transition between states
}));

// Logo container with hover effect
const Logo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)", // Slight grow on hover
  },
  transition: "all 0.3s ease",
});

// Logo icon box with gradient background and shadow
const LogoIcon = styled(Box)({
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", // Purple gradient
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)", // Glow effect
});

// Logo text styling
const LogoText = styled(Typography)({
  fontWeight: "800",
  fontSize: "20px",
  color: "#f1f5f9",
  letterSpacing: "-0.5px", // Tight letter spacing for modern look
});

// Navigation button with active state styling
const NavButton = styled(Button)(({ active }) => ({
  color: active ? "#fff" : "#94a3b8", // White when active, gray when inactive
  fontWeight: active ? "700" : "600", // Bolder when active
  fontSize: "15px",
  textTransform: "none", // Disable uppercase transformation
  padding: "8px 20px",
  borderRadius: "12px",
  marginLeft: "8px",
  position: "relative",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap", // Prevent text wrapping
  // Bottom border indicator for active state (using pseudo-element)
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "20px",
    right: "20px",
    height: "3px",
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    borderRadius: "3px",
    opacity: active ? 1 : 0, // Only visible when active
    transition: "opacity 0.3s ease",
  },
  // Hover effect: background color and lift up
  "&:hover": {
    background: "rgba(99, 102, 241, 0.15)",
    color: "#fff",
    transform: "translateY(-2px)",
  },
}));

// "Create Poll" button with gradient and glow (unused in current code but defined)
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

// User avatar with gradient background and hover scale effect
const UserAvatar = styled(Avatar)({
  width: "36px",
  height: "36px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  border: "2px solid rgba(255,255,255,0.15)", // Subtle border
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)", // Grow on hover
  },
});

// Admin role badge chip
const RoleChip = styled(Chip)({
  background: "rgba(168,85,247,0.15)", // Purple tint
  color: "#e9d5ff", // Light purple text
  border: "1px solid rgba(168,85,247,0.3)",
  fontWeight: "700",
  fontSize: "12px",
  height: "26px",
  marginLeft: "12px",
});

// Dropdown menu with glassmorphism styling
const StyledMenu = styled(Menu)({
  // Menu paper (background container) styling
  "& .MuiPaper-root": {
    background: "rgba(20, 25, 45, 0.95)", // Dark translucent background
    backdropFilter: "blur(20px)", // Glassmorphism blur
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  // Individual menu item styling
  "& .MuiMenuItem-root": {
    color: "#e2e8f0",
    padding: "12px 20px",
    fontWeight: "600",
    "&:hover": {
      background: "rgba(99,102,241,0.15)", // Subtle purple on hover
      color: "#fff",
    },
  },
});

// -------------------------- Navbar Scroll Handler ------------------------

// Component to detect scroll position and pass it to AppBar
function ScrollHandler({ children }) {
  // useScrollTrigger returns true when scroll position exceeds threshold
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });
  // Clone the child element (AppBar) and add scrolled prop
  return React.cloneElement(children, { scrolled: trigger ? 1 : 0 });
}

// -------------------------- Navigation Component -------------------------

// Main navigation bar component (only shown when user is logged in)
function Navigation({ role, handleLogout }) {
  const location = useLocation(); // Get current route location
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu anchor

  // Open user dropdown menu
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  // Close user dropdown menu
  const handleMenuClose = () => setAnchorEl(null);
  // Check if a path matches the current location
  const isActive = (path) => location.pathname === path;

  return (
    <ScrollHandler>
      <GlassAppBar position="fixed" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ padding: "8px 0", minHeight: "64px" }}>
            {/* Logo - links to home page */}
            <Logo component={Link} to="/" sx={{ flexShrink: 0 }}>
              <LogoIcon>🗳️</LogoIcon>
              <LogoText variant="h6">VoteHub</LogoText>
            </Logo>

            {/* Scrollable navigation buttons container */}
            <Box
              sx={{
                flexGrow: 1, // Takes up available space
                display: "flex",
                alignItems: "center",
                gap: "8px",
                overflowX: "auto", // Horizontal scroll on small screens
                overflowY: "hidden",
                scrollbarWidth: "thin", // Thin scrollbar for Firefox
                scrollbarColor: "rgba(99,102,241,0.5) transparent",
                marginLeft: "24px",
                marginRight: "24px",
                // Custom scrollbar styling for WebKit browsers (Chrome, Safari)
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
              {/* Polls navigation button - visible to all users */}
              <NavButton
                component={Link}
                to="/"
                startIcon={<HowToVoteIcon />}
                active={isActive("/") ? 1 : 0}
              >
                Polls
              </NavButton>

              {/* Admin-only navigation items */}
              {role === "admin" && (
                <>
                  {/* Create Poll button - only visible to admins */}
                  <NavButton
                    component={Link}
                    to="/create"
                    startIcon={<AddCircleOutlineIcon />}
                    active={isActive("/create") ? 1 : 0}
                  >
                    Create Poll
                  </NavButton>
                  {/* Admin badge */}
                  <RoleChip
                    icon={<AdminPanelSettingsIcon />}
                    label="Admin"
                    size="small"
                  />
                </>
              )}
            </Box>

            {/* User menu section (avatar and dropdown) */}
            <Box sx={{ flexShrink: 0 }}>
              {/* User avatar - clicking opens dropdown menu */}
              <UserAvatar onClick={handleMenuOpen}>
                <PersonIcon />
              </UserAvatar>
              {/* Dropdown menu */}
              <StyledMenu
                anchorEl={anchorEl} // Anchored to avatar
                open={Boolean(anchorEl)} // Open when anchorEl is set
                onClose={handleMenuClose}
                TransitionComponent={Fade} // Fade animation
              >
                {/* User role display (non-clickable) */}
                <MenuItem disabled sx={{ opacity: 0.7 }}>
                  <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  {role === "admin" ? "Administrator" : "User"}
                </MenuItem>
                {/* Logout button */}
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout(); // Call logout handler
                  }}
                  sx={{ color: "#f87171 !important" }} // Red color for logout
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
  // State for authentication token (retrieved from localStorage on mount)
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // State for user role (retrieved from localStorage on mount)
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // Logout handler: clears state and localStorage
  const handleLogout = () => {
    setToken(""); // Clear token state
    setRole(""); // Clear role state
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("role"); // Remove role from localStorage
  };

  return (
    <Router>
      {/* Conditional rendering based on authentication status */}
      {!token ? (
        // Routes for unauthenticated users (login/register only)
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setToken={setToken} setRole={setRole} />}
          />
          {/* Redirect all other paths to register page */}
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      ) : (
        // Layout for authenticated users (navbar + content)
        <>
          {/* Navigation bar with role and logout handler */}
          <Navigation role={role} handleLogout={handleLogout} />
          {/* Main content area */}
          <Box
            sx={{
              marginTop: "80px", // Space for fixed navbar
              minHeight: "100vh",
              background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)", // Dark gradient background
              color: "#e2e8f0",
              padding: "20px",
            }}
          >
            {/* Routes for authenticated users */}
            <Routes>
              {/* Home page - poll list */}
              <Route path="/" element={<PollList />} />
              {/* Individual poll voting page */}
              <Route path="/polls/:id" element={<PollDetail />} />
              {/* Poll results page */}
              <Route path="/polls/:id/results" element={<Results />} />
              {/* Create poll page - admin only, redirects to home if not admin */}
              <Route
                path="/create"
                element={
                  role === "admin" ? <CreatePoll /> : <Navigate to="/" />
                }
              />
              {/* Redirect all other paths to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </>
      )}
    </Router>
  );
}

export default App;
