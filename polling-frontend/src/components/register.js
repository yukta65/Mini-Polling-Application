import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled container for the full page with background gradient and animated circles
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
    "0%, 100%": {
      transform: "scale(1)",
      opacity: 0.8,
    },
    "50%": {
      transform: "scale(1.1)",
      opacity: 0.5,
    },
  },
});

// Floating icons for decorative effect
const FloatingIcon = styled(Box)({
  position: "absolute",
  color: "rgba(255, 255, 255, 0.15)",
  fontSize: "80px",
  animation: "float 8s ease-in-out infinite",
  fontWeight: "bold",
  "&.icon-1": {
    top: "15%",
    left: "10%",
    animationDelay: "0s",
  },
  "&.icon-2": {
    top: "65%",
    right: "15%",
    animationDelay: "2s",
  },
  "&.icon-3": {
    bottom: "20%",
    left: "25%",
    animationDelay: "4s",
  },
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px) rotate(0deg)",
    },
    "33%": {
      transform: "translateY(-30px) rotate(5deg)",
    },
    "66%": {
      transform: "translateY(-15px) rotate(-5deg)",
    },
  },
});

// Paper container for the form with shadow and hover effects
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

// Icon at top of form with bounce animation
const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
  fontSize: "64px",
  animation: "bounce 2s ease-in-out infinite",
  "@keyframes bounce": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-10px)",
    },
  },
});

// Styled TextField with focus and hover effects
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

// Styled select dropdown for role selection
const StyledSelect = styled(Select)({
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
});

// Styled submit button with gradient and hover effect
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

// Title text with gradient effect
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

// Subtitle text below the title
const Subtitle = styled(Typography)({
  color: "#64748b",
  fontSize: "15px",
  marginBottom: "32px",
  fontWeight: "500",
});

// Divider for separating form and login option
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

function Register() {
  // State variables for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const navigate = useNavigate(); // navigation for redirect after registration

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // prevent default form submission
    try {
      // POST request to register user
      await api.post("/auth/register", { username, password, role });
      alert("Registered! Now login.");
      navigate("/login"); // redirect to login page
    } catch (err) {
      alert("Registration failed"); // show error if registration fails
    }
  };

  return (
    <StyledBox>
      {/* Decorative floating icons */}
      <FloatingIcon className="icon-1">📊</FloatingIcon>
      <FloatingIcon className="icon-2">✅</FloatingIcon>
      <FloatingIcon className="icon-3">📋</FloatingIcon>

      {/* Main registration form container */}
      <StyledPaper elevation={0}>
        <IconContainer>📊</IconContainer>

        {/* Title and subtitle */}
        <Title variant="h4" align="center">
          Join the Community
        </Title>
        <Subtitle align="center">Create polls and share your opinions</Subtitle>

        {/* Registration form */}
        <form onSubmit={handleRegister}>
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
          <StyledSelect
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </StyledSelect>
          <StyledButton type="submit" variant="contained" fullWidth>
            Create Account
          </StyledButton>
        </form>

        {/* Divider */}
        <Divider>
          <span>OR</span>
        </Divider>

        {/* Login redirect option */}
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
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login now!</span>
        </Typography>
      </StyledPaper>
    </StyledBox>
  );
}

export default Register;
