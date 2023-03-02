const { app, BrowserWindow, ipcMain } = require("electron");
const loadSystem = require("./system");

// const isDev = require("electron-is-dev");

// If in development use electron-reload to watch for
// changes in the current directory
// if (isDev) {
// 	require("electron-reload")(__dirname, {
// 		electron: require(`${__dirname}/node_modules/electron`),
// 	});
// }

function createWindow() {
	// Create the browser window with node integration
	const win = new BrowserWindow({
		minWidth: 960,
		minHeight: 600,
		width: 960,
		height: 600,
		//titleBarStyle: "hidden",
		autoHideMenuBar: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true,
		},
	});

	win.loadFile(`${__dirname}/public/index.html`);
	win.once("ready-to-show", () => {
		console.log(`load system js`);
		loadSystem(win);
		win.maximize();
	});

	// If in production, don't show.
	// if (isDev) win.webContents.openDevTools();

	win.webContents.openDevTools();

	// Sends shutdown request from renderer
	ipcMain.on("shutdown-prompt", () => {
		app.quit();
	});

	// Sends minimize request from renderer
	ipcMain.on("minimize-prompt", () => {
		win.minimize();
	});

	// Sends maximize request from renderer
	ipcMain.on("maximize-prompt", () => {
		win.isMaximized() ? win.restore() : win.maximize();
	});
}

app.whenReady().then(() => {
	createWindow();
	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});
