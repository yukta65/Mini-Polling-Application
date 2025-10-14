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
import { useTheme } from "../theme/context";
import ThemeToggle from "../theme/toggle";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTitle,
  Tooltip,
  Legend
);

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
  "@keyframes drift": {
    "0%, 100%": {
      transform: "translate(0, 0) scale(1)",
    },
    "50%": {
      transform: "translate(50px, 30px) scale(1.1)",
    },
  },
}));

const GridPattern = styled(Box)(({ themeColors }) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(${themeColors.gridColor} 1px, transparent 1px),
                    linear-gradient(90deg, ${themeColors.gridColor} 1px, transparent 1px)`,
  backgroundSize: "50px 50px",
  zIndex: 0,
}));

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

const StatusChip = styled(Chip)(({ themeColors }) => ({
  background: themeColors.statusBg,
  color: themeColors.statusColor,
  border: `1px solid ${themeColors.statusBorder}`,
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
}));

const StatsBar = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  marginBottom: "40px",
  flexWrap: "wrap",
  position: "relative",
  zIndex: 1,
});

const StatCard = styled(Box)(({ themeColors }) => ({
  background: themeColors.bgGlass,
  backdropFilter: "blur(20px)",
  border: `1px solid ${themeColors.borderPrimary}`,
  borderRadius: "16px",
  padding: "20px 28px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: themeColors.bgGlassHover,
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.2)",
  },
}));

const StatIcon = styled(Avatar)({
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  width: "48px",
  height: "48px",
});

const StyledCard = styled(Card)(({ themeColors }) => ({
  borderRadius: "24px",
  background: themeColors.bgCard,
  backdropFilter: "blur(20px)",
  border: `1px solid ${themeColors.borderPrimary}`,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  position: "relative",
  zIndex: 1,
  overflow: "visible",
  marginBottom: "24px",
  transition: "all 0.3s ease",
}));

const OptionResultCard = styled(Box)(({ isWinner, themeColors }) => ({
  background: isWinner ? themeColors.winnerBg : themeColors.bgCard,
  border: isWinner
    ? `2px solid ${themeColors.winnerBorder}`
    : `1px solid ${themeColors.borderPrimary}`,
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "16px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    background: isWinner ? themeColors.winnerBgHover : themeColors.bgCardHover,
    transform: "translateX(8px)",
  },
}));

const OptionHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
});

const OptionLabel = styled(Typography)(({ isWinner, themeColors }) => ({
  color: isWinner ? themeColors.textPrimary : themeColors.textSecondary,
  fontSize: "18px",
  fontWeight: isWinner ? "800" : "600",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  transition: "color 0.3s ease",
}));

const VoteCount = styled(Typography)(({ isWinner, themeColors }) => ({
  color: isWinner ? "#a5b4fc" : themeColors.textSecondary,
  fontSize: "24px",
  fontWeight: "800",
  transition: "color 0.3s ease",
}));

const StyledLinearProgress = styled(LinearProgress)(
  ({ isWinner, themeColors }) => ({
    height: "12px",
    borderRadius: "6px",
    background: themeColors.progressBg,
    "& .MuiLinearProgress-bar": {
      background: isWinner
        ? "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)"
        : "linear-gradient(90deg, rgba(99, 102, 241, 0.5) 0%, rgba(168, 85, 247, 0.3) 100%)",
      borderRadius: "6px",
    },
  })
);

const PercentageLabel = styled(Typography)(({ themeColors }) => ({
  color: themeColors.textTertiary,
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "8px",
  transition: "color 0.3s ease",
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  gap: "24px",
});

const ChartContainer = styled(Box)(({ themeColors }) => ({
  padding: "20px",
  background: themeColors.bgSecondary,
  borderRadius: "16px",
  transition: "background 0.3s ease",
  "& canvas": {
    maxHeight: "400px !important",
  },
}));

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors: themeColors, isDark } = useTheme();

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
      <StyledBox themeColors={themeColors}>
        <GridPattern themeColors={themeColors} />
        <ThemeToggle />
        <Container maxWidth="lg">
          <LoadingContainer>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#a5b4fc" }}
            />
            <Typography
              variant="h6"
              color={themeColors.textSecondary}
              fontWeight="600"
            >
              Loading results...
            </Typography>
          </LoadingContainer>
        </Container>
      </StyledBox>
    );
  }

  if (!poll) {
    return (
      <StyledBox themeColors={themeColors}>
        <GridPattern themeColors={themeColors} />
        <ThemeToggle />
        <Container maxWidth="lg">
          <Box
            textAlign="center"
            padding="80px 40px"
            sx={{
              background: themeColors.bgCard,
              borderRadius: "24px",
              border: `1px solid ${themeColors.borderPrimary}`,
            }}
          >
            <Typography variant="h4" color={themeColors.textPrimary} mb={2}>
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
        backgroundColor: themeColors.chartTooltipBg,
        titleColor: themeColors.textPrimary,
        bodyColor: themeColors.textSecondary,
        borderColor: themeColors.chartTooltipBorder,
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
          color: themeColors.textSecondary,
          font: { size: 12, weight: "600" },
          precision: 0,
        },
        grid: {
          color: themeColors.chartGrid,
        },
      },
      x: {
        ticks: {
          color: themeColors.textSecondary,
          font: { size: 13, weight: "600" },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <StyledBox themeColors={themeColors}>
      <GridPattern themeColors={themeColors} />
      <ThemeToggle />

      <BackButton
        onClick={() => navigate("/")}
        size="large"
        themeColors={themeColors}
      >
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
            <StatusChip
              icon={<FiberManualRecordIcon />}
              label="Live Results"
              themeColors={themeColors}
            />
            <Title variant="h2" themeColors={themeColors}>
              {poll.question}
            </Title>
            <Subtitle themeColors={themeColors}>
              Real-time voting results updated automatically
            </Subtitle>
          </HeaderContainer>
        </Fade>

        <Fade in timeout={1000}>
          <StatsBar>
            <StatCard themeColors={themeColors}>
              <StatIcon>
                <PeopleIcon />
              </StatIcon>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="800"
                  color={themeColors.textPrimary}
                >
                  {totalVotes}
                </Typography>
                <Typography variant="body2" color={themeColors.textSecondary}>
                  Total Votes
                </Typography>
              </Box>
            </StatCard>

            <StatCard themeColors={themeColors}>
              <StatIcon>
                <BarChartIcon />
              </StatIcon>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="800"
                  color={themeColors.textPrimary}
                >
                  {poll.options.length}
                </Typography>
                <Typography variant="body2" color={themeColors.textSecondary}>
                  Options
                </Typography>
              </Box>
            </StatCard>

            {winningOptions.length > 0 && (
              <StatCard themeColors={themeColors}>
                <StatIcon>
                  <EmojiEventsIcon />
                </StatIcon>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    color={themeColors.textPrimary}
                  >
                    {maxVotes}
                  </Typography>
                  <Typography variant="body2" color={themeColors.textSecondary}>
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
              <StyledCard themeColors={themeColors}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    color={themeColors.textPrimary}
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
                        <OptionResultCard
                          isWinner={isWinner}
                          themeColors={themeColors}
                        >
                          <OptionHeader>
                            <OptionLabel
                              isWinner={isWinner}
                              themeColors={themeColors}
                            >
                              {isWinner && (
                                <EmojiEventsIcon
                                  sx={{ color: "#fbbf24", fontSize: 24 }}
                                />
                              )}
                              {option.text}
                            </OptionLabel>
                            <VoteCount
                              isWinner={isWinner}
                              themeColors={themeColors}
                            >
                              {optionVotes}
                            </VoteCount>
                          </OptionHeader>
                          <StyledLinearProgress
                            variant="determinate"
                            value={percentage}
                            isWinner={isWinner}
                            themeColors={themeColors}
                          />
                          <PercentageLabel themeColors={themeColors}>
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
              <StyledCard themeColors={themeColors}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    color={themeColors.textPrimary}
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <BarChartIcon sx={{ color: "#a5b4fc" }} />
                    Visual Overview
                  </Typography>
                  <ChartContainer themeColors={themeColors}>
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
