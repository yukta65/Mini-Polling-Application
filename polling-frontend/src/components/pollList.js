import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Fade,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import BarChartIcon from "@mui/icons-material/BarChart";
import RefreshIcon from "@mui/icons-material/Refresh";

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
  marginBottom: "60px",
  position: "relative",
  zIndex: 1,
});

const Title = styled(Typography)({
  fontWeight: "800",
  fontSize: "56px",
  background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "16px",
  letterSpacing: "-2px",
});

const Subtitle = styled(Typography)({
  color: "#94a3b8",
  fontSize: "20px",
  fontWeight: "400",
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: "1.6",
});

const StatsBar = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "40px",
  marginBottom: "50px",
  flexWrap: "wrap",
  position: "relative",
  zIndex: 1,
});

const StatCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px 32px",
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
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    transform: "translateY(-12px)",
    boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
    background: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(99, 102, 241, 0.3)",
    "&::before": {
      opacity: 1,
    },
  },
});

const PollQuestion = styled(Typography)({
  fontWeight: "700",
  fontSize: "22px",
  color: "#f1f5f9",
  marginBottom: "16px",
  lineHeight: "1.4",
  minHeight: "60px",
});

const PollMeta = styled(Box)({
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  flexWrap: "wrap",
});

const MetaChip = styled(Chip)({
  background: "rgba(99, 102, 241, 0.15)",
  color: "#a5b4fc",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  fontSize: "12px",
  fontWeight: "600",
  height: "28px",
  "& .MuiChip-icon": {
    color: "#a5b4fc",
    fontSize: "16px",
  },
});

const ButtonContainer = styled(Box)({
  display: "flex",
  gap: "12px",
  marginTop: "auto",
});

const StyledButton = styled(Button)({
  borderRadius: "14px",
  padding: "12px 24px",
  fontSize: "15px",
  fontWeight: "700",
  textTransform: "none",
  flex: 1,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&.vote-button": {
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
    "&:hover": {
      background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
      transform: "scale(1.05)",
      boxShadow: "0 8px 30px rgba(99, 102, 241, 0.6)",
    },
  },
  "&.result-button": {
    background: "rgba(255, 255, 255, 0.05)",
    color: "#cbd5e1",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
      transform: "scale(1.05)",
      borderColor: "rgba(168, 85, 247, 0.5)",
      color: "#ffffff",
    },
  },
});

const EmptyState = styled(Box)({
  textAlign: "center",
  padding: "80px 40px",
  background: "rgba(255, 255, 255, 0.03)",
  borderRadius: "24px",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  maxWidth: "600px",
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
});

const EmptyIcon = styled(Box)({
  fontSize: "120px",
  marginBottom: "24px",
  animation: "float 3s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-20px)",
    },
  },
});

const RefreshButton = styled(IconButton)({
  position: "absolute",
  top: "80px",
  right: "40px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#cbd5e1",
  zIndex: 2,
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(99, 102, 241, 0.2)",
    transform: "rotate(180deg)",
    color: "#a5b4fc",
  },
});

function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = () => {
    setLoading(true);
    api.get("/polls").then((res) => {
      setPolls(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const totalPolls = polls.length;
  const totalVotes = polls.reduce((sum, poll) => sum + (poll.votes || 0), 0);
  const activeUsers = Math.floor(totalVotes * 0.7);

  return (
    <StyledBox>
      <GridPattern />

      <RefreshButton onClick={fetchPolls} size="large">
        <RefreshIcon />
      </RefreshButton>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <HeaderContainer>
            <Title variant="h1">Democracy in Action</Title>
            <Subtitle variant="h6">
              Your opinion matters. Participate in live polls and see real-time
              results from our community.
            </Subtitle>
          </HeaderContainer>
        </Fade>

        {/* <Fade in timeout={1000}>
          <StatsBar>
            <StatCard>
              <StatIcon>
                <TrendingUpIcon />
              </StatIcon>
              <Box>
                <Typography variant="h4" fontWeight="800" color="#ffffff">
                  {totalPolls}
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  Active Polls
                </Typography>
              </Box>
            </StatCard>

            <StatCard>
              <StatIcon>
                <HowToVoteIcon />
              </StatIcon>
              <Box>
                <Typography variant="h4" fontWeight="800" color="#ffffff">
                  {totalVotes}
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  Total Votes
                </Typography>
              </Box>
            </StatCard> */}

        {/* <StatCard> */}
        {/* <StatIcon>
            <PeopleIcon />
          </StatIcon>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#ffffff">
              {activeUsers}
            </Typography>
            <Typography variant="body2" color="#94a3b8">
              Active Users
            </Typography>
          </Box>
        </StatCard> */}
        {/* </StatsBar>
        </Fade> */}

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card
                  sx={{
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={40}
                      sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mb: 2 }}
                    />
                    <Box display="flex" gap={1} mb={2}>
                      <Skeleton
                        variant="rounded"
                        width={80}
                        height={28}
                        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />
                      <Skeleton
                        variant="rounded"
                        width={80}
                        height={28}
                        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />
                    </Box>
                    <Box display="flex" gap={1}>
                      <Skeleton
                        variant="rounded"
                        height={48}
                        sx={{ flex: 1, bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />
                      <Skeleton
                        variant="rounded"
                        height={48}
                        sx={{ flex: 1, bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : polls.length === 0 ? (
          <Fade in timeout={600}>
            <EmptyState>
              <EmptyIcon>🗳️</EmptyIcon>
              <Typography variant="h4" fontWeight="800" color="#f1f5f9" mb={2}>
                No Active Polls
              </Typography>
              <Typography variant="body1" color="#94a3b8" mb={3}>
                There are no polls available at the moment. New polls will
                appear here when they are created.
              </Typography>
              <Button
                variant="contained"
                onClick={fetchPolls}
                sx={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                  borderRadius: "12px",
                  padding: "12px 32px",
                  fontWeight: "700",
                  textTransform: "none",
                }}
              >
                Refresh Polls
              </Button>
            </EmptyState>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {polls.map((poll, index) => (
              <Grid item xs={12} sm={6} md={4} key={poll.id}>
                <Fade in timeout={600 + index * 100}>
                  <StyledCard>
                    <CardContent
                      sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <PollQuestion variant="h6">{poll.question}</PollQuestion>

                      <PollMeta>
                        {/* <MetaChip
                          icon={<HowToVoteIcon />}
                          label={`${poll.votes || 0} votes`}
                          size="small"
                        /> */}
                        <MetaChip
                          icon={<AccessTimeIcon />}
                          label="Active"
                          size="small"
                        />
                      </PollMeta>

                      <ButtonContainer>
                        <StyledButton
                          component={Link}
                          to={`/polls/${poll.id}`}
                          className="vote-button"
                          variant="contained"
                          startIcon={<HowToVoteIcon />}
                        >
                          Vote Now
                        </StyledButton>
                        <StyledButton
                          component={Link}
                          to={`/polls/${poll.id}/results`}
                          className="result-button"
                          variant="outlined"
                          startIcon={<BarChartIcon />}
                        >
                          Results
                        </StyledButton>
                      </ButtonContainer>
                    </CardContent>
                  </StyledCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </StyledBox>
  );
}

export default PollList;
