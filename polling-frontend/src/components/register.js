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
  FormControl,
  InputLabel,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "../theme/context";

// Styled container for the full page with background gradient and animated circles
const StyledBox = styled(Box)(({ themeColors, isDark }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: isDark
    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
  position: "relative",
  overflow: "hidden",
  transition: "background 0.3s ease",
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
}));

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
const StyledPaper = styled(Paper)(({ isDark }) => ({
  padding: "45px",
  width: "460px",
  maxWidth: "95vw",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  position: "relative",
  zIndex: 1,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 48px 0 rgba(31, 38, 135, 0.45)",
  },
}));

// Icon at top of form with bounce animation
const IconContainer = styled(Box)(({ isDark }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
  "& .register-icon": {
    fontSize: "64px",
    background: isDark
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "bounce 2s ease-in-out infinite",
    transition: "background 0.3s ease",
  },
  "@keyframes bounce": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-10px)",
    },
  },
}));

// Styled TextField with focus and hover effects
const StyledTextField = styled(TextField)(({ isDark, error }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.8)",
    "&:hover": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#ef4444" : isDark ? "#667eea" : "#a78bfa",
        borderWidth: "2px",
      },
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "#ef4444" : isDark ? "#667eea" : "#a78bfa",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: error ? "#ef4444" : isDark ? "#667eea" : "#a78bfa",
    fontWeight: "600",
  },
}));

// Styled select dropdown for role selection
const StyledFormControl = styled(FormControl)(({ isDark }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.8)",
    "&:hover": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? "#667eea" : "#a78bfa",
        borderWidth: "2px",
      },
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? "#667eea" : "#a78bfa",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: isDark ? "#667eea" : "#a78bfa",
    fontWeight: "600",
  },
}));

// Styled submit button with gradient and hover effect
const StyledButton = styled(Button)(({ isDark }) => ({
  borderRadius: "14px",
  padding: "14px",
  fontSize: "17px",
  fontWeight: "700",
  textTransform: "none",
  marginTop: "8px",
  background: isDark
    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
  transition: "all 0.3s ease",
  boxShadow: isDark
    ? "0 4px 15px rgba(102, 126, 234, 0.3)"
    : "0 4px 15px rgba(167, 139, 250, 0.3)",
  "&:hover": {
    background: isDark
      ? "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
      : "linear-gradient(135deg, #ec4899 0%, #a78bfa 100%)",
    transform: "scale(1.03)",
    boxShadow: isDark
      ? "0 8px 25px rgba(102, 126, 234, 0.5)"
      : "0 8px 25px rgba(167, 139, 250, 0.5)",
  },
  "&:disabled": {
    background: "rgba(148, 163, 184, 0.3)",
    color: "rgba(255, 255, 255, 0.5)",
  },
}));

// Title text with gradient effect
const Title = styled(Typography)(({ isDark }) => ({
  fontWeight: "800",
  fontSize: "32px",
  background: isDark
    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "8px",
  letterSpacing: "-0.5px",
  transition: "background 0.3s ease",
}));

// Subtitle text below the title
const Subtitle = styled(Typography)({
  color: "#64748b",
  fontSize: "15px",
  marginBottom: "24px",
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

// Validation requirement item
const ValidationItem = styled(Box)(({ met }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  color: met ? "#10b981" : "#64748b",
  marginBottom: "6px",
  transition: "all 0.3s ease",
  "& svg": {
    fontSize: "18px",
  },
}));

// Theme toggle button
const ThemeToggleButton = styled(Button)(({ isDark }) => ({
  position: "absolute",
  top: "20px",
  right: "20px",
  minWidth: "50px",
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  color: "#ffffff",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.3)",
    transform: "rotate(180deg) scale(1.1)",
  },
}));

