import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Fade,
  Chip,
  IconButton,
  CircularProgress,
  LinearProgress,
  Grid,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTitle,
  Tooltip,
  Legend
);

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
  marginBottom: "50px",
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

const StatusChip = styled(Chip)({
  background: "rgba(16, 185, 129, 0.15)",
  color: "#6ee7b7",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  fontSize: "14px",
  fontWeight: "700",
  height: "32px",
  marginBottom: "24px",
  animation: "pulse 2s ease-in-out infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.7,
    },
  },
});

const StatsBar = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  marginBottom: "40px",
  flexWrap: "wrap",
  position: "relative",
  zIndex: 1,
});

const StatCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px 28px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.08)",
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.2)",
  },
});

const StatIcon = styled(Avatar)({
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  width: "48px",
  height: "48px",
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
  marginBottom: "24px",
});

const OptionResultCard = styled(Box)(({ isWinner }) => ({
  background: isWinner
    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)"
    : "rgba(255, 255, 255, 0.03)",
  border: isWinner
    ? "2px solid rgba(99, 102, 241, 0.5)"
    : "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "16px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    background: isWinner
      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)"
      : "rgba(255, 255, 255, 0.05)",
    transform: "translateX(8px)",
  },
}));

const OptionHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
});

const OptionLabel = styled(Typography)(({ isWinner }) => ({
  color: isWinner ? "#ffffff" : "#cbd5e1",
  fontSize: "18px",
  fontWeight: isWinner ? "800" : "600",
  display: "flex",
  alignItems: "center",
  gap: "12px",
}));

const VoteCount = styled(Typography)(({ isWinner }) => ({
  color: isWinner ? "#a5b4fc" : "#94a3b8",
  fontSize: "24px",
  fontWeight: "800",
}));

const StyledLinearProgress = styled(LinearProgress)(({ isWinner }) => ({
  height: "12px",
  borderRadius: "6px",
  background: "rgba(255, 255, 255, 0.05)",
  "& .MuiLinearProgress-bar": {
    background: isWinner
      ? "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)"
      : "linear-gradient(90deg, rgba(99, 102, 241, 0.5) 0%, rgba(168, 85, 247, 0.3) 100%)",
    borderRadius: "6px",
  },
}));

const PercentageLabel = styled(Typography)({
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "8px",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  gap: "24px",
});

const ChartContainer = styled(Box)({
  padding: "20px",
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: "16px",
  "& canvas": {
    maxHeight: "400px !important",
  },
});

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = () => {
    api
      .get(`/polls/${id}/results`)
      .then((res) => {
        setPoll(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResults();
  }, [id]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("pollUpdated", (data) => {
      if (data.pollId == id) fetchResults();
    });
    return () => socket.disconnect();
  }, [id]);

  if (loading) {
    return (
      <StyledBox>
        <GridPattern />
        <Container maxWidth="lg">
          <LoadingContainer>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#a5b4fc" }}
            />
            <Typography variant="h6" color="#94a3b8" fontWeight="600">
              Loading results...
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
        <Container maxWidth="lg">
          <Box
            textAlign="center"
            padding="80px 40px"
            sx={{
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography variant="h4" color="#f1f5f9" mb={2}>
              Poll not found
            </Typography>
          </Box>
        </Container>
      </StyledBox>
    );
  }

  const labels = poll.options.map((opt) => opt.text);
  const votes = poll.options.map((opt) => (opt.votes ? opt.votes.length : 0));
  const totalVotes = votes.reduce((sum, v) => sum + v, 0);
  const maxVotes = Math.max(...votes);
  const winningOptions = poll.options.filter(
    (opt) => (opt.votes ? opt.votes.length : 0) === maxVotes && maxVotes > 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Votes",
        data: votes,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(168, 85, 247, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const percentage =
              totalVotes > 0
                ? ((context.parsed.y / totalVotes) * 100).toFixed(1)
                : 0;
            return `${context.parsed.y} votes (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
          font: { size: 12, weight: "600" },
          precision: 0,
        },
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 13, weight: "600" },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <StyledBox>
      <GridPattern />

      <BackButton onClick={() => navigate("/")} size="large">
        <ArrowBackIcon />
      </BackButton>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <HeaderContainer>
            <IconContainer>
              <span role="img" aria-label="results">
                📊
              </span>
            </IconContainer>
            <StatusChip icon={<FiberManualRecordIcon />} label="Live Results" />
            <Title variant="h2">{poll.question}</Title>
            <Subtitle>Real-time voting results updated automatically</Subtitle>
          </HeaderContainer>
        </Fade>

        <Fade in timeout={1000}>
          <StatsBar>
            <StatCard>
              <StatIcon>
                <PeopleIcon />
              </StatIcon>
              <Box>
                <Typography variant="h4" fontWeight="800" color="#ffffff">
                  {totalVotes}
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  Total Votes
                </Typography>
              </Box>
            </StatCard>

            <StatCard>
              <StatIcon>
                <BarChartIcon />
              </StatIcon>
              <Box>
                <Typography variant="h4" fontWeight="800" color="#ffffff">
                  {poll.options.length}
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  Options
                </Typography>
              </Box>
            </StatCard>

            {winningOptions.length > 0 && (
              <StatCard>
                <StatIcon>
                  <EmojiEventsIcon />
                </StatIcon>
                <Box>
                  <Typography variant="h4" fontWeight="800" color="#ffffff">
                    {maxVotes}
                  </Typography>
                  <Typography variant="body2" color="#94a3b8">
                    Top Votes
                  </Typography>
                </Box>
              </StatCard>
            )}
          </StatsBar>
        </Fade>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Fade in timeout={1200}>
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    color="#f1f5f9"
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <TrendingUpIcon sx={{ color: "#a5b4fc" }} />
                    Vote Breakdown
                  </Typography>

                  {poll.options.map((option, index) => {
                    const optionVotes = option.votes ? option.votes.length : 0;
                    const percentage =
                      totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                    const isWinner =
                      optionVotes === maxVotes &&
                      maxVotes > 0 &&
                      totalVotes > 0;

                    return (
                      <Fade in timeout={1400 + index * 100} key={option.id}>
                        <OptionResultCard isWinner={isWinner}>
                          <OptionHeader>
                            <OptionLabel isWinner={isWinner}>
                              {isWinner && (
                                <EmojiEventsIcon
                                  sx={{ color: "#fbbf24", fontSize: 24 }}
                                />
                              )}
                              {option.text}
                            </OptionLabel>
                            <VoteCount isWinner={isWinner}>
                              {optionVotes}
                            </VoteCount>
                          </OptionHeader>
                          <StyledLinearProgress
                            variant="determinate"
                            value={percentage}
                            isWinner={isWinner}
                          />
                          <PercentageLabel>
                            {percentage.toFixed(1)}% of total votes
                          </PercentageLabel>
                        </OptionResultCard>
                      </Fade>
                    );
                  })}
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Fade in timeout={1200}>
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    color="#f1f5f9"
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <BarChartIcon sx={{ color: "#a5b4fc" }} />
                    Visual Overview
                  </Typography>
                  <ChartContainer>
                    <Bar data={chartData} options={chartOptions} />
                  </ChartContainer>
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </StyledBox>
  );
}

export default Results;
