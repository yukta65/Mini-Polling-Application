import React, { useState } from "react";
import api from "../api";
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

const StyledBox = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  position: "relative",
  overflow: "hidden",
  padding: "60px 0",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "800px",
    height: "800px",
    background:
      "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
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
    background:
      "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
    borderRadius: "50%",
    bottom: "-200px",
    left: "-150px",
    animation: "drift 15s ease-in-out infinite reverse",
  },
  "@keyframes drift": {
    "0%, 100%": {
      transform: "translate(0, 0) scale(1)",
    },
    "50%": {
      transform: "translate(50px, 30px) scale(1.1)",
    },
  },
});

const GridPattern = styled(Box)({
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)`,
  backgroundSize: "50px 50px",
  zIndex: 0,
});

const HeaderContainer = styled(Box)({
  textAlign: "center",
  marginBottom: "50px",
  position: "relative",
  zIndex: 1,
});

const Title = styled(Typography)({
  fontWeight: "800",
  fontSize: "48px",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "16px",
  letterSpacing: "-2px",
});

const Subtitle = styled(Typography)({
  color: "#94a3b8",
  fontSize: "18px",
  fontWeight: "400",
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: "1.6",
});

const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "24px",
  fontSize: "72px",
  animation: "bounce 2s ease-in-out infinite",
  "@keyframes bounce": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-15px)",
    },
  },
});

const StyledCard = styled(Card)({
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  position: "relative",
  zIndex: 1,
  overflow: "visible",
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.05)",
    transition: "all 0.3s ease",
    color: "#f1f5f9",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    "&:hover": {
      background: "rgba(255, 255, 255, 0.08)",
      "& fieldset": {
        borderColor: "rgba(99, 102, 241, 0.5)",
      },
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 0.1)",
      "& fieldset": {
        borderColor: "#6366f1",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    "&.Mui-focused": {
      color: "#a5b4fc",
      fontWeight: "600",
    },
  },
});

const OptionCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "12px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(99, 102, 241, 0.3)",
    transform: "translateX(8px)",
  },
});

const OptionNumber = styled(Chip)({
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "14px",
  height: "32px",
  minWidth: "32px",
  "& .MuiChip-label": {
    padding: "0 8px",
  },
});

const AddButton = styled(Button)({
  borderRadius: "14px",
  padding: "14px 28px",
  fontSize: "16px",
  fontWeight: "700",
  textTransform: "none",
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
});

const SubmitButton = styled(Button)({
  borderRadius: "14px",
  padding: "16px 32px",
  fontSize: "17px",
  fontWeight: "800",
  textTransform: "none",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#ffffff",
  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
    transform: "scale(1.05)",
    boxShadow: "0 12px 40px rgba(99, 102, 241, 0.6)",
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#64748b",
  },
});

const DeleteButton = styled(IconButton)({
  color: "#f87171",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(248, 113, 113, 0.1)",
    transform: "rotate(90deg) scale(1.1)",
  },
});

const SectionTitle = styled(Typography)({
  color: "#cbd5e1",
  fontWeight: "700",
  fontSize: "18px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (idx) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== idx);
      setOptions(newOptions);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    api
      .post("/polls", { question, options })
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

  const isValid =
    question.trim() &&
    options.every((opt) => opt.trim()) &&
    options.length >= 2;

  return (
    <StyledBox>
      <GridPattern />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <HeaderContainer>
            <IconContainer>
              <span role="img" aria-label="create">
                ✍️
              </span>
            </IconContainer>
            <Title variant="h1">Create New Poll</Title>
            <Subtitle variant="h6">
              Design your poll question and add multiple choice options for
              participants to vote on
            </Subtitle>
          </HeaderContainer>
        </Fade>

        <Fade in timeout={1000}>
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <SectionTitle>
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
                  InputProps={{
                    endAdornment: question && (
                      <InputAdornment position="end">
                        <CheckCircleIcon sx={{ color: "#10b981" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <SectionTitle sx={{ mb: 2 }}>
                  <CheckCircleIcon sx={{ color: "#a5b4fc" }} />
                  Answer Options
                </SectionTitle>

                {options.map((opt, idx) => (
                  <Fade in timeout={300 + idx * 100} key={idx}>
                    <OptionCard>
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            background: "transparent",
                          },
                        }}
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

                <Box display="flex" flexDirection="column" gap={2} mt={3}>
                  <AddButton
                    onClick={addOption}
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
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

                <Box mt={3} textAlign="center">
                  <Typography variant="caption" color="#64748b">
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
