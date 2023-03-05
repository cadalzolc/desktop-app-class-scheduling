const mongoose = require("mongoose");

const ScheduleHistory = mongoose.Schema({
	schedule: {
        _id: {
            type: String,
            require: true,
        },
		day: {
            type: Number,
            require: true,
        },
        type: {
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
	},
	stamp: {
		type: Date,
		require: false,
	},
});

module.exports = mongoose.model("ScheduleHistory", ScheduleHistory);


