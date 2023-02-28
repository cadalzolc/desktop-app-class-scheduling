<script>
	// Imports
	const { ipcRenderer } = require("electron");
	import { fade } from "svelte/transition"

	// Components
	import Header from "./components/Header.svelte";
	import SideMenu from "./components/SideMenu.svelte";
	import AddButton from "./components/AddButton.svelte";
	import AddWindow from "./components/AddWindow.svelte";
	import EditWindow from "./components/EditWindow.svelte";
	import DeleteWindow from "./components/DeleteWindow.svelte";
	import DeleteScheduleWindow from "./components/DeleteScheduleWindow.svelte";
	import ResetPasswordWindow from "./components/ResetPasswordWindow.svelte";
	import ExitApplicationWindow from "./components/ExitApplicationWindow.svelte";
	import Logo from "./components/Logo.svelte";

	// Views
	import Dashboard from "./views/Dashboard.svelte";
	import Courses from "./views/Courses.svelte";
	import Rooms from "./views/Rooms.svelte";
	import Professors from "./views/Professors.svelte";
	import Programs from "./views/Programs.svelte";
	import Subjects from "./views/Subjects.svelte";
	import Schedules from "./views/Schedules.svelte";	
	import SettingsWindow from "./components/SettingsWindow.svelte";
	import LoadingScreen from "./components/LoadingScreen.svelte";
	import LoginScreen from "./components/LoginScreen.svelte";
	import RoomView from "./views/individualViews/RoomView.svelte";
	import ProfessorView from "./views/individualViews/professorView.svelte";
	import ProgramView from "./views/individualViews/ProgramView.svelte";
	import AdviceTime from "./views/individualViews/AdviceTime.svelte";
	import ProfessorOverview from "./views/ProfessorOverview.svelte";
	// import Modal from 'svelte-simple-modal';
	// import Popup from './views/Content.svelte';
	// import { writable } from 'svelte/store';
	// const modal = writable(null);
	// const showModal = () => modal.set(Popup);

	// Stores
	import { viewComponentValue, loadingScreenDone, authenticateComplete, selectedData, sideMenuStatus, addWindowStatus, editWindowStatus, settingsWindowStatus, deleteWindowStatus, deleteWindowScheduleStatus, exitApplicationWindowStatus } from "./stores/ui";


	let loadingStatus = setInterval(() => {
		console.log("Sending loading screen request...")
		ipcRenderer.send("loading-screen");
	}, 500)

	ipcRenderer.on("loading-screen", (event, res) => {
		console.log("Received something.")
		console.log(res);
		if (res) {
			setTimeout(() => {
				loadingScreenDone.set(true);
				clearInterval(loadingStatus);
			}, 3000);
		}
	});

	document.onkeydown = (e) => {
		if (e.key == "Tab" && $addWindowStatus != true && $editWindowStatus != true && $settingsWindowStatus != true && $authenticateComplete == true) sideMenuStatus.set(!$sideMenuStatus);
		if (e.key == "Escape" && ($addWindowStatus == true || $editWindowStatus == true || $sideMenuStatus == true || $settingsWindowStatus == true) || $deleteWindowScheduleStatus == true || $deleteWindowStatus == true || $exitApplicationWindowStatus == true) {
			addWindowStatus.set(false);
			editWindowStatus.set(false);
			settingsWindowStatus.set(false);
			sideMenuStatus.set(false);
			deleteWindowStatus.set(false);
			deleteWindowScheduleStatus.set(false);
			exitApplicationWindowStatus.set(false);
		}
		if (e.key == "1" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(0);
			sideMenuStatus.set(false);
			selectedData.set("");
		}
		if (e.key == "2" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(1);
			sideMenuStatus.set(false);
			selectedData.set("");
		}
		if (e.key == "3" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(2);
			sideMenuStatus.set(false);
			selectedData.set("");
		}
		if (e.key == "4" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(3);
			sideMenuStatus.set(false);
			selectedData.set("");
		}
		if (e.key == "5" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(4);
			sideMenuStatus.set(false);
			selectedData.set("");
		}
		if (e.key == "6" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(5);
			sideMenuStatus.set(false);
			selectedData.set("");
		}
		if (e.key == "7" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(6);
			sideMenuStatus.set(false);
			selectedData.set("");
		}		
		if (e.key == "8" && ($addWindowStatus == false && $editWindowStatus == false && $sideMenuStatus == true)) {
			viewComponentValue.set(7);
			sideMenuStatus.set(false);
			selectedData.set("");
		}

		console.log(e)
	}

</script>

{#if !$loadingScreenDone}
	<LoadingScreen />
{:else if !$authenticateComplete}
	<ResetPasswordWindow />
	<LoginScreen />
{:else if $authenticateComplete}
	<SideMenu />
	<AddWindow />
	<EditWindow />
	<DeleteWindow />
	<DeleteScheduleWindow />
	<SettingsWindow />
	<ExitApplicationWindow />
	<Logo />
	<main in:fade={{delay: 250, duration: 250}} class="w-screen h-screen grid grid-rows-2">
		<Header />
		{#if $selectedData == "" || $viewComponentValue == 1}
			{#if $viewComponentValue == 0}
				<Dashboard />
			{:else if $viewComponentValue == 1}
				<Courses />
			{:else if $viewComponentValue == 2}
				<Rooms />
			{:else if $viewComponentValue == 3}
				<Professors />
			{:else if $viewComponentValue == 4}
				<Programs />
			{:else if $viewComponentValue == 5}
				<Subjects />
			{:else if $viewComponentValue == 6}
				<Schedules />
			{:else if $viewComponentValue == 7}
				<ProfessorOverview />
			{/if}
		{:else}
			{#if $viewComponentValue == 2}
				<RoomView />
			{:else if $viewComponentValue == 3}
				<ProfessorView />
			{:else if $viewComponentValue == 4}
				<ProgramView />
			{:else if $viewComponentValue == 8}
				<AdviceTime />				
			{/if}
		{/if}
	</main>
	
	{#if $selectedData == "" || ( $viewComponentValue !== 6 || $viewComponentValue !== 7 || $viewComponentValue !== 8) }
		<AddButton />
	{/if}
{/if}

<style>
	main {
		grid-template-rows: auto 1fr;
	}
</style>