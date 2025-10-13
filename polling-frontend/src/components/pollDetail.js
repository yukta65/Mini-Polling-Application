import React, { useEffect, useState } from "react";
import api from "../api";
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

const BackButton = styled(IconButton)({
  position: "absolute",
  top: "80px",
  left: "40px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#cbd5e1",
  zIndex: 2,
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(99, 102, 241, 0.2)",
    transform: "translateX(-5px)",
    color: "#a5b4fc",
  },
});

const HeaderContainer = styled(Box)({
  textAlign: "center",
  marginBottom: "40px",
  position: "relative",
  zIndex: 1,
});

const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
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

const Title = styled(Typography)({
  fontWeight: "800",
  fontSize: "38px",
  color: "#f1f5f9",
  marginBottom: "16px",
  lineHeight: "1.3",
  maxWidth: "800px",
  margin: "0 auto 16px",
});

const Subtitle = styled(Typography)({
  color: "#94a3b8",
  fontSize: "16px",
  fontWeight: "400",
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

const OptionCard = styled(Box)(({ selected }) => ({
  background: selected
    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)"
    : "rgba(255, 255, 255, 0.03)",
  border: selected
    ? "2px solid rgba(99, 102, 241, 0.6)"
    : "2px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px 24px",
  marginBottom: "16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    background: selected
      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)"
      : "rgba(255, 255, 255, 0.06)",
    borderColor: selected
      ? "rgba(99, 102, 241, 0.8)"
      : "rgba(99, 102, 241, 0.3)",
    transform: "translateX(8px)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background: selected
      ? "linear-gradient(90deg, rgba(99, 102, 241, 0.3) 0%, transparent 100%)"
      : "transparent",
    borderRadius: "14px",
    opacity: 0.5,
  },
}));

const OptionLabel = styled(Typography)(({ selected }) => ({
  color: selected ? "#ffffff" : "#cbd5e1",
  fontSize: "18px",
  fontWeight: selected ? "700" : "500",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  position: "relative",
  zIndex: 1,
}));

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
    boxShadow: "0 12px 40px rgba(99, 102, 241, 0.6)",
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.05)",
    color: "#64748b",
    boxShadow: "none",
  },
});

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
  "& .MuiCircularProgress-circle": {
    strokeLinecap: "round",
  },
});

const ErrorContainer = styled(Box)({
  textAlign: "center",
  padding: "80px 40px",
  background: "rgba(255, 255, 255, 0.03)",
  borderRadius: "24px",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  maxWidth: "600px",
  margin: "0 auto",
});

const StatusChip = styled(Chip)({
  background: "rgba(99, 102, 241, 0.15)",
  color: "#a5b4fc",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  fontSize: "14px",
  fontWeight: "700",
  height: "32px",
  marginBottom: "24px",
});

function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

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

  if (loading) {
    return (
      <StyledBox>
        <GridPattern />
        <Container maxWidth="md">
          <LoadingContainer>
            <StyledCircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="#94a3b8" fontWeight="600">
              Loading poll...
            </Typography>
          </LoadingContainer>
        </Container>
      </StyledBox>
    );
  }

  if (!poll) {
    return (
      <StyledBox>
        <GridPattern />
        <BackButton onClick={() => navigate("/")} size="large">
          <ArrowBackIcon />
        </BackButton>
        <Container maxWidth="md">
          <ErrorContainer>
            <Box fontSize="80px" mb={3}>
              ❌
            </Box>
            <Typography variant="h4" fontWeight="800" color="#f1f5f9" mb={2}>
              Poll Not Found
            </Typography>
            <Typography variant="body1" color="#94a3b8" mb={4}>
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

  return (
    <StyledBox>
      <GridPattern />

      <BackButton onClick={() => navigate("/")} size="large">
        <ArrowBackIcon />
      </BackButton>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <HeaderContainer>
            <IconContainer>
              <span role="img" aria-label="vote">
                🗳️
              </span>
            </IconContainer>
            <StatusChip icon={<HowToVoteIcon />} label="Cast Your Vote" />
            <Title variant="h2">{poll.question}</Title>
            <Subtitle>
              Select one option below and click vote to submit your choice
            </Subtitle>
          </HeaderContainer>
        </Fade>

        <Fade in timeout={1000}>
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <RadioGroup
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {poll.options.map((option, index) => (
                  <Fade in timeout={1200 + index * 100} key={option.id}>
                    <OptionCard
                      selected={selected === option.id.toString()}
                      onClick={() => setSelected(option.id.toString())}
                    >
                      <FormControlLabel
                        value={option.id}
                        control={
                          <Radio
                            icon={
                              <RadioButtonUncheckedIcon
                                sx={{ color: "#64748b", fontSize: 28 }}
                              />
                            }
                            checkedIcon={
                              <RadioButtonCheckedIcon
                                sx={{
                                  color: "#a5b4fc",
                                  fontSize: 28,
                                }}
                              />
                            }
                            sx={{ mr: 1 }}
                          />
                        }
                        label={
                          <OptionLabel
                            selected={selected === option.id.toString()}
                          >
                            {option.text}
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
                        sx={{
                          width: "100%",
                          margin: 0,
                          "& .MuiFormControlLabel-label": {
                            width: "100%",
                          },
                        }}
                      />
                    </OptionCard>
                  </Fade>
                ))}
              </RadioGroup>

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
                  color="#64748b"
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
