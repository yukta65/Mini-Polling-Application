import React from "react";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "./ThemeContext";

const StyledToggleButton = styled(IconButton)(({ theme: muiTheme }) => ({
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  zIndex: 1000,
  width: "56px",
  height: "56px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(99, 102, 241, 0.3)",
    transform: "rotate(180deg) scale(1.1)",
    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
  },
}));

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <StyledToggleButton onClick={toggleTheme} aria-label="toggle theme">
      {theme === "dark" ? (
        <Brightness7Icon sx={{ color: "#fbbf24", fontSize: 28 }} />
      ) : (
        <Brightness4Icon sx={{ color: "#6366f1", fontSize: 28 }} />
      )}
    </StyledToggleButton>
  );
};

export default ThemeToggle;
