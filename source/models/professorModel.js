const mongoose = require("mongoose");

const ProfessorModel = mongoose.Schema({
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
	id:{
		type: String,
		require: true,

	},
	email:{
		type: String,
		require: true
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
	status: {
		type: String,
		require: true,
	},
	advisingTime: [{
		day: {
			type: Number,
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
	}],
});

module.exports = mongoose.model("ProfessorModel", ProfessorModel);
