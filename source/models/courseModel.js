const mongoose = require("mongoose");

const CourseModel = mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	code: {
		type: String,
		require: true,
	},
	units: {
		type: String,
		require: true,
	},
	hours: {
		type: Number,
		require: true,
	},
});

module.exports = mongoose.model("CourseModel", CourseModel);