function Register() {
  // State variables for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { colors: themeColors, isDark, toggleTheme } = useTheme();

  // Validation functions
  const validateUsername = (name) => {
    if (name.length < 3) return false;
    if (name.length > 20) return false;
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return false;
    return true;
  };

  const validatePassword = (pass) => {
    const validations = {
      minLength: pass.length >= 8,
      hasUpperCase: /[A-Z]/.test(pass),
      hasLowerCase: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    return validations;
  };

  const passwordValidations = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidations).every((v) => v);
  const isUsernameValid = validateUsername(username);
  const isFormValid = isUsernameValid && isPasswordValid;

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Please fix all validation errors before submitting");
      setTouched({ username: true, password: true });
      return;
    }

    try {
      await api.post("/auth/register", { username, password, role });
      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Registration failed. Username may already exist.";
      setError(errorMsg);
    }
  };

  return (
    <StyledBox themeColors={themeColors} isDark={isDark}>
      {/* Theme toggle button */}
      <ThemeToggleButton onClick={toggleTheme} isDark={isDark}>
        {isDark ? (
          <Brightness7Icon sx={{ fontSize: 28 }} />
        ) : (
          <Brightness4Icon sx={{ fontSize: 28 }} />
        )}
      </ThemeToggleButton>

      {/* Decorative floating icons */}
      <FloatingIcon className="icon-1">📊</FloatingIcon>
      <FloatingIcon className="icon-2">✅</FloatingIcon>
      <FloatingIcon className="icon-3">📋</FloatingIcon>

      {/* Main registration form container */}
      <StyledPaper elevation={0} isDark={isDark}>
        <IconContainer isDark={isDark}>
          <span className="register-icon">📊</span>
        </IconContainer>

        {/* Title and subtitle */}
        <Title variant="h4" align="center" isDark={isDark}>
          Join the Community
        </Title>
        <Subtitle align="center">Create polls and share your opinions</Subtitle>

        {/* Error alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* Registration form */}
        <form onSubmit={handleRegister}>
          {/* Username field */}
          <StyledTextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
            fullWidth
            margin="normal"
            required
            isDark={isDark}
            error={touched.username && !isUsernameValid}
            helperText={
              touched.username && !isUsernameValid
                ? "3-20 characters, letters, numbers, underscore only"
                : ""
            }
            InputProps={{
              endAdornment: touched.username && (
                <InputAdornment position="end">
                  {isUsernameValid ? (
                    <CheckCircleIcon sx={{ color: "#10b981" }} />
                  ) : (
                    <CancelIcon sx={{ color: "#ef4444" }} />
                  )}
                </InputAdornment>
              ),
            }}
          />

          {/* Password field */}
          <StyledTextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            fullWidth
            margin="normal"
            required
            isDark={isDark}
            error={touched.password && !isPasswordValid}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password validation requirements */}
          {touched.password && (
            <Box
              sx={{
                mt: 2,
                mb: 2,
                p: 2,
                bgcolor: "rgba(148, 163, 184, 0.1)",
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "600",
                  color: "#64748b",
                  mb: 1,
                  display: "block",
                }}
              >
                Password Requirements:
              </Typography>
              <ValidationItem met={passwordValidations.minLength}>
                {passwordValidations.minLength ? (
                  <CheckCircleIcon />
                ) : (
                  <CancelIcon />
                )}
                At least 8 characters
              </ValidationItem>
              <ValidationItem met={passwordValidations.hasUpperCase}>
                {passwordValidations.hasUpperCase ? (
                  <CheckCircleIcon />
                ) : (
                  <CancelIcon />
                )}
                One uppercase letter
              </ValidationItem>
              <ValidationItem met={passwordValidations.hasLowerCase}>
                {passwordValidations.hasLowerCase ? (
                  <CheckCircleIcon />
                ) : (
                  <CancelIcon />
                )}
                One lowercase letter
              </ValidationItem>
              <ValidationItem met={passwordValidations.hasNumber}>
                {passwordValidations.hasNumber ? (
                  <CheckCircleIcon />
                ) : (
                  <CancelIcon />
                )}
                One number
              </ValidationItem>
              <ValidationItem met={passwordValidations.hasSpecial}>
                {passwordValidations.hasSpecial ? (
                  <CheckCircleIcon />
                ) : (
                  <CancelIcon />
                )}
                One special character (!@#$%^&*)
              </ValidationItem>
            </Box>
          )}

          {/* Role selection */}
          <StyledFormControl fullWidth margin="normal" isDark={isDark}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </StyledFormControl>

          {/* Submit button */}
          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            isDark={isDark}
            disabled={!isFormValid && (touched.username || touched.password)}
          >
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
              color: isDark ? "#667eea" : "#a78bfa",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
              transition: "all 0.2s ease",
              "&:hover": {
                color: isDark ? "#764ba2" : "#ec4899",
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
