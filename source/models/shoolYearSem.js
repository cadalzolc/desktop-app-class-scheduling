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
});

module.exports = mongoose.model("schoolYearSemester", SchoolYearSemester);
