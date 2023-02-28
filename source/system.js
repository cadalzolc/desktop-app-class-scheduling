const mongoose = require("mongoose");
const { ipcMain, dialog } = require("electron");
const path = require("path");
const xl = require("excel4node");

console.log(`system js`);

module.exports = function (win) {
	const CourseModel = require(`${__dirname}/models/courseModel.js`);
	const ProfessorModel = require(`${__dirname}/models/professorModel.js`);
	const ProgramModel = require(`${__dirname}/models/programModel.js`);
	const RoomModel = require(`${__dirname}/models/roomModel.js`);
	const ScheduleModel = require(`${__dirname}/models/scheduleModel.js`);
	const SettingsModel = require(`${__dirname}/models/settingsModel.js`);

	let connectedStatus = false;
	const uri = "mongodb://localhost:27017/dotsystems";
	mongoose.connect(
		uri,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		async (err) => {
			if (err != null) {
				connectedStatus = false;
			} else {
				connectedStatus = true;
				let initialSettingsCheck = await SettingsModel.find({
					uid: "time is gold",
				});
				if (initialSettingsCheck.length == 0) {
					try {
						const newSettingsData = new SettingsModel({
							uid: "time is gold",
							schoolYear: "2018",
							schoolSemester: "0",
							systemPassword: "admin",
						});
						await newSettingsData.save();
					} catch (err) {
						console.log(err);
					}
				}
			}
		}
	);

	// When the window refreshes, the renderer will request for a connection again.
	ipcMain.on("loading-screen", () =>
		win.webContents.send("loading-screen", connectedStatus)
	);

	// Dashboard ipc handler.
	ipcMain.on("retrieve-dashboard-course", () => {
		try {
			CourseModel.count((err, number) => {
				if (err) {
					win.webContents.send("retrieve-dashboard-course", "err");
					throw err;
				} else win.webContents.send("retrieve-dashboard-course", number);
			});
		} catch (err) {
			win.webContents.send("retrieve-dashboard-course", err);
		}
	});
	ipcMain.on("retrieve-dashboard-professor", () => {
		try {
			ProfessorModel.count((err, number) => {
				if (err) {
					win.webContents.send("retrieve-dashboard-professor", "err");
					throw err;
				} else win.webContents.send("retrieve-dashboard-professor", number);
			});
		} catch (err) {
			win.webContents.send("retrieve-dashboard-professor", err);
		}
	});
	ipcMain.on("retrieve-dashboard-room", () => {
		try {
			RoomModel.count((err, number) => {
				if (err) {
					win.webContents.send("retrieve-dashboard-room", "err");
					throw err;
				} else win.webContents.send("retrieve-dashboard-room", number);
			});
		} catch (err) {
			win.webContents.send("retrieve-dashboard-room", err);
		}
	});
	ipcMain.on("retrieve-dashboard-program", () => {
		try {
			ProgramModel.count((err, number) => {
				if (err) {
					win.webContents.send("retrieve-dashboard-program", "err");
					throw err;
				} else win.webContents.send("retrieve-dashboard-program", number);
			});
		} catch (err) {
			win.webContents.send("retrieve-dashboard-program", err);
		}
	});
	ipcMain.on("retrieve-dashboard-subject", async () => {
		try {
			let subjectCount = await ScheduleModel.aggregate([
				{
					$group :
					{
						_id : "$name",
					}
				},
			]);

			// console.log('subject count : ');
			// console.log(subjectCount);

			var number = 0;

			subjectCount.forEach((data) => {
				number++;
			});

			win.webContents.send("retrieve-dashboard-subject", number);
			// .count((err, number) => {
			// 	if (err) {
			// 		win.webContents.send("retrieve-dashboard-subject", "err");
			// 		throw err;
			// 	} else win.webContents.send("retrieve-dashboard-subject", number);
			// });
		} catch (err) {
			win.webContents.send("retrieve-dashboard-subject", err);
		}
	});
	ipcMain.on("retrieve-dashboard-schedule", () => {
		try {
			ScheduleModel.count((err, number) => {
				if (err) {
					win.webContents.send("retrieve-dashboard-schedule", "err");
					throw err;
				} else win.webContents.send("retrieve-dashboard-schedule", number);
			});	
		} catch (err) {
			win.webContents.send("retrieve-dashboard-schedule", err);
		}
	});	

	// Retrieve data for pages.
	ipcMain.on("retrieve-course-data", async (event , search = '') => {
		try {
			let courseData = await CourseModel.find(
				{
					"$expr": {
					  "$regexMatch": {
						"input": { "$concat": ["$name", " ", "$code"] },
						"regex": search,
						"options": "i"
					  }
					}
				}
			).sort({
				name: 1,
				code: 1,
				units: 1,
				hours: 1,
			});
			win.webContents.send(
				"retrieve-course-data",
				JSON.parse(JSON.stringify(courseData))
			);
		} catch (err) {
			win.webContents.send("retrieve-course-data", err);
		}
	});
	ipcMain.on("retrieve-room-data", async (event , search = '') => {
		try {
			let roomData = await RoomModel.find(
				{
					"$expr": {
					  "$regexMatch": {
						"input": { "$concat": ["$name"] },
						"regex": search,
						"options": "i"
					  }
					}
				}						
			).sort({
				name: 1,
			});
			win.webContents.send(
				"retrieve-room-data",
				JSON.parse(JSON.stringify(roomData))
			);
		} catch (err) {
			win.webContents.send("retrieve-room-data", err);
		}
	});

	ipcMain.on("retrieve-professor-data", async (event , search = '') => {
		try {
			// let ScheduleData = await ScheduleModel.find({
			// 	"professorData._id": professorId,
			// }).sort({
			// 	"courseData.name": course_order,
			// 	day: 1,
			// 	"time.start.hours": 1,
			// 	"time.start.minutes": 1,
			// });

			let ProfessorData = await ProfessorModel.find(
				{
					"$expr": {
					  "$regexMatch": {
						"input": { "$concat": ["$name.first", " ", "$name.last"] },
						"regex": search,
						"options": "i"
					  }
					}
				}				
			).sort({
				"name.first": -1,
				// "name.last": 1,
			});
			win.webContents.send(
				"retrieve-professor-data",
				JSON.parse(JSON.stringify(ProfessorData))
			);
		} catch (err) {
			win.webContents.send("retrieve-professor-data", err);
		}
	});

	ipcMain.on("retrieve-professor-data-advisetime", async (event , professorId) => {
		try {
			let ProfessorData = await ProfessorModel.find({
				"_id": professorId,
			}).sort({
				"name.first": -1,
				// "name.last": 1,
			});
			win.webContents.send(
				"retrieve-professor-data",
				JSON.parse(JSON.stringify(ProfessorData))
			);
		} catch (err) {
			win.webContents.send("retrieve-professor-data", err);
		}
	});

	ipcMain.on("retrieve-program-data", async (event , search = '') => {
		try {
			let ProgramData = await ProgramModel.find(
				{
					"$expr": {
					  "$regexMatch": {
						"input": { "$concat": ["$name", " ", "$acronym" , " ", "$section"] },
						"regex": search,
						"options": "i"
					  }
					}
				}				
			).sort({
				name: 1,
				acronym: 1,
				year: 1,
				section: 1,
			});
			win.webContents.send(
				"retrieve-program-data",
				JSON.parse(JSON.stringify(ProgramData))
			);
		} catch (err) {
			win.webContents.send("retrieve-program-data", err);
		}
	});
	ipcMain.on("retrieve-settings-data", async () => {
		try {
			let SettingsData = await SettingsModel.find();
			win.webContents.send(
				"retrieve-settings-data",
				JSON.parse(JSON.stringify(SettingsData))
			);
		} catch (err) {
			win.webContents.send("retrieve-settings-data", err);
		}
	});	

	ipcMain.on("retrieve-subject-data", async (event, search = '') => {
		console.log('retrieve-subject-data search : ' + search);
		try {
			let ScheduleData = await ScheduleModel
			.aggregate([
				{ "$match" : { "name" : { "$regex": search, "$options": "i" } } },
				{
					$group :
					{
						_id : "$name",
						name : { $first: '$name' },
					},			
					// $sort:{ name: 1, }
				},
				{
					$sort:{name: 1, }
				}
				// {
				// 	"$expr": {
				// 		"$regexMatch": {
				// 		// "input": { "$concat": ["$name.first", " ", "$name.last"] },
				// 		"input": { "$concat": ["$name"] },
				// 		"regex": search,
				// 		"options": "i"
				// 		}
				// 	}
				// }
			]);
			// .find(
			// 	{
			// 		"$expr": {
			// 		  "$regexMatch": {
			// 			// "input": { "$concat": ["$name.first", " ", "$name.last"] },
			// 			"input": { "$concat": ["$name"] },
			// 			"regex": search,
			// 			"options": "i"
			// 		  }
			// 		}
			// 	}
			// )
			// .sort({
			// 	name: 1,
			// });
			// console.log("passed here");
			console.log(JSON.parse(JSON.stringify(ScheduleData)));
			win.webContents.send(
				"retrieve-subject-data",
				JSON.parse(JSON.stringify(ScheduleData))
			);
		} catch (err) {
			console.log(err);
			win.webContents.send("retrieve-subject-data", err);
		}
	});

	ipcMain.on("retrieve-schedule-data", async (event, course_order = 0 , search = '') => {
		console.log('retrieve-schedule-data search : ' + search);
		try {
			let ScheduleData = await ScheduleModel.find(
				{
					"$expr": {
					  "$regexMatch": {
						// "input": { "$concat": ["$name.first", " ", "$name.last"] },
						"input": { "$concat": ["$name" , " ", "$courseData.name" , " ", "$courseData.code" , " ", "$professorData.name.first" , " ", "$professorData.name.last" , " ", "$roomData.name" , " ", "$programData.acronym"] },
						"regex": search,
						"options": "i"
					  }
					}
				}					
			).sort({
				"courseData.name": course_order,
				day: 1,
				"time.start.hours": 1,
				"time.start.minutes": 1,
			});
			// console.log("passed here");
			// console.log(JSON.parse(JSON.stringify(ScheduleData)));
			win.webContents.send(
				"retrieve-schedule-data",
				JSON.parse(JSON.stringify(ScheduleData))
			);
		} catch (err) {
			console.log(err);
			win.webContents.send("retrieve-schedule-data", err);
		}
	});

	ipcMain.on("retrieve-schedule-professor-data", async (event, professorId , course_order = 0) => {
		console.log("Entered");
		console.log(professorId);
		console.log("Course Order : " + course_order);
		try {
			let ScheduleData = await ScheduleModel.find({
				"professorData._id": professorId,
			}).sort({
				"courseData.name": course_order,
				day: 1,
				"time.start.hours": 1,
				"time.start.minutes": 1,
			});
			// console.log("passed here");
			// console.log(JSON.parse(JSON.stringify(ScheduleData)));
			win.webContents.send(
				"retrieve-schedule-professor-data",
				JSON.parse(JSON.stringify(ScheduleData))
			);
		} catch (err) {
			console.log(err);
			win.webContents.send("retrieve-schedule-professor-data", err);
		}
	});
	ipcMain.on("retrieve-schedule-program-data", async (event, programId) => {
		console.log("Entered");
		console.log(programId);
		try {
			let ScheduleData = await ScheduleModel.find({
				"programData._id": programId,
			}).sort({
				day: 1,
				"time.start.hours": 1,
				"time.start.minutes": 1,
			});
			// console.log("passed here");
			console.log(JSON.parse(JSON.stringify(ScheduleData)));
			win.webContents.send(
				"retrieve-schedule-program-data",
				JSON.parse(JSON.stringify(ScheduleData))
			);
		} catch (err) {
			win.webContents.send("retrieve-schedule-program-data", err);
		}
	});
	ipcMain.on("retrieve-schedule-room-data", async (event, roomId) => {
		console.log("Entered");
		console.log(roomId);
		try {
			let ScheduleData = await ScheduleModel.find({
				"roomData._id": roomId,
			}).sort({
				day: 1,
				"time.start.hours": 1,
				"time.start.minutes": 1,
			});
			// console.log("passed here");
			console.log(JSON.parse(JSON.stringify(ScheduleData)));
			win.webContents.send(
				"retrieve-schedule-room-data",
				JSON.parse(JSON.stringify(ScheduleData))
			);
		} catch (err) {
			win.webContents.send("retrieve-schedule-room-data", err);
		}
	});

	ipcMain.on("save-data-course", async (event, courseData) => {
		try {
			let courseNameExist = await CourseModel.find({
				name: courseData.name,
			});
			if (courseNameExist.length >= 1) throw "Course name already exist.";

			let courseCodeExist = await CourseModel.find({
				code: courseData.code,
			});
			if (courseCodeExist.length >= 1) throw "Course code already exist.";

			const newCourseData = new CourseModel({
				name: courseData.name,
				code: courseData.code,
				units: courseData.units,
				hours: courseData.hours,
			});
			await newCourseData.save();
			win.webContents.send("save-data-course", {
				success: true,
				message: "Added successfully.",
			});
		} catch (err) {
			win.webContents.send("save-data-course", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("save-data-room", async (event, roomData) => {
		try {
			let roomNameExist = await RoomModel.find({
				name: roomData.name,
			});
			if (roomNameExist.length >= 1) throw "Room already exist.";

			const newRoomData = new RoomModel({
				name: roomData.name,
			});
			await newRoomData.save();
			win.webContents.send("save-data-room", {
				success: true,
				message: "Added successfully.",
			});
		} catch (err) {
			win.webContents.send("save-data-room", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("save-data-professor", async (event, professorData) => {
		try {
			console.log('Faculty ID :' + professorData.id);
			console.log('Email ID :' + professorData.email);

			let professorExist = await ProfessorModel.find({
				id: professorData.id,
			});
			if (professorExist.length >= 1) throw "Professor already exist.";

			const newProfessorData = new ProfessorModel({
				name: {
					first: professorData.name.first,
					last: professorData.name.last,
				},
				email: professorData.email,
				id: professorData.id,
				address: professorData.address,
				employment: {
					status: professorData.employment.status,
					hours: professorData.employment.hours,
				},
				gender: professorData.gender,
				contact: professorData.contact,
				status: professorData.status,

			});
			await newProfessorData.save();
			win.webContents.send("save-data-professor", {
				success: true,
				message: "Added successfully.",
			});
		} catch (err) {
			win.webContents.send("save-data-professor", {
				success: false,
				message: err,
			});
		}
	});

	ipcMain.on("save-data-program", async (event, programData) => {
		try {
			let programExist = await ProgramModel.find({
				name: programData.name,
				year: programData.year,
				section: programData.section,
			});
			if (programExist.length >= 1) throw "Program already exist.";

			const newProgramData = new ProgramModel({
				name: programData.name,
				acronym: programData.acronym,
				year: programData.year,
				section: programData.section,
			});
			await newProgramData.save();
			win.webContents.send("save-data-program", {
				success: true,
				message: "Added successfully",
			});
		} catch (err) {
			win.webContents.send("save-data-program", {
				success: false,
				message: err,
			});
		}
	});

	// ipcMain.on("delete-advisetime", async (event, selectedData) => {
	// 	try {
	// 		let professorData = await ProfessorModel.find({
	// 			"_id": selectedData,
	// 		});

	// 		win.webContents.send("delete-advisetime", {
	// 			success: true,
	// 			message: "Deleted Successfully.",
	// 		});
	// 	} catch (err) {
	// 		win.webContents.send("delete-advisetime", {
	// 			success: false,
	// 			message: err,
	// 		});
	// 	}
	// });

	// ipcMain.on("save-data-professor-advisetime", async (event, scheduleData = {} , type = 'add') => {
	ipcMain.on("save-data-professor-advisetime", async (event, scheduleData , type = 'add') => {
		try {
			type = scheduleData.type;
			console.log('save-data-professor-advisetime :' + type);
			// console.log('save-data-professor-advisetime : ' + type);			

			console.log('scheduleData');
			console.log(scheduleData);
			
			if(type !== 'delete')
			{
				if (
					parseInt(
						`${scheduleData.time.start.hours}${scheduleData.time.start.minutes}`
					) < 730
				)
					throw "Time must start at 7:30 AM.";
	
				if (
					parseInt(
						`${scheduleData.time.start.hours}${scheduleData.time.start.minutes}`
					) > 2100
				)
					throw "Time must start at 7:30 AM.";
	
				if (
					parseInt(
						`${scheduleData.time.end.hours}${scheduleData.time.end.minutes}`
					) < 730
				)
					throw "Time must end at 9:00 PM.";
	
				if (
					parseInt(
						`${scheduleData.time.end.hours}${scheduleData.time.end.minutes}`
					) > 2100
				)
					throw "Time must end at 9:00 PM.";
			}

			var type_message = 'Added';
			let professorData = await ProfessorModel.find({
				"_id": scheduleData._id,
			});

		 	if(type == 'delete') type_message = 'Deleted';

			console.log('professorDataGathered');
			var professorDataGathered = professorData[0];
			// console.log(professorDataGathered);

			// const existing_schedules = professorDataGathered.advisingTime.schedules;
			const existing_schedules = professorDataGathered.advisingTime;
			console.log('existing_schedules');
			console.log(existing_schedules);

			var schedule_exist = false;

			existing_schedules.forEach((exist_schedule) => {
				if(exist_schedule.day == scheduleData.day) schedule_exist = true;
			});

			if(schedule_exist == false && type == 'add')
			{
				console.log('push to existing_schedules');

				existing_schedules.push({
					day: scheduleData.day,
					time: {
						start: {
							hours: scheduleData.time.start.hours,
							minutes: scheduleData.time.start.minutes,
						},
						end: {
							hours: scheduleData.time.end.hours,
							minutes: scheduleData.time.end.minutes,
						},
					},
				},);
			}					
			else if(type == 'delete')
			{
				console.log('delete existing_schedules : ' + scheduleData.day);

				for (var i = existing_schedules.length - 1; i >= 0; --i) {
					if (existing_schedules[i].day == scheduleData.day) {
						existing_schedules.splice(i,1);
					}
				}

				console.log('delete existing_schedules end');
			}
			else
			{
				throw "Scheduled day already exist";
				type = 'error';
			}

			console.log("existing_schedules");
			console.log(existing_schedules);

			existing_schedules.sort(function(a, b) {
				return parseInt(a.day) - parseInt(b.day);
			});

			await ProfessorModel.updateOne(
				{ _id: scheduleData._id },
				{
					$set: {
						"advisingTime": existing_schedules,
					},
				}
			);

			win.webContents.send("save-data-professor-advisetime", {
				success: true,
				message: type_message + " successfully.",
				data : JSON.parse(JSON.stringify(existing_schedules)),
			});
		} catch (err) {
			console.log();

			win.webContents.send("save-data-professor-advisetime", {
				success: false,
				message: err,
			});
		}
	});

	ipcMain.on("save-data-schedule", async (event, scheduleData) => {
		// console.log(scheduleData);

		try {
			if (
				parseInt(
					`${scheduleData.time.start.hours}${scheduleData.time.start.minutes}`
				) < 730
			)
				throw "Time must start at 7:30 AM.";

			if (
				parseInt(
					`${scheduleData.time.start.hours}${scheduleData.time.start.minutes}`
				) > 2100
			)
				throw "Time must start at 7:30 AM.";

			if (
				parseInt(
					`${scheduleData.time.end.hours}${scheduleData.time.end.minutes}`
				) < 730
			)
				throw "Time must end at 9:00 PM.";

			if (
				parseInt(
					`${scheduleData.time.end.hours}${scheduleData.time.end.minutes}`
				) > 2100
			)
				throw "Time must end at 9:00 PM.";

			console.log(scheduleData.professorData._id);
			let scheduleDataGathered = await ScheduleModel.find({
				"professorData._id": scheduleData.professorData._id,
			});
			console.log("Line: 284");
			console.log(scheduleDataGathered);
			console.log("Line: 286");

			let scheduleDataHours = scheduleData.courseData.hours;
			scheduleDataGathered.forEach((schedule) => {
				scheduleDataHours += parseInt(schedule.courseData.hours);
			});
			console.log(
				"Declared Hours: ",
				scheduleData.professorData.employment.hours
			);
			console.log("Hours Consumed: ", scheduleDataHours);
			if (scheduleData.professorData.employment.hours < scheduleDataHours)
				throw "Professor has no remaining hours.";
			console.log(
				"Sanity Check: ",
				scheduleData.professorData.employment.hours < scheduleDataHours
			);

			scheduleDataGathered = await ScheduleModel.find({
				"roomData._id": scheduleData.roomData._id,
				day: scheduleData.day,
				type: scheduleData.type,
			});
			let scheduleDataGatheredRoomSanityArray = [];
			scheduleDataGathered.forEach((schedule) => {
				let s1 = parseInt(
					`${scheduleData.time.start.hours}${scheduleData.time.start.minutes}`
				);
				let e1 = parseInt(
					`${scheduleData.time.end.hours}${scheduleData.time.end.minutes}`
				);
				let s2 = parseInt(
					`${schedule.time.start.hours}${schedule.time.start.minutes}`
				);
				let e2 = parseInt(
					`${schedule.time.end.hours}${schedule.time.end.minutes}`
				);

				console.log("Starting Room Check...");
				console.log("s1 >= e2: ", s1 >= e2);
				console.log("s1 > s2: ", s1 > s2);
				console.log("s1 >= e2 && s1 > s2: ", s1 >= e2 && s1 > s2);
				console.log("e1 <= s2:", e1 <= s2);
				console.log("e1 < e2:", e1 < e2);
				console.log("e1 <= s2 && e1 < e2", e1 <= s2 && e1 < e2);

				console.log("-------------------------------------------");

				console.log(
					"(s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2):",
					(s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2)
				);

				console.log("-------------------------------------------");

				if ((s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2)) {
					scheduleDataGatheredRoomSanityArray.push(true);
				} else scheduleDataGatheredRoomSanityArray.push(false);
			});
			let roomSanity = true;
			scheduleDataGatheredRoomSanityArray.forEach((sanity, i) => {
				console.log(`${i}: ${sanity}`);
				if (sanity == false) {
					roomSanity = false;
				}
			});
			if (!roomSanity) throw "Selected room is used around that time.";

			console.log("Continuing to programData...");

			scheduleDataGathered = await ScheduleModel.find({
				"programData._id": scheduleData.programData._id,
				day: scheduleData.day,
			});
			let scheduleDataGatheredProgramSanityArray = [];
			scheduleDataGathered.forEach((schedule) => {
				let s1 = parseInt(
					`${scheduleData.time.start.hours}${scheduleData.time.start.minutes}`
				);
				let e1 = parseInt(
					`${scheduleData.time.end.hours}${scheduleData.time.end.minutes}`
				);
				let s2 = parseInt(
					`${schedule.time.start.hours}${schedule.time.start.minutes}`
				);
				let e2 = parseInt(
					`${schedule.time.end.hours}${schedule.time.end.minutes}`
				);

				console.log("Starting Room Check...");
				console.log("s1 >= e2: ", s1 >= e2);
				console.log("s1 > s2: ", s1 > s2);
				console.log("s1 >= e2 && s1 > s2: ", s1 >= e2 && s1 > s2);
				console.log("e1 <= s2:", e1 <= s2);
				console.log("e1 < e2:", e1 < e2);
				console.log("e1 <= s2 && e1 < e2", e1 <= s2 && e1 < e2);

				console.log("-------------------------------------------");

				console.log(
					"(s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2):",
					(s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2)
				);

				console.log("-------------------------------------------");

				if ((s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2)) {
					scheduleDataGatheredProgramSanityArray.push(true);
				} else scheduleDataGatheredProgramSanityArray.push(false);
			});
			let programSanity = true;
			scheduleDataGatheredProgramSanityArray.forEach((sanity, i) => {
				console.log(`${i}: ${sanity}`);
				if (sanity == false) {
					programSanity = false;
				}
			});
			if (!programSanity) throw "Selected program is busy around that time.";

			console.log("Continuing to professorData...");

			scheduleDataGathered = await ScheduleModel.find({
				"professorData._id": scheduleData.professorData._id,
				day: scheduleData.day,
			});
			let scheduleDataGatheredProfessorSanityArray = [];
			scheduleDataGathered.forEach((schedule) => {
				let s1 = parseInt(
					`${scheduleData.time.start.hours}${scheduleData.time.start.minutes}`
				);
				let e1 = parseInt(
					`${scheduleData.time.end.hours}${scheduleData.time.end.minutes}`
				);
				let s2 = parseInt(
					`${schedule.time.start.hours}${schedule.time.start.minutes}`
				);
				let e2 = parseInt(
					`${schedule.time.end.hours}${schedule.time.end.minutes}`
				);

				console.log("Starting Room Check...");
				console.log("s1 >= e2: ", s1 >= e2);
				console.log("s1 > s2: ", s1 > s2);
				console.log("s1 >= e2 && s1 > s2: ", s1 >= e2 && s1 > s2);
				console.log("e1 <= s2:", e1 <= s2);
				console.log("e1 < e2:", e1 < e2);
				console.log("e1 <= s2 && e1 < e2", e1 <= s2 && e1 < e2);

				console.log("-------------------------------------------");

				console.log(
					"(s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2):",
					(s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2)
				);

				console.log("-------------------------------------------");

				if ((s1 >= e2 && s1 > s2) || (e1 <= s2 && e1 < e2)) {
					scheduleDataGatheredProfessorSanityArray.push(true);
				} else scheduleDataGatheredProfessorSanityArray.push(false);
			});
			let professorSanity = true;
			scheduleDataGatheredProfessorSanityArray.forEach((sanity, i) => {
				console.log(`${i}: ${sanity}`);
				if (sanity == false) {
					professorSanity = false;
				}
			});
			if (!professorSanity) throw "Professor is busy around that time.";

			const newScheduleData = new ScheduleModel({
				day: scheduleData.day,
				name: scheduleData.name,
				type: scheduleData.type,
				time: {
					start: {
						hours: scheduleData.time.start.hours,
						minutes: scheduleData.time.start.minutes,
					},
					end: {
						hours: scheduleData.time.end.hours,
						minutes: scheduleData.time.end.minutes,
					},
				},
				school: {
					year: scheduleData.school.year,
					semester: scheduleData.school.semester,
				},
				courseData: {
					_id: scheduleData.courseData._id,
					name: scheduleData.courseData.name,
					code: scheduleData.courseData.code,
					units: scheduleData.courseData.units,
					hours: scheduleData.courseData.hours,
				},
				professorData: {
					_id: scheduleData.professorData._id,
					name: {
						first: scheduleData.professorData.name.first,
						last: scheduleData.professorData.name.last,
					},
					address: scheduleData.professorData.address,
					employment: {
						status: scheduleData.professorData.employment.status,
						hours: scheduleData.professorData.employment.hours,
					},
					gender: scheduleData.professorData.gender,
					contact: scheduleData.professorData.contact,
				},
				programData: {
					_id: scheduleData.programData._id,
					name: scheduleData.programData.name,
					acronym: scheduleData.programData.acronym,
					year: scheduleData.programData.year,
					section: scheduleData.programData.section,
				},
				roomData: {
					_id: scheduleData.roomData._id,
					name: scheduleData.roomData.name,
				},
			});
			await newScheduleData.save();
			win.webContents.send("save-data-schedule", {
				success: true,
				message: "Added successfully.",
			});
		} catch (err) {
			console.log(err);
			win.webContents.send("save-data-schedule", {
				success: false,
				message: err,
			});
		}
	});

	ipcMain.on("edit-data-course", async (event, courseData, selectedData) => {
		console.log(courseData, selectedData);
		try {
			let courseNameExist = await CourseModel.find({
				name: courseData.name,
			});
			if (courseNameExist.length >= 1) {
				if (courseData.name != selectedData.name) {
					throw "Course name already exist.";
				}
			}

			let courseCodeExist = await CourseModel.find({
				code: courseData.code,
			});
			if (courseCodeExist.length >= 1) {
				if (courseData.code != selectedData.code) {
					throw "Course code already exist.";
				}
			}

			await CourseModel.updateOne(
				{ _id: courseData._id },
				{
					$set: {
						name: courseData.name,
						code: courseData.code,
						units: courseData.units,
						hours: courseData.hours,
					},
				}
			);

			await ScheduleModel.updateMany(
				{ "courseData._id": courseData._id },
				{
					$set: {
						"courseData.name": courseData.name,
						"courseData.code": courseData.code,
						"courseData.units": courseData.units,
						"courseData.hours": courseData.hours,
					},
				}
			);

			win.webContents.send("edit-data-course", {
				success: true,
				message: "Edit successfully.",
			});
		} catch (err) {
			win.webContents.send("edit-data-course", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("edit-data-room", async (event, roomData, selectedData) => {
		try {
			let roomNameExist = await RoomModel.find({
				name: roomData.name,
			});
			if (roomNameExist.length >= 1) {
				if (roomData.name != selectedData.name) {
					throw "Room already exist.";
				}
			}

			await RoomModel.updateOne(
				{ _id: roomData._id },
				{
					$set: {
						name: roomData.name,
					},
				}
			);

			await ScheduleModel.updateMany(
				{ "roomData._id": roomData._id },
				{
					$set: {
						"roomData.name": roomData.name,
					},
				}
			);

			win.webContents.send("edit-data-room", {
				success: true,
				message: "Edit successfully.",
			});
		} catch (err) {
			console.log(err);
			win.webContents.send("edit-data-room", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on(
		"edit-data-professor",
		async (event, professorData, selectedData) => {
			try {
				await ProfessorModel.updateOne(
					{ _id: professorData._id },
					{
						$set: {
							"name.first": professorData.name.first,
							"name.last": professorData.name.last,
							address: professorData.address,
							"employment.status": professorData.employment.status,
							"employment.hours": professorData.employment.hours,
							gender: professorData.gender,
							contact: professorData.contact,
							status: professorData.status,
						},
					}
				);

				await ScheduleModel.updateMany(
					{ "professorData._id": professorData._id },
					{
						$set: {
							"professorData.name.first": professorData.name.first,
							"professorData.name.last": professorData.name.last,
							"professorData.address": professorData.address,
							"professorData.employment.status":
								professorData.employment.status,
							"professorData.employment.hours": professorData.employment.hours,
							"professorData.gender": professorData.gender,
							"professorData.contact": professorData.contact,
							"professorData.status": professorData.status,
						},
					}
				);

				win.webContents.send("edit-data-professor", {
					success: true,
					message: "Edit successfully.",
				});
			} catch (err) {
				win.webContents.send("edit-data-professor", {
					success: false,
					message: err,
				});
			}
		}
	);
	ipcMain.on("edit-data-program", async (event, programData, selectedData) => {
		try {
			let programExist = await ProgramModel.find({
				name: programData.name,
				year: programData.year,
				section: programData.section,
			});
			if (programExist.length >= 1) {
				if (
					programData.name != selectedData.name ||
					programData.year != selectedData.year ||
					programData.section != selectedData.section
				) {
					throw "Program already exist.";
				}
			}

			await ProgramModel.updateOne(
				{ _id: programData._id },
				{
					$set: {
						name: programData.name,
						acronym: programData.acronym,
						year: programData.year,
						section: programData.section,
					},
				}
			);

			await ScheduleModel.updateMany(
				{ "programData._id": programData._id },
				{
					$set: {
						"programData.name": programData.name,
						"programData.acronym": programData.acronym,
						"programData.year": programData.year,
						"programData.section": programData.section,
					},
				}
			);

			win.webContents.send("edit-data-program", {
				success: true,
				message: "Edit successfully.",
			});
		} catch (err) {
			win.webContents.send("edit-data-program", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("edit-data-settings", async (event, settingsData) => {
		try {
			await SettingsModel.updateOne(
				{ uid: "time is gold" },
				{
					$set: {
						schoolYear: settingsData.schoolYear,
						schoolSemester: settingsData.schoolSemester,
					},
				}
			);

			win.webContents.send("edit-data-settings", {
				success: true,
				message: "Edit successfully.",
			});
		} catch (err) {
			win.webContents.send("edit-data-settings", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("edit-data-password", async (event, settingsData) => {
		try {
			if (settingsData.systemPassword != settingsData.oldSystemPassword) {
				throw "Old password did not match.";
			}
			if (
				settingsData.newSystemPassword != settingsData.confirmNewSystemPassword
			) {
				throw "Your new password did not match.";
			}
			if (settingsData.newSystemPassword.length < 8) {
				throw "Password must be 8 characters long.";
			}

			await SettingsModel.updateOne(
				{ uid: "time is gold" },
				{
					$set: {
						systemPassword: settingsData.newSystemPassword,
					},
				}
			);

			win.webContents.send("edit-data-password", {
				success: true,
				message: "Password saved successfully.",
			});
		} catch (err) {
			win.webContents.send("edit-data-password", {
				success: false,
				message: err,
			});
		}
	});

	ipcMain.on("delete-schedule-data", async (event, tbdData) => {
		try {
			await ScheduleModel.deleteOne({
				_id: tbdData,
			});
			console.log("Testing");
			win.webContents.send("delete-schedule-data", {
				success: true,
				message: "Deleted Successfully.",
			});
		} catch (err) {
			console.log(err);
			win.webContents.send("delete-schedule-data", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("delete-professor-data", async (event, selectedData) => {
		try {
			await ScheduleModel.deleteMany({
				"professorData._id": selectedData,
			});
			await ProfessorModel.deleteOne({
				_id: selectedData,
			});
			win.webContents.send("delete-professor-data", {
				success: true,
				message: "Deleted Successfully.",
			});
		} catch (err) {
			win.webContents.send("delete-professor-data", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("delete-program-data", async (event, selectedData) => {
		try {
			await ScheduleModel.deleteMany({
				"programData._id": selectedData,
			});
			await ProgramModel.deleteOne({
				_id: selectedData,
			});
			win.webContents.send("delete-program-data", {
				success: true,
				message: "Deleted Successfully.",
			});
		} catch (err) {
			win.webContents.send("delete-program-data", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("delete-room-data", async (event, selectedData) => {
		try {
			await ScheduleModel.deleteMany({
				"roomData._id": selectedData,
			});
			await RoomModel.deleteOne({
				_id: selectedData,
			});
			win.webContents.send("delete-room-data", {
				success: true,
				message: "Deleted Successfully.",
			});
		} catch (err) {
			win.webContents.send("delete-room-data", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("delete-course-data", async (event, selectedData) => {
		try {
			await ScheduleModel.deleteMany({
				"courseData._id": selectedData,
			});
			await CourseModel.deleteOne({
				_id: selectedData,
			});
			win.webContents.send("delete-course-data", {
				success: true,
				message: "Deleted Successfully.",
			});
		} catch (err) {
			win.webContents.send("delete-course-data", {
				success: false,
				message: err,
			});
		}
	});

	ipcMain.on("login-validate", async (event, password) => {
		try {
			let passwordExist = await SettingsModel.find({
				systemPassword: password,
			});
			if (passwordExist.length <= 0) throw "Wrong password";

			win.webContents.send("login-validate", {
				success: true,
				message: "Logging in...",
			});
		} catch (err) {
			win.webContents.send("login-validate", {
				success: false,
				message: err,
			});
		}
	});
	ipcMain.on("login-reset", async (event) => {
		try {
			await SettingsModel.updateOne(
				{
					uid: "time is gold",
				},
				{
					$set: {
						systemPassword: "admin",
					},
				}
			);

			await CourseModel.remove({});
			await ProfessorModel.remove({});
			await ProgramModel.remove({});
			await RoomModel.remove({});
			await ScheduleModel.remove({});

			win.webContents.send("login-reset", {
				success: true,
				message: "Your password has been changed to: admin",
			});
		} catch (err) {
			win.webContents.send("login-reset", {
				success: false,
				message: err,
			});
		}
	});

	ipcMain.on("export-to-excel", async (event, selectedData) => {
		console.log(selectedData);
		let savePathSelected = await dialog.showSaveDialog({
			filters: [{ name: "Excel file", extensions: ["xlsx"] }],
		});
		console.log(savePathSelected);
		console.log(path.extname(savePathSelected.filePath));
		console.log(path.parse(savePathSelected.filePath));

		if (!savePathSelected.canceled) {
			let scheduleData = await ScheduleModel.find({
				"professorData._id": selectedData._id,
			});

			// console.log(scheduleData);

			let option = {
				margins: {
					left: 1.5,
					right: 1.5,
				},
				sheetFormat: {
					baseColWidth: 12,
					defaultRowHeight: 22,
				},
			};

			let SettingsData = await SettingsModel.find();

			var prof_name = `${selectedData.name.last}, ${selectedData.name.first}`;
			var school_year = `(${SettingsData[0].schoolYear} - ${parseInt(SettingsData[0].schoolYear) + 1} - ${ SettingsData[0].schoolSemester == 0 ? "1st Sem" : SettingsData[0].schoolSemester == 1 ? "2nd Sem" : "Summer" })`
			var header_name = prof_name + ` ` + school_year;

			console.log(SettingsData[0]);
			console.log(header_name);

			let wb = new xl.Workbook();
			let ws = wb.addWorksheet(
				prof_name,
				option
			);

			let full = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#ffffff",
					fgColor: "#ffffff",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});
			let TS = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#ffff00",
					fgColor: "#ffff00",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});

			let part = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#ff9248",
					fgColor: "#ff9248",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});
			let Sub = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#ff9248",
					fgColor: "#ff9248",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});

			let Advise = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#A2BAF5",
					fgColor: "#A2BAF5",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});

			let header = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#C2D59A",
					fgColor: "#C2D59A",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});

			ws.cell(1, 1, 1, 8, true).string(
				header_name
			);

			ws.cell(2, 1).style(header);
			ws.cell(3, 1, 5, 1, true).style(header).string("7:30AM - 9:00AM");
			ws.cell(6, 1, 8, 1, true).style(header).string("9:00AM - 10:30AM");
			ws.cell(9, 1, 11, 1, true).style(header).string("10:30AM - 12:00PM");
			ws.cell(12, 1, 14, 1, true).style(header).string("12:00PM - 1:30PM");
			ws.cell(15, 1, 17, 1, true).style(header).string("1:30PM - 3:00PM");
			ws.cell(18, 1, 20, 1, true).style(header).string("3:00PM - 4:30PM");
			ws.cell(21, 1, 23, 1, true).style(header).string("4:30PM - 6:00PM");
			ws.cell(24, 1, 26, 1, true).style(header).string("6:00PM - 7:30PM");
			ws.cell(27, 1, 29, 1, true).style(header).string("7:30PM - 9:00PM");
			ws.cell()

			ws.cell(2, 2).style(header).string("Monday");
			ws.cell(2, 3).style(header).string("Tuesday");
			ws.cell(2, 4).style(header).string("Wednesday");
			ws.cell(2, 5).style(header).string("Thursday");
			ws.cell(2, 6).style(header).string("Friday");
			ws.cell(2, 7).style(header).string("Saturday");
			ws.cell(2, 8).style(header).string("Sunday");

			ws.cell(3, 11).style(header).string("Legend");
			ws.cell(3, 12).style(full).string("Full-Time");
			ws.cell(4, 12).style(Advise).string("Advise Time")
			ws.cell(3, 13).style(part).string("Part-Time");
			ws.cell(4, 13).style(Sub).string("Substitute");
			ws.cell(3, 14).style(TS).string("Temporary");
			ws.cell(4, 14).style(TS).string("Substitute");

			for (let i = 2; i <= 8; i++) {
				for (let j = 3; j <= 29; j++) {
					ws.cell(j, i).style({
						border: {
							left: {
								style: "thin",
								color: "#000000",
							},
							right: {
								style: "thin",
								color: "#000000",
							},
							top: {
								style: "thin",
								color: "#000000",
							},
							bottom: {
								style: "thin",
								color: "#000000",
							},
						},
					});
				}
			}

			let mondayLoad = 0;
			let tuesdayLoad = 0;
			let wednesdayLoad = 0;
			let thursdayLoad = 0;
			let fridayLoad = 0;
			let saturdayLoad = 0;
			let sundayLoad = 0;

			// prof with advising time
			var schedules = selectedData.advisingTime;
			var employment = selectedData.employment.status;
			if(employment == 'Full-Time'){
				let scheduleTimeHourStart, scheduleTimeMinuteStart, scheduleTimePostfixStart, scheduleTimeHourEnd, scheduleTimeMinuteEnd, scheduleTimePostfixEnd;

				schedules.forEach((schedule) => {
					let schedule_color = {
						type: "pattern",
						patternType: "solid",
						bgColor: "#A2BAF5",
						fgColor: "#A2BAF5",
					};

					// if(schedule.time == 'Advise Time')
					// {
					// 	schedule_color = {
					// 		type: "pattern",
					// 		patternType: "solid",
					// 		bgColor: "#A2BAF5",
					// 		fgColor: "#A2BAF5",
					// 	};
					// };

					console.log('Advise Day : ' + schedule.day);
					console.log('Advise Time : ' + schedule.time);
					
					let scheduleStyle = {
						font: {
							size: 11,
						},
						alignment: {
							horizontal: ["center"],
							vertical: ["center"],
							wrapText: true,
							bold: true,
						},
						fill: schedule_color				
					};

					let x1 = schedule.day + 2;
					let x2 = schedule.day + 2;
					let y1, y2;					

					switch (
						parseInt(`${schedule.time.start.hours}${schedule.time.start.minutes}`)
					) {
						case 730:
							y1 = 3;
							break;
						case 800:
							y1 = 4;
							break;
						case 830:
							y1 = 5;
							break;
						case 900:
							y1 = 6;
							break;
						case 930:
							y1 = 7;
							break;
						case 1000:
							y1 = 8;
							break;
						case 1030:
							y1 = 9;
							break;
						case 1100:
							y1 = 10;
							break;
						case 1130:
							y1 = 11;
							break;
						case 1200:
							y1 = 12;
							break;
						case 1230:
							y1 = 13;
							break;
						case 1300:
							y1 = 14;
							break;
						case 1330:
							y1 = 15;
							break;
						case 1400:
							y1 = 16;
							break;
						case 1430:
							y1 = 17;
							break;
						case 1500:
							y1 = 18;
							break;
						case 1530:
							y1 = 19;
							break;
						case 1600:
							y1 = 20;
							break;
						case 1630:
							y1 = 21;
							break;
						case 1700:
							y1 = 22;
							break;
						case 1730:
							y1 = 23;
							break;
						case 1800:
							y1 = 24;
							break;
						case 1830:
							y1 = 25;
							break;
						case 1900:
							y1 = 26;
							break;
						case 1930:
							y1 = 27;
							break;
						case 2000:
							y1 = 28;
							break;
						case 2030:
							y1 = 29;
							break;
						default:
							y1 = 29;
							break;
					}
					switch (
						parseInt(`${schedule.time.end.hours}${schedule.time.end.minutes}`)
					) {
						case 730:
							y2 = 3;
							break;
						case 800:
							y2 = 3;
							break;
						case 830:
							y2 = 4;
							break;
						case 900:
							y2 = 5;
							break;
						case 930:
							y2 = 6;
							break;
						case 1000:
							y2 = 7;
							break;
						case 1030:
							y2 = 8;
							break;
						case 1100:
							y2 = 9;
							break;
						case 1130:
							y2 = 10;
							break;
						case 1200:
							y2 = 11;
							break;
						case 1230:
							y2 = 12;
							break;
						case 1300:
							y2 = 13;
							break;
						case 1330:
							y2 = 14;
							break;
						case 1400:
							y2 = 15;
							break;
						case 1430:
							y2 = 16;
							break;
						case 1500:
							y2 = 17;
							break;
						case 1530:
							y2 = 18;
							break;
						case 1600:
							y2 = 19;
							break;
						case 1630:
							y2 = 20;
							break;
						case 1700:
							y2 = 21;
							break;
						case 1730:
							y2 = 22;
							break;
						case 1800:
							y2 = 23;
							break;
						case 1830:
							y2 = 24;
							break;
						case 1900:
							y2 = 25;
							break;
						case 1930:
							y2 = 26;
							break;
						case 2000:
							y2 = 27;
							break;
						case 2030:
							y2 = 28;
							break;
						case 2100:
							y2 = 29;
							break;
					}

					var start_hours = schedule.time.start.hours;
					var start_minutes = schedule.time.start.minutes;
					var end_hours = schedule.time.end.hours;
					var end_minutes = schedule.time.end.minutes;

					var start_sunny = true;
					if(start_hours > 12) {
						start_sunny = false;
						start_hours = start_hours - 12;
					} 
					var end_sunny = true;
					if(end_hours > 12) {
						end_sunny = false;
						end_hours = end_hours - 12;
					}
					
					ws.cell(y1, x1, y2, x2, true)
					.style(scheduleStyle)
					.string(
						`Advising Time ${start_hours}:${start_minutes}${start_sunny ? 'AM' : 'PM'} - ${end_hours}:${end_minutes}${end_sunny ? 'AM' : 'PM'}						
						`
					);
				})
			}

			scheduleData.forEach((schedule) => {
				let schedule_color = {
					type: "none",
				};

				console.log('Schedule Type : ' + schedule.type);
				console.log('Schedule Name : ' + schedule.name);

				if(schedule.type == 'SUBSTITUTE')
				{
					schedule_color = {
						type: "pattern",
						patternType: "solid",
						bgColor: "#ff9248",
						fgColor: "#ff9248",
					};
				};
				if(schedule.type == 'PART TIME')
				{
					schedule_color = {
						type: "pattern",
						patternType: "solid",
						bgColor: "#ff9248",
						fgColor: "#ff9248",
					};
				};
				if(schedule.type == 'TEMPORARY SUBSTITUTE')
				{
					schedule_color = {
						type: "pattern",
						patternType: "solid",
						bgColor: "#ffff00",
						fgColor: "#ffff00",
					};
				};
				if(schedule.type == 'SUBSTITUTE')
				{
					schedule_color = {
						type: "pattern",
						patternType: "solid",
						bgColor: "#ff9248",
						fgColor: "#ff9248",
					};
				};
				
				console.log('Schedule Color : ');
				console.log(schedule_color);

				let scheduleStyle = {
					font: {
						size: 11,
					},
					alignment: {
						horizontal: ["center"],
						vertical: ["center"],
						wrapText: true,
						bold: true,
					},
					fill: schedule_color				
				};

				let x1 = schedule.day + 2;
				let x2 = schedule.day + 2;
				let y1, y2;

				switch (
					parseInt(`${schedule.time.start.hours}${schedule.time.start.minutes}`)
				) {
					case 730:
						y1 = 3;
						break;
					case 800:
						y1 = 4;
						break;
					case 830:
						y1 = 5;
						break;
					case 900:
						y1 = 6;
						break;
					case 930:
						y1 = 7;
						break;
					case 1000:
						y1 = 8;
						break;
					case 1030:
						y1 = 9;
						break;
					case 1100:
						y1 = 10;
						break;
					case 1130:
						y1 = 11;
						break;
					case 1200:
						y1 = 12;
						break;
					case 1230:
						y1 = 13;
						break;
					case 1300:
						y1 = 14;
						break;
					case 1330:
						y1 = 15;
						break;
					case 1400:
						y1 = 16;
						break;
					case 1430:
						y1 = 17;
						break;
					case 1500:
						y1 = 18;
						break;
					case 1530:
						y1 = 19;
						break;
					case 1600:
						y1 = 20;
						break;
					case 1630:
						y1 = 21;
						break;
					case 1700:
						y1 = 22;
						break;
					case 1730:
						y1 = 23;
						break;
					case 1800:
						y1 = 24;
						break;
					case 1830:
						y1 = 25;
						break;
					case 1900:
						y1 = 26;
						break;
					case 1930:
						y1 = 27;
						break;
					case 2000:
						y1 = 28;
						break;
					case 2030:
						y1 = 29;
						break;
					default:
						y1 = 29;
						break;
				}
				switch (
					parseInt(`${schedule.time.end.hours}${schedule.time.end.minutes}`)
				) {
					case 730:
						y2 = 3;
						break;
					case 800:
						y2 = 3;
						break;
					case 830:
						y2 = 4;
						break;
					case 900:
						y2 = 5;
						break;
					case 930:
						y2 = 6;
						break;
					case 1000:
						y2 = 7;
						break;
					case 1030:
						y2 = 8;
						break;
					case 1100:
						y2 = 9;
						break;
					case 1130:
						y2 = 10;
						break;
					case 1200:
						y2 = 11;
						break;
					case 1230:
						y2 = 12;
						break;
					case 1300:
						y2 = 13;
						break;
					case 1330:
						y2 = 14;
						break;
					case 1400:
						y2 = 15;
						break;
					case 1430:
						y2 = 16;
						break;
					case 1500:
						y2 = 17;
						break;
					case 1530:
						y2 = 18;
						break;
					case 1600:
						y2 = 19;
						break;
					case 1630:
						y2 = 20;
						break;
					case 1700:
						y2 = 21;
						break;
					case 1730:
						y2 = 22;
						break;
					case 1800:
						y2 = 23;
						break;
					case 1830:
						y2 = 24;
						break;
					case 1900:
						y2 = 25;
						break;
					case 1930:
						y2 = 26;
						break;
					case 2000:
						y2 = 27;
						break;
					case 2030:
						y2 = 28;
						break;
					case 2100:
						y2 = 29;
						break;
				}

				switch (schedule.day) {
					case 0:
						mondayLoad = mondayLoad + parseInt(schedule.courseData.units);
						break;
					case 1:
						tuesdayLoad = tuesdayLoad + parseInt(schedule.courseData.units);
						break;
					case 2:
						wednesdayLoad = wednesdayLoad + parseInt(schedule.courseData.units);
						break;
					case 3:
						thursdayLoad = thursdayLoad + parseInt(schedule.courseData.units);
						break;
					case 4:
						fridayLoad = fridayLoad + parseInt(schedule.courseData.units);
						break;
					case 5:
						saturdayLoad = saturdayLoad + parseInt(schedule.courseData.units);
						break;
					case 6:
						sundayLoad = sundayLoad + parseInt(schedule.courseData.units);
						break;
				}

				// console.log(schedule);
				// console.log(y1, x1, y2, x2);

				ws.cell(y1, x1, y2, x2, true)
					.style(scheduleStyle)
					.string(
						// `${schedule.courseData.code} ${schedule.courseData.name} - ${schedule.name} ― ${schedule.programData.acronym} ${schedule.programData.year}-${schedule.programData.section} ― ${schedule.roomData.name}`
						`${schedule.courseData.code} ${schedule.courseData.name} - ${schedule.name} ― ${schedule.programData.section} ― ${schedule.roomData.name}`
					);
			});

			// console.log(
			// 	mondayLoad +
			// 		tuesdayLoad +
			// 		wednesdayLoad +
			// 		thursdayLoad +
			// 		fridayLoad +
			// 		saturdayLoad +
			// 		sundayLoad
			// );

			ws.cell(30, 1)
				.style({ font: { bold: true } })
				.number(
					mondayLoad +
						tuesdayLoad +
						wednesdayLoad +
						thursdayLoad +
						fridayLoad +
						saturdayLoad +
						sundayLoad
				);
			ws.cell(30, 2)
				.style({ font: { bold: true } })
				.number(mondayLoad);
			ws.cell(30, 3)
				.style({ font: { bold: true } })
				.number(tuesdayLoad);
			ws.cell(30, 4)
				.style({ font: { bold: true } })
				.number(wednesdayLoad);
			ws.cell(30, 5)
				.style({ font: { bold: true } })
				.number(thursdayLoad);
			ws.cell(30, 6)
				.style({ font: { bold: true } })
				.number(fridayLoad);
			ws.cell(30, 7)
				.style({ font: { bold: true } })
				.number(saturdayLoad);
			ws.cell(30, 8)
				.style({ font: { bold: true } })
				.number(sundayLoad);

			wb.write(savePathSelected.filePath);
		}
	});

	ipcMain.on("export-to-excel-room", async (event, selectedData) => {
		console.log(selectedData);
		let savePathSelected = await dialog.showSaveDialog({
			filters: [{ name: "Excel file", extensions: ["xlsx"] }],
		});
		console.log(savePathSelected);
		console.log(path.extname(savePathSelected.filePath));
		console.log(path.parse(savePathSelected.filePath));

		if (!savePathSelected.canceled) {
			let scheduleData = await ScheduleModel.find({
				"roomData._id": selectedData._id,
			});

			console.log(scheduleData);

			let option = {
				margins: {
					left: 1.5,
					right: 1.5,
				},
				sheetFormat: {
					baseColWidth: 12,
					defaultRowHeight: 22,
				},
			};

			let wb = new xl.Workbook();
			let ws = wb.addWorksheet(`${selectedData.name}`, option);

			let header = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#C2D59A",
					fgColor: "#C2D59A",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});

			ws.cell(1, 1, 1, 8, true).string(`${selectedData.name}`);
			ws.cell(2, 1).style(header);
			ws.cell(3, 1, 5, 1, true).style(header).string("7:30AM - 9:00AM");
			ws.cell(6, 1, 8, 1, true).style(header).string("9:00AM - 10:30AM");
			ws.cell(9, 1, 11, 1, true).style(header).string("10:30AM - 12:00PM");
			ws.cell(12, 1, 14, 1, true).style(header).string("12:00PM - 1:30PM");
			ws.cell(15, 1, 17, 1, true).style(header).string("1:30PM - 3:00PM");
			ws.cell(18, 1, 20, 1, true).style(header).string("3:00PM - 4:30PM");
			ws.cell(21, 1, 23, 1, true).style(header).string("4:30PM - 6:00PM");
			ws.cell(24, 1, 26, 1, true).style(header).string("6:00PM - 7:30PM");
			ws.cell(27, 1, 29, 1, true).style(header).string("7:30PM - 9:00PM");

			ws.cell(2, 2).style(header).string("Monday");
			ws.cell(2, 3).style(header).string("Tuesday");
			ws.cell(2, 4).style(header).string("Wednesday");
			ws.cell(2, 5).style(header).string("Thursday");
			ws.cell(2, 6).style(header).string("Friday");
			ws.cell(2, 7).style(header).string("Saturday");
			ws.cell(2, 8).style(header).string("Sunday");

			for (let i = 2; i <= 8; i++) {
				for (let j = 3; j <= 29; j++) {
					ws.cell(j, i).style({
						border: {
							left: {
								style: "thin",
								color: "#000000",
							},
							right: {
								style: "thin",
								color: "#000000",
							},
							top: {
								style: "thin",
								color: "#000000",
							},
							bottom: {
								style: "thin",
								color: "#000000",
							},
						},
					});
				}
			}

			let scheduleStyle = {
				font: {
					size: 11,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
					bold: true,
				},
			};

			let mondayLoad = 0;
			let tuesdayLoad = 0;
			let wednesdayLoad = 0;
			let thursdayLoad = 0;
			let fridayLoad = 0;
			let saturdayLoad = 0;
			let sundayLoad = 0;

			scheduleData.forEach((schedule) => {
				let x1 = schedule.day + 2;
				let x2 = schedule.day + 2;
				let y1, y2;

				switch (
					parseInt(`${schedule.time.start.hours}${schedule.time.start.minutes}`)
				) {
					case 730:
						y1 = 3;
						break;
					case 800:
						y1 = 4;
						break;
					case 830:
						y1 = 5;
						break;
					case 900:
						y1 = 6;
						break;
					case 930:
						y1 = 7;
						break;
					case 1000:
						y1 = 8;
						break;
					case 1030:
						y1 = 9;
						break;
					case 1100:
						y1 = 10;
						break;
					case 1130:
						y1 = 11;
						break;
					case 1200:
						y1 = 12;
						break;
					case 1230:
						y1 = 13;
						break;
					case 1300:
						y1 = 14;
						break;
					case 1330:
						y1 = 15;
						break;
					case 1400:
						y1 = 16;
						break;
					case 1430:
						y1 = 17;
						break;
					case 1500:
						y1 = 18;
						break;
					case 1530:
						y1 = 19;
						break;
					case 1600:
						y1 = 20;
						break;
					case 1630:
						y1 = 21;
						break;
					case 1700:
						y1 = 22;
						break;
					case 1730:
						y1 = 23;
						break;
					case 1800:
						y1 = 24;
						break;
					case 1830:
						y1 = 25;
						break;
					case 1900:
						y1 = 26;
						break;
					case 1930:
						y1 = 27;
						break;
					case 2000:
						y1 = 28;
						break;
					case 2030:
						y1 = 29;
						break;
					default:
						y1 = 29;
						break;
				}
				switch (
					parseInt(`${schedule.time.end.hours}${schedule.time.end.minutes}`)
				) {
					case 730:
						y2 = 3;
						break;
					case 800:
						y2 = 3;
						break;
					case 830:
						y2 = 4;
						break;
					case 900:
						y2 = 5;
						break;
					case 930:
						y2 = 6;
						break;
					case 1000:
						y2 = 7;
						break;
					case 1030:
						y2 = 8;
						break;
					case 1100:
						y2 = 9;
						break;
					case 1130:
						y2 = 10;
						break;
					case 1200:
						y2 = 11;
						break;
					case 1230:
						y2 = 12;
						break;
					case 1300:
						y2 = 13;
						break;
					case 1330:
						y2 = 14;
						break;
					case 1400:
						y2 = 15;
						break;
					case 1430:
						y2 = 16;
						break;
					case 1500:
						y2 = 17;
						break;
					case 1530:
						y2 = 18;
						break;
					case 1600:
						y2 = 19;
						break;
					case 1630:
						y2 = 20;
						break;
					case 1700:
						y2 = 21;
						break;
					case 1730:
						y2 = 22;
						break;
					case 1800:
						y2 = 23;
						break;
					case 1830:
						y2 = 24;
						break;
					case 1900:
						y2 = 25;
						break;
					case 1930:
						y2 = 26;
						break;
					case 2000:
						y2 = 27;
						break;
					case 2030:
						y2 = 28;
						break;
					case 2100:
						y2 = 29;
						break;
				}

				switch (schedule.day) {
					case 0:
						mondayLoad = mondayLoad + parseInt(schedule.courseData.units);
						break;
					case 1:
						tuesdayLoad = tuesdayLoad + parseInt(schedule.courseData.units);
						break;
					case 2:
						wednesdayLoad = wednesdayLoad + parseInt(schedule.courseData.units);
						break;
					case 3:
						thursdayLoad = thursdayLoad + parseInt(schedule.courseData.units);
						break;
					case 4:
						fridayLoad = fridayLoad + parseInt(schedule.courseData.units);
						break;
					case 5:
						saturdayLoad = saturdayLoad + parseInt(schedule.courseData.units);
						break;
					case 6:
						sundayLoad = sundayLoad + parseInt(schedule.courseData.units);
						break;
				}

				console.log(schedule);
				console.log(y1, x1, y2, x2);

				ws.cell(y1, x1, y2, x2, true)
					.style(scheduleStyle)
					.string(
						`${schedule.courseData.code} ${schedule.courseData.name} ― ${schedule.programData.acronym} ${schedule.programData.year}-${schedule.programData.section} ― ${schedule.professorData.name.last}, ${schedule.professorData.name.first}`
					);
			});

			console.log(
				mondayLoad +
					tuesdayLoad +
					wednesdayLoad +
					thursdayLoad +
					fridayLoad +
					saturdayLoad +
					sundayLoad
			);

			ws.cell(30, 1)
				.style({ font: { bold: true } })
				.number(
					mondayLoad +
						tuesdayLoad +
						wednesdayLoad +
						thursdayLoad +
						fridayLoad +
						saturdayLoad +
						sundayLoad
				);
			ws.cell(30, 2)
				.style({ font: { bold: true } })
				.number(mondayLoad);
			ws.cell(30, 3)
				.style({ font: { bold: true } })
				.number(tuesdayLoad);
			ws.cell(30, 4)
				.style({ font: { bold: true } })
				.number(wednesdayLoad);
			ws.cell(30, 5)
				.style({ font: { bold: true } })
				.number(thursdayLoad);
			ws.cell(30, 6)
				.style({ font: { bold: true } })
				.number(fridayLoad);
			ws.cell(30, 7)
				.style({ font: { bold: true } })
				.number(saturdayLoad);
			ws.cell(30, 8)
				.style({ font: { bold: true } })
				.number(sundayLoad);

			wb.write(savePathSelected.filePath);
		}
	});
	ipcMain.on("export-to-excel-program", async (event, selectedData) => {
		console.log(selectedData);
		let savePathSelected = await dialog.showSaveDialog({
			filters: [{ name: "Excel file", extensions: ["xlsx"] }],
		});
		console.log(savePathSelected);
		console.log(path.extname(savePathSelected.filePath));
		console.log(path.parse(savePathSelected.filePath));

		if (!savePathSelected.canceled) {
			let scheduleData = await ScheduleModel.find({
				"programData._id": selectedData._id,
			});

			console.log(scheduleData);

			let option = {
				margins: {
					left: 1.5,
					right: 1.5,
				},
				sheetFormat: {
					baseColWidth: 12,
					defaultRowHeight: 22,
				},
			};

			let wb = new xl.Workbook();
			let ws = wb.addWorksheet(
				`${selectedData.acronym} ${selectedData.year}-${selectedData.section}`,
				option
			);

			let header = wb.createStyle({
				font: {
					size: 11,
					bold: true,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
				},
				fill: {
					type: "pattern",
					patternType: "solid",
					bgColor: "#C2D59A",
					fgColor: "#C2D59A",
				},
				border: {
					left: {
						style: "thin",
						color: "#000000",
					},
					right: {
						style: "thin",
						color: "#000000",
					},
					top: {
						style: "thin",
						color: "#000000",
					},
					bottom: {
						style: "thin",
						color: "#000000",
					},
				},
			});

			ws.cell(1, 1, 1, 8, true).string(
				`${selectedData.name} ${selectedData.year}-${selectedData.section}`
			);
			ws.cell(2, 1).style(header);
			ws.cell(3, 1, 5, 1, true).style(header).string("7:30AM - 9:00AM");
			ws.cell(6, 1, 8, 1, true).style(header).string("9:00AM - 10:30AM");
			ws.cell(9, 1, 11, 1, true).style(header).string("10:30AM - 12:00PM");
			ws.cell(12, 1, 14, 1, true).style(header).string("12:00PM - 1:30PM");
			ws.cell(15, 1, 17, 1, true).style(header).string("1:30PM - 3:00PM");
			ws.cell(18, 1, 20, 1, true).style(header).string("3:00PM - 4:30PM");
			ws.cell(21, 1, 23, 1, true).style(header).string("4:30PM - 6:00PM");
			ws.cell(24, 1, 26, 1, true).style(header).string("6:00PM - 7:30PM");
			ws.cell(27, 1, 29, 1, true).style(header).string("7:30PM - 9:00PM");

			ws.cell(2, 2).style(header).string("Monday");
			ws.cell(2, 3).style(header).string("Tuesday");
			ws.cell(2, 4).style(header).string("Wednesday");
			ws.cell(2, 5).style(header).string("Thursday");
			ws.cell(2, 6).style(header).string("Friday");
			ws.cell(2, 7).style(header).string("Saturday");
			ws.cell(2, 8).style(header).string("Sunday");

			for (let i = 2; i <= 8; i++) {
				for (let j = 3; j <= 29; j++) {
					ws.cell(j, i).style({
						border: {
							left: {
								style: "thin",
								color: "#000000",
							},
							right: {
								style: "thin",
								color: "#000000",
							},
							top: {
								style: "thin",
								color: "#000000",
							},
							bottom: {
								style: "thin",
								color: "#000000",
							},
						},
					});
				}
			}

			let scheduleStyle = {
				font: {
					size: 11,
				},
				alignment: {
					horizontal: ["center"],
					vertical: ["center"],
					wrapText: true,
					bold: true,
				},
			};

			let mondayLoad = 0;
			let tuesdayLoad = 0;
			let wednesdayLoad = 0;
			let thursdayLoad = 0;
			let fridayLoad = 0;
			let saturdayLoad = 0;
			let sundayLoad = 0;

			scheduleData.forEach((schedule) => {
				let x1 = schedule.day + 2;
				let x2 = schedule.day + 2;
				let y1, y2;

				switch (
					parseInt(`${schedule.time.start.hours}${schedule.time.start.minutes}`)
				) {
					case 730:
						y1 = 3;
						break;
					case 800:
						y1 = 4;
						break;
					case 830:
						y1 = 5;
						break;
					case 900:
						y1 = 6;
						break;
					case 930:
						y1 = 7;
						break;
					case 1000:
						y1 = 8;
						break;
					case 1030:
						y1 = 9;
						break;
					case 1100:
						y1 = 10;
						break;
					case 1130:
						y1 = 11;
						break;
					case 1200:
						y1 = 12;
						break;
					case 1230:
						y1 = 13;
						break;
					case 1300:
						y1 = 14;
						break;
					case 1330:
						y1 = 15;
						break;
					case 1400:
						y1 = 16;
						break;
					case 1430:
						y1 = 17;
						break;
					case 1500:
						y1 = 18;
						break;
					case 1530:
						y1 = 19;
						break;
					case 1600:
						y1 = 20;
						break;
					case 1630:
						y1 = 21;
						break;
					case 1700:
						y1 = 22;
						break;
					case 1730:
						y1 = 23;
						break;
					case 1800:
						y1 = 24;
						break;
					case 1830:
						y1 = 25;
						break;
					case 1900:
						y1 = 26;
						break;
					case 1930:
						y1 = 27;
						break;
					case 2000:
						y1 = 28;
						break;
					case 2030:
						y1 = 29;
						break;
					default:
						y1 = 29;
						break;
				}
				switch (
					parseInt(`${schedule.time.end.hours}${schedule.time.end.minutes}`)
				) {
					case 730:
						y2 = 3;
						break;
					case 800:
						y2 = 3;
						break;
					case 830:
						y2 = 4;
						break;
					case 900:
						y2 = 5;
						break;
					case 930:
						y2 = 6;
						break;
					case 1000:
						y2 = 7;
						break;
					case 1030:
						y2 = 8;
						break;
					case 1100:
						y2 = 9;
						break;
					case 1130:
						y2 = 10;
						break;
					case 1200:
						y2 = 11;
						break;
					case 1230:
						y2 = 12;
						break;
					case 1300:
						y2 = 13;
						break;
					case 1330:
						y2 = 14;
						break;
					case 1400:
						y2 = 15;
						break;
					case 1430:
						y2 = 16;
						break;
					case 1500:
						y2 = 17;
						break;
					case 1530:
						y2 = 18;
						break;
					case 1600:
						y2 = 19;
						break;
					case 1630:
						y2 = 20;
						break;
					case 1700:
						y2 = 21;
						break;
					case 1730:
						y2 = 22;
						break;
					case 1800:
						y2 = 23;
						break;
					case 1830:
						y2 = 24;
						break;
					case 1900:
						y2 = 25;
						break;
					case 1930:
						y2 = 26;
						break;
					case 2000:
						y2 = 27;
						break;
					case 2030:
						y2 = 28;
						break;
					case 2100:
						y2 = 29;
						break;
				}

				switch (schedule.day) {
					case 0:
						mondayLoad = mondayLoad + parseInt(schedule.courseData.units);
						break;
					case 1:
						tuesdayLoad = tuesdayLoad + parseInt(schedule.courseData.units);
						break;
					case 2:
						wednesdayLoad = wednesdayLoad + parseInt(schedule.courseData.units);
						break;
					case 3:
						thursdayLoad = thursdayLoad + parseInt(schedule.courseData.units);
						break;
					case 4:
						fridayLoad = fridayLoad + parseInt(schedule.courseData.units);
						break;
					case 5:
						saturdayLoad = saturdayLoad + parseInt(schedule.courseData.units);
						break;
					case 6:
						sundayLoad = sundayLoad + parseInt(schedule.courseData.units);
						break;
				}

				console.log(schedule);
				console.log(y1, x1, y2, x2);

				ws.cell(y1, x1, y2, x2, true)
					.style(scheduleStyle)
					.string(
						`${schedule.courseData.code} ${schedule.courseData.name} ― ${schedule.roomData.name} ― ${schedule.professorData.name.last}, ${schedule.professorData.name.first}`
					);
			});

			console.log(
				mondayLoad +
					tuesdayLoad +
					wednesdayLoad +
					thursdayLoad +
					fridayLoad +
					saturdayLoad +
					sundayLoad
			);

			ws.cell(30, 1)
				.style({ font: { bold: true } })
				.number(
					mondayLoad +
						tuesdayLoad +
						wednesdayLoad +
						thursdayLoad +
						fridayLoad +
						saturdayLoad +
						sundayLoad
				);
			ws.cell(30, 2)
				.style({ font: { bold: true } })
				.number(mondayLoad);
			ws.cell(30, 3)
				.style({ font: { bold: true } })
				.number(tuesdayLoad);
			ws.cell(30, 4)
				.style({ font: { bold: true } })
				.number(wednesdayLoad);
			ws.cell(30, 5)
				.style({ font: { bold: true } })
				.number(thursdayLoad);
			ws.cell(30, 6)
				.style({ font: { bold: true } })
				.number(fridayLoad);
			ws.cell(30, 7)
				.style({ font: { bold: true } })
				.number(saturdayLoad);
			ws.cell(30, 8)
				.style({ font: { bold: true } })
				.number(sundayLoad);

			wb.write(savePathSelected.filePath);
		}
	});

	console.log(`finished loading events`);
};