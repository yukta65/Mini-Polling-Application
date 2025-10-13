const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");
const auth = require("../middleware/auth");

router.post("/", auth(["admin"]), pollController.createPoll);
router.get("/", pollController.listPolls);
router.get("/:id", pollController.getPoll);
router.post("/:id/vote", auth(), pollController.vote); // Only logged-in users can vote
router.get("/:id/results", pollController.getResults);

module.exports = router;
