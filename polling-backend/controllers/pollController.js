const { Poll, Option, Vote } = require("../models");
const { Op } = require("sequelize");

exports.createPoll = async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;
    const poll = await Poll.create(
      { question, expiresAt },
      { include: ["options"] }
    );
    const optionRecords = await Promise.all(
      options.map((text) => Option.create({ text, PollId: poll.id }))
    );
    res.status(201).json({ poll, options: optionRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.listPolls = async (req, res) => {
  try {
    const now = new Date();
    const polls = await Poll.findAll({
      where: {
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: now } }],
      },
      include: [{ model: Option, as: "options" }],
    });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, { include: ["options"] });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.vote = async (req, res) => {
  try {
    const { optionId } = req.body;
    const pollId = req.params.id;
    const voter = req.user ? req.user.id : req.ip; // Use user id if logged in, else IP
    // Prevent duplicate voting
    const existingVote = await Vote.findOne({ where: { pollId, voter } });
    if (existingVote) return res.status(400).json({ error: "Already voted" });
    const vote = await Vote.create({ pollId, OptionId: optionId, voter });

    // Real-time update
    const io = req.app.get("io");
    io.emit("pollUpdated", { pollId });

    res.status(201).json(vote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: Option,
          as: "options",
          include: [{ model: Vote, as: "votes" }],
        },
      ],
    });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
