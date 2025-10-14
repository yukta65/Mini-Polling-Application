// Import all database models
const Poll = require("./poll"); // Poll model - represents a survey/poll
const Option = require("./option"); // Option model - represents poll answer choices
const Vote = require("./vote"); // Vote model - represents user votes
const User = require("./user"); // User model - represents registered users

// ----------------------- Model Associations/Relationships -----------------------

// Define relationship: One Poll has many Options
// This creates a foreign key 'pollId' in the Option table
// The 'as: "options"' creates an alias for accessing related options
// Example usage: poll.getOptions() or poll.options
Poll.hasMany(Option, { as: "options" });

// Define reverse relationship: Each Option belongs to one Poll
// This completes the one-to-many relationship
// Allows querying: option.getPoll() or option.poll
Option.belongsTo(Poll);

// Define relationship: One Option has many Votes
// Users can vote on an option multiple times (if allowed)
// Creates foreign key 'optionId' in the Vote table
// Example usage: option.getVotes() or option.votes
Option.hasMany(Vote, { as: "votes" });

// Define reverse relationship: Each Vote belongs to one Option
// Allows querying which option a vote is for
// Example usage: vote.getOption() or vote.option
Vote.belongsTo(Option);

// Define relationship: One Poll has many Votes
// This tracks all votes associated with a poll
// Creates foreign key 'pollId' in the Vote table
// Example usage: poll.getVotes() or poll.votes (to count total participation)
Poll.hasMany(Vote, { as: "votes" });

// Define reverse relationship: Each Vote belongs to one Poll
// Allows querying which poll a vote is associated with
// Example usage: vote.getPoll() or vote.poll
Vote.belongsTo(Poll);

// Export all models with their relationships configured
// These can now be imported and used throughout the application
// The associations enable efficient database queries with JOIN operations
module.exports = { Poll, Option, Vote, User };
