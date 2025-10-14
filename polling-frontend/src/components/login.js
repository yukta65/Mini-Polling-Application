import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import PollIcon from "@mui/icons-material/Poll";

// The main container with gradient background and animated circles
const StyledBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    top: "-150px",
    right: "-150px",
    animation: "pulse 4s ease-in-out infinite",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "350px",
    height: "350px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    bottom: "-100px",
    left: "-100px",
    animation: "pulse 6s ease-in-out infinite",
  },
  "@keyframes pulse": {
    "0%, 100%": { transform: "scale(1)", opacity: 0.8 },
    "50%": { transform: "scale(1.1)", opacity: 0.5 },
  },
});

// Floating animated icons on the background
const FloatingIcon = styled(Box)({
  position: "absolute",
  color: "rgba(255, 255, 255, 0.15)",
  fontSize: "80px",
  animation: "float 8s ease-in-out infinite",
  "&.icon-1": { top: "10%", left: "15%", animationDelay: "0s" },
  "&.icon-2": { top: "60%", right: "10%", animationDelay: "2s" },
  "&.icon-3": { bottom: "15%", left: "20%", animationDelay: "4s" },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
    "33%": { transform: "translateY(-30px) rotate(5deg)" },
    "66%": { transform: "translateY(-15px) rotate(-5deg)" },
  },
});

// The main login card with blur glass style
const StyledPaper = styled(Paper)({
  padding: "45px",
  width: "420px",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  position: "relative",
  zIndex: 1,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 48px 0 rgba(31, 38, 135, 0.45)",
  },
});

// Top icon container with animation
const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
  "& .vote-icon": {
    fontSize: "64px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "bounce 2s ease-in-out infinite",
  },
  "@keyframes bounce": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
  },
});

// Styled input fields with focus and hover animations
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.8)",
    "&:hover": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#667eea",
        borderWidth: "2px",
      },
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#667eea",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#667eea",
    fontWeight: "600",
  },
});

// Styled button for login with gradient and hover animation
const StyledButton = styled(Button)({
  borderRadius: "14px",
  padding: "14px",
  fontSize: "17px",
  fontWeight: "700",
  textTransform: "none",
  marginTop: "8px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    transform: "scale(1.03)",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.5)",
  },
});

// Title text style for the page
const Title = styled(Typography)({
  fontWeight: "800",
  fontSize: "32px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "8px",
  letterSpacing: "-0.5px",
});

// Subtitle under title
const Subtitle = styled(Typography)({
  color: "#64748b",
  fontSize: "15px",
  marginBottom: "32px",
  fontWeight: "500",
});

// Divider line between login and register link
const Divider = styled(Box)({
  display: "flex",
  alignItems: "center",
  margin: "24px 0 20px 0",
  "&::before, &::after": {
    content: '""',
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #cbd5e1, transparent)",
  },
  "& span": {
    padding: "0 16px",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "500",
  },
});

// Login component main function
function Login({ setToken, setRole }) {
  // State variables for input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      setToken(res.data.token);
      setRole(res.data.role);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  // Main return layout of login page
  return (
    <StyledBox>
      {/* Background floating icons */}
      <FloatingIcon className="icon-1">
        <HowToVoteIcon fontSize="inherit" />
      </FloatingIcon>
      <FloatingIcon className="icon-2">
        <PollIcon fontSize="inherit" />
      </FloatingIcon>
      <FloatingIcon className="icon-3">
        <HowToVoteIcon fontSize="inherit" />
      </FloatingIcon>

      {/* Login card container */}
      <StyledPaper elevation={0}>
        <IconContainer>
          <HowToVoteIcon className="vote-icon" />
        </IconContainer>

        <Title variant="h4" align="center">
          Welcome Back
        </Title>
        <Subtitle align="center">Login to create and vote on polls</Subtitle>

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <StyledTextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <StyledTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <StyledButton type="submit" variant="contained" fullWidth>
            Login to Vote
          </StyledButton>
        </form>

        {/* Divider between login and register */}
        <Divider>
          <span>OR</span>
        </Divider>

        {/* Register redirect link */}
        <Typography
          align="center"
          variant="body2"
          sx={{
            "& span": {
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "#764ba2",
                textDecoration: "underline",
              },
            },
          }}
        >
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register now!</span>
        </Typography>
      </StyledPaper>
    </StyledBox>
  );
}

export default Login;
