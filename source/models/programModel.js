const mongoose = require("mongoose");

const ProgramModel = mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	acronym: {
		type: String,
		require: true,
	},
	year: {
		type: String,
		require: true,
	},
	section: {
		type: String,
		require: true,
	},
});

module.exports = mongoose.model("ProgramModel", ProgramModel);
