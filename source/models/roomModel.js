const mongoose = require("mongoose");

const RoomModel = mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
});

module.exports = mongoose.model("RoomModel", RoomModel);
