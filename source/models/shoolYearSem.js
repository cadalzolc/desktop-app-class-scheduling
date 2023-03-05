const mongoose = require("mongoose");

const SchoolYearSemester = mongoose.Schema({
	schoolYear: {
		type: String,
		require: true,
	},
	schoolSemester: {
		type: String,
		require: true,
	},
	isCompleted: {
		type: Boolean,
		require: false,
	},
	isActive: {
		type: Boolean,
		require: false,
	},
});

module.exports = mongoose.model("SchoolYearSemester", SchoolYearSemester);
