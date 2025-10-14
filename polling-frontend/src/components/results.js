// Import necessary React hooks and dependencies
import React, { useEffect, useState } from "react";
import api from "../api"; // API service for making HTTP requests
import { useParams, useNavigate } from "react-router-dom"; // React Router hooks for URL params and navigation
import { io } from "socket.io-client"; // Socket.io for real-time updates
// Import Chart.js components for creating bar charts
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2"; // React wrapper for Chart.js bar chart
// Import Material-UI components
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
import { styled } from "@mui/material/styles"; // MUI styled components
// Import Material-UI icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// Register Chart.js components globally to enable chart functionality
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTitle,
  Tooltip,
  Legend
);

// Main container with dark gradient background and animated orbs
const StyledBox = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  position: "relative",
  overflow: "hidden",
  padding: "60px 0",
  // Top-right animated circle using pseudo-element
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
  // Bottom-left animated circle using pseudo-element
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
  // Keyframe animation for drifting orbs (moves and scales)
  "@keyframes drift": {
    "0%, 100%": {
      transform: "translate(0, 0) scale(1)",
    },
    "50%": {
      transform: "translate(50px, 30px) scale(1.1)",
    },
  },
});

// Grid pattern overlay for background texture
const GridPattern = styled(Box)({
  position: "absolute",
  inset: 0,
  // Creates subtle grid lines using linear gradients
  backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)`,
  backgroundSize: "50px 50px",
  zIndex: 0, // Behind all content
});

// Back button in top-left corner to navigate back to poll list
const BackButton = styled(IconButton)({
  position: "absolute",
  top: "80px",
  left: "40px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)", // Glassmorphism effect
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#cbd5e1",
  zIndex: 2, // Above background elements
  transition: "all 0.3s ease",
  // Hover effect: slides left and changes color
  "&:hover": {
    background: "rgba(99, 102, 241, 0.2)",
    transform: "translateX(-5px)",
    color: "#a5b4fc",
  },
});

// Header container for title and subtitle
const HeaderContainer = styled(Box)({
  textAlign: "center",
  marginBottom: "50px",
  position: "relative",
  zIndex: 1,
});

// Animated icon container (bouncing emoji)
const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
  fontSize: "72px",
  animation: "bounce 2s ease-in-out infinite",
  // Keyframe for bouncing animation
  "@keyframes bounce": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-15px)",
    },
  },
});

// Main title text styling
const Title = styled(Typography)({
  fontWeight: "800",
  fontSize: "38px",
  color: "#f1f5f9",
  marginBottom: "16px",
  lineHeight: "1.3",
  maxWidth: "800px",
  margin: "0 auto 16px",
});

// Subtitle text below title
const Subtitle = styled(Typography)({
  color: "#94a3b8",
  fontSize: "16px",
  fontWeight: "400",
});

// Status chip showing "Live Results" with pulsing animation
const StatusChip = styled(Chip)({
  background: "rgba(16, 185, 129, 0.15)", // Green tint for "live" status
  color: "#6ee7b7",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  fontSize: "14px",
  fontWeight: "700",
  height: "32px",
  marginBottom: "24px",
  animation: "pulse 2s ease-in-out infinite",
  // Keyframe for pulsing opacity effect
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.7,
    },
  },
});

// Container for statistics cards (Total Votes, Options, Top Votes)
const StatsBar = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  marginBottom: "40px",
  flexWrap: "wrap", // Wraps on smaller screens
  position: "relative",
  zIndex: 1,
});

// Individual stat card with glassmorphism effect
const StatCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)", // Glassmorphism blur
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px 28px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  transition: "all 0.3s ease",
  // Hover effect: lifts up and glows
  "&:hover": {
    background: "rgba(255, 255, 255, 0.08)",
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.2)",
  },
});

// Icon avatar inside stat cards with gradient background
const StatIcon = styled(Avatar)({
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  width: "48px",
  height: "48px",
});

// Card container for vote breakdown and chart sections
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

// Individual option result card with conditional styling for winners
const OptionResultCard = styled(Box)(({ isWinner }) => ({
  // Winner gets gradient background, non-winners get subtle background
  background: isWinner
    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)"
    : "rgba(255, 255, 255, 0.03)",
  // Winner gets thicker, more visible border
  border: isWinner
    ? "2px solid rgba(99, 102, 241, 0.5)"
    : "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "16px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  // Hover effect: slides right and enhances background
  "&:hover": {
    background: isWinner
      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)"
      : "rgba(255, 255, 255, 0.05)",
    transform: "translateX(8px)",
  },
}));

// Header row for each option (label on left, vote count on right)
const OptionHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
});

// Option label text with conditional styling for winners
const OptionLabel = styled(Typography)(({ isWinner }) => ({
  color: isWinner ? "#ffffff" : "#cbd5e1", // Brighter for winners
  fontSize: "18px",
  fontWeight: isWinner ? "800" : "600", // Bolder for winners
  display: "flex",
  alignItems: "center",
  gap: "12px",
}));

// Vote count number with conditional styling for winners
const VoteCount = styled(Typography)(({ isWinner }) => ({
  color: isWinner ? "#a5b4fc" : "#94a3b8", // Purple for winners
  fontSize: "24px",
  fontWeight: "800",
}));

// Progress bar with conditional gradient for winners
const StyledLinearProgress = styled(LinearProgress)(({ isWinner }) => ({
  height: "12px",
  borderRadius: "6px",
  background: "rgba(255, 255, 255, 0.05)",
  "& .MuiLinearProgress-bar": {
    // Winner gets full gradient, non-winners get muted gradient
    background: isWinner
      ? "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)"
      : "linear-gradient(90deg, rgba(99, 102, 241, 0.5) 0%, rgba(168, 85, 247, 0.3) 100%)",
    borderRadius: "6px",
  },
}));

// Percentage label below progress bar
const PercentageLabel = styled(Typography)({
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "8px",
});

// Loading state container (centered spinner)
const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  gap: "24px",
});

// Container for Chart.js bar chart with custom styling
const ChartContainer = styled(Box)({
  padding: "20px",
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: "16px",
  "& canvas": {
    maxHeight: "400px !important", // Limit chart height
  },
});

// Main Results component function
function Results() {
  // Get poll ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate(); // Navigation function
  // State variables
  const [poll, setPoll] = useState(null); // Poll data
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch poll results from API
  const fetchResults = () => {
    api
      .get(`/polls/${id}/results`)
      .then((res) => {
        setPoll(res.data); // Update poll state with response
        setLoading(false); // Stop loading
      })
      .catch(() => {
        setLoading(false); // Stop loading even on error
      });
  };

  // Fetch results on component mount or when poll ID changes
  useEffect(() => {
    fetchResults();
  }, [id]);

  // Set up Socket.io connection for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5000"); // Connect to backend
    // Listen for poll update events
    socket.on("pollUpdated", (data) => {
      if (data.pollId == id) fetchResults(); // Refresh if this poll was updated
    });
    // Cleanup: disconnect socket when component unmounts
    return () => socket.disconnect();
  }, [id]);

  // Loading state UI (spinner with message)
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

  // Error state UI (poll not found)
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

  // Calculate statistics and prepare data for chart
  const labels = poll.options.map((opt) => opt.text); // Option names for chart labels
  const votes = poll.options.map((opt) => (opt.votes ? opt.votes.length : 0)); // Vote counts for chart data
  const totalVotes = votes.reduce((sum, v) => sum + v, 0); // Sum of all votes
  const maxVotes = Math.max(...votes); // Highest vote count
  // Filter options that have the maximum votes (winners - can be multiple if tied)
  const winningOptions = poll.options.filter(
    (opt) => (opt.votes ? opt.votes.length : 0) === maxVotes && maxVotes > 0
  );

  // Chart.js data configuration
  const chartData = {
    labels, // X-axis labels (option names)
    datasets: [
      {
        label: "Votes",
        data: votes, // Y-axis data (vote counts)
        backgroundColor: "rgba(99, 102, 241, 0.8)", // Bar color
        borderColor: "rgba(99, 102, 241, 1)", // Bar border
        borderWidth: 2,
        borderRadius: 8, // Rounded bar corners
        hoverBackgroundColor: "rgba(168, 85, 247, 0.8)", // Hover color
      },
    ],
  };

  // Chart.js options configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: false, // Hide title
      },
      // Custom tooltip styling and content
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)", // Dark background
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
        padding: 12,
        displayColors: false, // Hide color box in tooltip
        callbacks: {
          // Custom tooltip label showing votes and percentage
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
      // Y-axis (vertical) configuration
      y: {
        beginAtZero: true, // Start from 0
        ticks: {
          color: "#94a3b8",
          font: { size: 12, weight: "600" },
          precision: 0, // Whole numbers only
        },
        grid: {
          color: "rgba(148, 163, 184, 0.1)", // Subtle grid lines
        },
      },
      // X-axis (horizontal) configuration
      x: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 13, weight: "600" },
        },
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
    },
  };

  // Main results page UI
  return (
    <StyledBox>
      <GridPattern />

      {/* Back button to return to poll list */}
      <BackButton onClick={() => navigate("/")} size="large">
        <ArrowBackIcon />
      </BackButton>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header section with fade-in animation */}
        <Fade in timeout={800}>
          <HeaderContainer>
            {/* Animated chart emoji */}
            <IconContainer>
              <span role="img" aria-label="results">
                📊
              </span>
            </IconContainer>
            {/* Pulsing "Live Results" badge */}
            <StatusChip icon={<FiberManualRecordIcon />} label="Live Results" />
            {/* Poll question as title */}
            <Title variant="h2">{poll.question}</Title>
            <Subtitle>Real-time voting results updated automatically</Subtitle>
          </HeaderContainer>
        </Fade>

        {/* Statistics bar with fade-in animation */}
        <Fade in timeout={1000}>
          <StatsBar>
            {/* Total Votes stat card */}
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

            {/* Number of Options stat card */}
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

            {/* Top Votes stat card (only shown if there are votes) */}
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

        {/* Two-column grid layout (Vote Breakdown + Visual Overview) */}
        <Grid container spacing={3}>
          {/* Left column: Vote Breakdown (list view) */}
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

                  {/* Map through each option to display results */}
                  {poll.options.map((option, index) => {
                    const optionVotes = option.votes ? option.votes.length : 0;
                    const percentage =
                      totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                    // Determine if this option is a winner
                    const isWinner =
                      optionVotes === maxVotes &&
                      maxVotes > 0 &&
                      totalVotes > 0;

                    return (
                      // Staggered fade-in for each option
                      <Fade in timeout={1400 + index * 100} key={option.id}>
                        <OptionResultCard isWinner={isWinner}>
                          <OptionHeader>
                            <OptionLabel isWinner={isWinner}>
                              {/* Show trophy icon for winners */}
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
                          {/* Progress bar showing vote percentage */}
                          <StyledLinearProgress
                            variant="determinate"
                            value={percentage}
                            isWinner={isWinner}
                          />
                          {/* Percentage label below progress bar */}
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

          {/* Right column: Visual Overview (bar chart) */}
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
                  {/* Chart.js Bar Chart */}
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
