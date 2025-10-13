const Poll = require("./poll");
const Option = require("./option");
const Vote = require("./vote");
const User = require("./user");

Poll.hasMany(Option, { as: "options" });
Option.belongsTo(Poll);

Option.hasMany(Vote, { as: "votes" });
Vote.belongsTo(Option);

Poll.hasMany(Vote, { as: "votes" });
Vote.belongsTo(Poll);

module.exports = { Poll, Option, Vote, User };
