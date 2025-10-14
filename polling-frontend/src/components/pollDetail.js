// PollDetail.jsx
// This component displays details of a specific poll and allows the user to vote on one option.

import React, { useEffect, useState } from "react";
import api from "../api"; // Custom API instance for backend communication
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Fade,
  Chip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useTheme } from "../theme/context";

// ---------- STYLED COMPONENTS ----------

// Main background container with animated gradients
const StyledBox = styled(Box)(({ themeColors }) => ({
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

  // Floating gradient animation
  "@keyframes drift": {
    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
    "50%": { transform: "translate(50px, 30px) scale(1.1)" },
  },
}));

// Subtle background grid overlay
const GridPattern = styled(Box)(({ themeColors }) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(${themeColors.gridColor} 1px, transparent 1px),
                    linear-gradient(90deg, ${themeColors.gridColor} 1px, transparent 1px)`,
  backgroundSize: "50px 50px",
  zIndex: 0,
}));

// Back button in the top-left corner
const BackButton = styled(IconButton)(({ themeColors }) => ({
  position: "absolute",
  top: "80px",
  left: "40px",
  background: themeColors.bgGlass,
  backdropFilter: "blur(20px)",
  border: `1px solid ${themeColors.borderPrimary}`,
  color: themeColors.textSecondary,
  zIndex: 2,
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(99, 102, 241, 0.2)",
    transform: "translateX(-5px)",
    color: "#a5b4fc",
  },
}));

// Poll title and description header
const HeaderContainer = styled(Box)({
  textAlign: "center",
  marginBottom: "40px",
  position: "relative",
  zIndex: 1,
});

// Animated vote icon
const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
  fontSize: "72px",
  animation: "bounce 2s ease-in-out infinite",
  "@keyframes bounce": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-15px)" },
  },
});

const Title = styled(Typography)(({ themeColors }) => ({
  fontWeight: "800",
  fontSize: "38px",
  color: themeColors.textPrimary,
  marginBottom: "16px",
  lineHeight: "1.3",
  maxWidth: "800px",
  margin: "0 auto 16px",
  transition: "color 0.3s ease",
}));

const Subtitle = styled(Typography)(({ themeColors }) => ({
  color: themeColors.textSecondary,
  fontSize: "16px",
  fontWeight: "400",
  transition: "color 0.3s ease",
}));

// Card for poll content
const StyledCard = styled(Card)(({ themeColors }) => ({
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

// Each option box (highlighted when selected)
const OptionCard = styled(Box)(({ selected, themeColors }) => ({
  background: selected ? themeColors.winnerBg : themeColors.bgCard,
  border: selected
    ? `2px solid ${themeColors.winnerBorder}`
    : `2px solid ${themeColors.borderPrimary}`,
  borderRadius: "16px",
  padding: "20px 24px",
  marginBottom: "16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    background: selected ? themeColors.winnerBgHover : themeColors.bgCardHover,
    borderColor: selected
      ? "rgba(99, 102, 241, 0.8)"
      : "rgba(99, 102, 241, 0.3)",
    transform: "translateX(8px)",
  },
}));

// Text styling for each option
const OptionLabel = styled(Typography)(({ selected, themeColors }) => ({
  color: selected ? themeColors.textPrimary : themeColors.textSecondary,
  fontSize: "18px",
  fontWeight: selected ? "700" : "500",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  transition: "color 0.3s ease",
}));

// Submit Vote Button
const VoteButton = styled(Button)({
  borderRadius: "14px",
  padding: "16px 48px",
  fontSize: "18px",
  fontWeight: "800",
  textTransform: "none",
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
    boxShadow: "none",
  },
});

// Loader container
const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  gap: "24px",
});

const StyledCircularProgress = styled(CircularProgress)({
  color: "#a5b4fc",
});

// Error display box
const ErrorContainer = styled(Box)(({ themeColors }) => ({
  textAlign: "center",
  padding: "80px 40px",
  background: themeColors.bgCard,
  borderRadius: "24px",
  backdropFilter: "blur(20px)",
  border: `1px solid ${themeColors.borderPrimary}`,
  maxWidth: "600px",
  margin: "0 auto",
  transition: "all 0.3s ease",
}));

// Status label above question
const StatusChip = styled(Chip)({
  background: "rgba(99, 102, 241, 0.15)",
  color: "#a5b4fc",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  fontSize: "14px",
  fontWeight: "700",
  height: "32px",
  marginBottom: "24px",
});

// ---------- MAIN COMPONENT ----------

function PollDetail() {
  const { id } = useParams(); // Get poll ID from URL
  const navigate = useNavigate();
  const { colors: themeColors } = useTheme(); // Get theme colors

  const [poll, setPoll] = useState(null); // Poll data
  const [selected, setSelected] = useState(""); // Selected option
  const [loading, setLoading] = useState(true); // Loading state
  const [voting, setVoting] = useState(false); // Submitting state

  // Fetch poll details when component mounts
  useEffect(() => {
    api
      .get(`/polls/${id}`)
      .then((res) => {
        setPoll(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  // Handle user vote submission
  const handleVote = () => {
    setVoting(true);
    api
      .post(`/polls/${id}/vote`, { optionId: selected })
      .then(() => {
        alert("Vote submitted successfully! 🎉");
        navigate(`/polls/${id}/results`);
      })
      .catch(() => {
        alert("Failed to submit vote");
        setVoting(false);
      });
  };

  // ---------- CONDITIONAL RENDERING ----------

  // Show loader while fetching data
  if (loading) {
    return (
      <StyledBox themeColors={themeColors}>
        <GridPattern themeColors={themeColors} />
        <Container maxWidth="md">
          <LoadingContainer>
            <StyledCircularProgress size={60} thickness={4} />
            <Typography
              variant="h6"
              sx={{
                color: themeColors.textSecondary,
                transition: "color 0.3s ease",
              }}
              fontWeight="600"
            >
              Loading poll...
            </Typography>
          </LoadingContainer>
        </Container>
      </StyledBox>
    );
  }

  // Show error if poll not found
  if (!poll) {
    return (
      <StyledBox themeColors={themeColors}>
        <GridPattern themeColors={themeColors} />
        <BackButton
          onClick={() => navigate("/")}
          size="large"
          themeColors={themeColors}
        >
          <ArrowBackIcon />
        </BackButton>
        <Container maxWidth="md">
          <ErrorContainer themeColors={themeColors}>
            <Box fontSize="80px" mb={3}>
              ❌
            </Box>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                color: themeColors.textPrimary,
                transition: "color 0.3s ease",
              }}
              mb={2}
            >
              Poll Not Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: themeColors.textSecondary,
                transition: "color 0.3s ease",
              }}
              mb={4}
            >
              The poll you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                borderRadius: "12px",
                padding: "12px 32px",
                fontWeight: "700",
                textTransform: "none",
              }}
            >
              Back to Polls
            </Button>
          </ErrorContainer>
        </Container>
      </StyledBox>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <StyledBox themeColors={themeColors}>
      <GridPattern themeColors={themeColors} />

      {/* Back Button */}
      <BackButton
        onClick={() => navigate("/")}
        size="large"
        themeColors={themeColors}
      >
        <ArrowBackIcon />
      </BackButton>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <HeaderContainer>
            <IconContainer>🗳️</IconContainer>
            <StatusChip icon={<HowToVoteIcon />} label="Cast Your Vote" />
            <Title variant="h2" themeColors={themeColors}>
              {poll.question}
            </Title>
            <Subtitle themeColors={themeColors}>
              Select one option below and click vote to submit your choice
            </Subtitle>
          </HeaderContainer>
        </Fade>

        <Fade in timeout={1000}>
          <StyledCard themeColors={themeColors}>
            <CardContent sx={{ p: 4 }}>
              {/* Radio buttons for each option */}
              <RadioGroup
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {poll.options.map((option, index) => (
                  <Fade in timeout={1200 + index * 100} key={option.id}>
                    <OptionCard
                      selected={selected === option.id.toString()}
                      onClick={() => setSelected(option.id.toString())}
                      themeColors={themeColors}
                    >
                      <FormControlLabel
                        value={option.id}
                        control={
                          <Radio
                            icon={
                              <RadioButtonUncheckedIcon
                                sx={{
                                  color: themeColors.textTertiary,
                                  fontSize: 28,
                                }}
                              />
                            }
                            checkedIcon={
                              <RadioButtonCheckedIcon
                                sx={{ color: "#a5b4fc", fontSize: 28 }}
                              />
                            }
                            sx={{ mr: 1 }}
                          />
                        }
                        label={
                          <OptionLabel
                            selected={selected === option.id.toString()}
                            themeColors={themeColors}
                          >
                            {option.text}
                            {/* Green tick when selected */}
                            {selected === option.id.toString() && (
                              <CheckCircleIcon
                                sx={{
                                  color: "#10b981",
                                  ml: "auto",
                                  fontSize: 24,
                                }}
                              />
                            )}
                          </OptionLabel>
                        }
                        sx={{ width: "100%", margin: 0 }}
                      />
                    </OptionCard>
                  </Fade>
                ))}
              </RadioGroup>

              {/* Submit button */}
              <Box
                mt={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <VoteButton
                  onClick={handleVote}
                  disabled={!selected || voting}
                  fullWidth
                  startIcon={
                    voting ? <CircularProgress size={20} /> : <HowToVoteIcon />
                  }
                >
                  {voting ? "Submitting Vote..." : "Submit Vote"}
                </VoteButton>

                <Typography
                  variant="caption"
                  sx={{
                    color: themeColors.textTertiary,
                    transition: "color 0.3s ease",
                  }}
                  textAlign="center"
                >
                  💡 Your vote is anonymous and cannot be changed after
                  submission
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Fade>
      </Container>
    </StyledBox>
  );
}

export default PollDetail;
