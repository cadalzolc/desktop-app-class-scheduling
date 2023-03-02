import { writable } from "svelte/store";

export const loadingScreenDone = writable(false);
export const authenticateComplete = writable(false);
export const exitApplicationWindowStatus = writable(false);
export const sideMenuStatus = writable(false);
export const addWindowStatus = writable(false);
export const editWindowStatus = writable(false);
export const deleteWindowScheduleStatus = writable(false);
export const deleteWindowStatus = writable(false);
export const resetPasswordWindowStatus = writable(false);
export const settingsWindowStatus = writable(false);
export const viewComponentValue = writable(0);
export const selectedData = writable("");
export const settingsData = writable({
	uid: String,
	schoolYear: String,
	schoolSemester: String,
	systemPassword: String,
});
export const courseData = writable();
export const roomData = writable();
export const programData = writable();
export const tbdData = writable();