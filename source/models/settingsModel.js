const mongoose = require("mongoose");

const SettingsModel = mongoose.Schema({
	uid: {
		type: String,
		require: true,
	},
	schoolYear: {
		type: String,
		require: true,
	},
	schoolSemester: {
		// 0 - 1st sem; 1 - 2nd sem; 2 - summer sem;
		type: String,
		require: true,
	},
	systemPassword: {
		type: String,
		require: true,
	},
});

module.exports = mongoose.model("SettingsModel", SettingsModel);
