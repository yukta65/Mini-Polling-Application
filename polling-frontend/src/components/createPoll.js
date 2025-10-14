// React imports for state and component
import React, { useState } from "react";
import api from "../api"; // Importing custom Axios instance for API calls

// Import Material UI components and icons
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
  Fade,
  Chip,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "../theme/context";

// =====================  Styled Components ===================== //
// These custom components use Material-UI's styled API to apply consistent,
// modern design and animations across the UI.

const StyledBox = styled(Box)(({ themeColors }) => ({
  // Background with gradients and subtle motion effects
  minHeight: "100vh",
  background: themeColors.bgPrimary,
  position: "relative",
  overflow: "hidden",
  padding: "60px 0",
  transition: "background 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "800px",
    height: "800px",
    background: themeColors.orbPrimary,
    borderRadius: "50%",
    top: "-300px",
    right: "-200px",
    animation: "drift 20s ease-in-out infinite",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "600px",
    height: "600px",
    background: themeColors.orbSecondary,
    borderRadius: "50%",
    bottom: "-200px",
    left: "-150px",
    animation: "drift 15s ease-in-out infinite reverse",
  },
  "@keyframes drift": {
    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
    "50%": { transform: "translate(50px, 30px) scale(1.1)" },
  },
}));

const GridPattern = styled(Box)(({ themeColors }) => ({
  // Subtle grid overlay for background aesthetics
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(${themeColors.gridColor} 1px, transparent 1px),
                    linear-gradient(90deg, ${themeColors.gridColor} 1px, transparent 1px)`,
  backgroundSize: "50px 50px",
  zIndex: 0,
}));

const HeaderContainer = styled(Box)({
  // Centers the page header (title + subtitle)
  textAlign: "center",
  marginBottom: "50px",
  position: "relative",
  zIndex: 1,
});

const Title = styled(Typography)(({ themeColors, isDark }) => ({
  // Main heading style
  fontWeight: "800",
  fontSize: "48px",
  background: isDark
    ? "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)"
    : "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "16px",
  letterSpacing: "-2px",
  transition: "background 0.3s ease",
}));

const Subtitle = styled(Typography)(({ themeColors }) => ({
  // Subtitle description under the title
  color: themeColors.textSecondary,
  fontSize: "18px",
  fontWeight: "400",
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: "1.6",
  transition: "color 0.3s ease",
}));

const IconContainer = styled(Box)({
  // Animated emoji above the title
  display: "flex",
  justifyContent: "center",
  marginBottom: "24px",
  fontSize: "72px",
  animation: "bounce 2s ease-in-out infinite",
  "@keyframes bounce": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-15px)" },
  },
});

const StyledCard = styled(Card)(({ themeColors }) => ({
  // The main card container that holds the form
  borderRadius: "24px",
  background: themeColors.bgCard,
  backdropFilter: "blur(20px)",
  border: `1px solid ${themeColors.borderPrimary}`,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  position: "relative",
  zIndex: 1,
  overflow: "visible",
  transition: "all 0.3s ease",
}));

const StyledTextField = styled(TextField)(({ themeColors }) => ({
  // Custom input field styling for both question and options
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: themeColors.bgGlass,
    transition: "all 0.3s ease",
    color: themeColors.textPrimary,
    "& fieldset": { borderColor: themeColors.borderPrimary },
    "&:hover": {
      background: themeColors.bgGlassHover,
      "& fieldset": { borderColor: "rgba(99, 102, 241, 0.5)" },
    },
    "&.Mui-focused": {
      background: themeColors.bgGlassHover,
      "& fieldset": { borderColor: "#6366f1", borderWidth: "2px" },
    },
  },
  "& .MuiInputLabel-root": {
    color: themeColors.textSecondary,
    "&.Mui-focused": { color: "#a5b4fc", fontWeight: "600" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: themeColors.textTertiary,
    opacity: 0.7,
  },
}));

const OptionCard = styled(Box)(({ themeColors }) => ({
  // Style for each individual poll option input
  background: themeColors.bgCard,
  border: `1px solid ${themeColors.borderPrimary}`,
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "12px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  "&:hover": {
    background: themeColors.bgCardHover,
    borderColor: "rgba(99, 102, 241, 0.3)",
    transform: "translateX(8px)",
  },
}));

const OptionNumber = styled(Chip)({
  // Circular label showing option number
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "14px",
  height: "32px",
  minWidth: "32px",
});

const AddButton = styled(Button)(({ themeColors }) => ({
  // Button to add new poll option
  borderRadius: "14px",
  padding: "14px 28px",
  fontWeight: "700",
  background: "rgba(99, 102, 241, 0.15)",
  color: "#a5b4fc",
  border: "2px dashed rgba(99, 102, 241, 0.5)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(99, 102, 241, 0.25)",
    borderColor: "#6366f1",
    transform: "scale(1.02)",
    color: "#ffffff",
  },
}));

const SubmitButton = styled(Button)({
  // Submit button to create poll
  borderRadius: "14px",
  padding: "16px 32px",
  fontWeight: "800",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#ffffff",
  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
    transform: "scale(1.05)",
  },
  "&:disabled": {
    background: "rgba(99, 102, 241, 0.3)",
    color: "rgba(255, 255, 255, 0.5)",
  },
});

const DeleteButton = styled(IconButton)({
  // Red delete icon beside each option
  color: "#f87171",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(248, 113, 113, 0.1)",
    transform: "rotate(90deg) scale(1.1)",
  },
});

const SectionTitle = styled(Typography)(({ themeColors }) => ({
  // Section titles like "Poll Question" and "Answer Options"
  color: themeColors.textSecondary,
  fontWeight: "700",
  fontSize: "18px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "color 0.3s ease",
}));

// =====================  Main Component ===================== //
function CreatePoll() {
  const [question, setQuestion] = useState(""); // Poll question text
  const [options, setOptions] = useState(["", ""]); // Poll options (min 2)
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const { colors: themeColors, isDark } = useTheme(); // Get theme colors

  // Update option value
  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  // Add new empty option field
  const addOption = () => setOptions([...options, ""]);

  // Remove an option (min 2 options must remain)
  const removeOption = (idx) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== idx);
      setOptions(newOptions);
    }
  };

  // Handle form submit (Create poll API)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    api
      .post("/polls", { question, options }) // POST request to backend
      .then(() => {
        alert("Poll created successfully!");
        setQuestion("");
        setOptions(["", ""]);
        setIsSubmitting(false);
      })
      .catch(() => {
        alert("Failed to create poll");
        setIsSubmitting(false);
      });
  };

  // Validation — ensure question and options are filled
  const isValid =
    question.trim() &&
    options.every((opt) => opt.trim()) &&
    options.length >= 2;

  // =====================  UI Rendering ===================== //
  return (
    <StyledBox themeColors={themeColors}>
      <GridPattern themeColors={themeColors} />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <HeaderContainer>
            <IconContainer>
              <span role="img" aria-label="create">
                ✍️
              </span>
            </IconContainer>
            <Title variant="h1" themeColors={themeColors} isDark={isDark}>
              Create New Poll
            </Title>
            <Subtitle variant="h6" themeColors={themeColors}>
              Design your poll question and add multiple choice options for
              participants to vote on
            </Subtitle>
          </HeaderContainer>
        </Fade>

        {/* Poll form section */}
        <Fade in timeout={1000}>
          <StyledCard themeColors={themeColors}>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                {/* Question Field */}
                <SectionTitle themeColors={themeColors}>
                  <CreateIcon sx={{ color: "#a5b4fc" }} />
                  Poll Question
                </SectionTitle>
                <StyledTextField
                  placeholder="What would you like to ask?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={2}
                  sx={{ mb: 4 }}
                  themeColors={themeColors}
                  InputProps={{
                    endAdornment: question && (
                      <InputAdornment position="end">
                        <CheckCircleIcon sx={{ color: "#10b981" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Poll Options Section */}
                <SectionTitle sx={{ mb: 2 }} themeColors={themeColors}>
                  <CheckCircleIcon sx={{ color: "#a5b4fc" }} />
                  Answer Options
                </SectionTitle>

                {/* Render all options dynamically */}
                {options.map((opt, idx) => (
                  <Fade in timeout={300 + idx * 100} key={idx}>
                    <OptionCard themeColors={themeColors}>
                      <OptionNumber label={idx + 1} />
                      <StyledTextField
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        fullWidth
                        required
                        size="small"
                        themeColors={themeColors}
                      />
                      {options.length > 2 && (
                        <DeleteButton
                          onClick={() => removeOption(idx)}
                          size="small"
                        >
                          <DeleteOutlineIcon />
                        </DeleteButton>
                      )}
                    </OptionCard>
                  </Fade>
                ))}

                {/* Add Option + Submit Buttons */}
                <Box display="flex" flexDirection="column" gap={2} mt={3}>
                  <AddButton
                    onClick={addOption}
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
                    themeColors={themeColors}
                  >
                    Add Another Option
                  </AddButton>

                  <SubmitButton
                    type="submit"
                    fullWidth
                    disabled={!isValid || isSubmitting}
                    startIcon={<CheckCircleIcon />}
                  >
                    {isSubmitting ? "Creating Poll..." : "Create Poll"}
                  </SubmitButton>
                </Box>

                {/* Footer Tip */}
                <Box mt={3} textAlign="center">
                  <Typography
                    variant="caption"
                    sx={{
                      color: themeColors.textTertiary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    💡 Tip: Add at least 2 options. You can add more by clicking
                    "Add Another Option"
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Fade>
      </Container>
    </StyledBox>
  );
}

export default CreatePoll;
