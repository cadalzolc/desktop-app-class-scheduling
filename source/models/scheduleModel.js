const mongoose = require("mongoose");

const ScheduleModel = mongoose.Schema({
	day: {
		// 0 - Monday
		// 1 - Tuesday
		// 2 - Wednesday
		// 3 - Thurday
		// 4 - Friday
		// 5 - Saturday
		// 6 - Sunday
		type: Number,
		require: true,
	},
	type: {
		// SUBSTITUTE , FULLTIME
		type: String,
		require: true,
	},
	name: {
		type: String,
		require: true,
	},		
	time: {
		start: {
			hours: {
				type: Number,
				require: true,
			},
			minutes: {
				type: String,
				require: true,
			},
		},
		end: {
			hours: {
				type: Number,
				require: true,
			},
			minutes: {
				type: String,
				require: true,
			},
		},
	},
	school: {
		year: {
			type: String,
			require: true,
		},
		semester: {
			type: String,
			require: true,
		},
	},
	courseData: {
		_id: {
			type: String,
			require: true,
		},
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
	},
	professorData: {
		_id: {
			type: String,
			require: true,
		},
		name: {
			first: {
				type: String,
				require: true,
			},
			last: {
				type: String,
				require: true,
			},
		},
		address: {
			type: String,
			require: true,
		},
		employment: {
			status: {
				type: String,
				require: true,
			},
			hours: {
				type: Number,
				require: true,
			},
		},
		gender: {
			type: String,
			require: true,
		},
		contact: {
			type: String,
			require: true,
		},
	},
	programData: {
		_id: {
			type: String,
			require: true,
		},
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
	},
	roomData: {
		_id: {
			type: String,
			require: true,
		},
		name: {
			type: String,
			require: true,
		},
	},
});

module.exports = mongoose.model("ScheduleModel", ScheduleModel);
