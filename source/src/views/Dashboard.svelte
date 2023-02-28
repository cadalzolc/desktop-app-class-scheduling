<script>
  const { ipcRenderer } = require("electron");
  import { viewComponentValue, settingsData } from "../stores/ui";
  import { onDestroy, onMount } from 'svelte';

  let hours = "99", minutes = "99", seconds = "99";
  let postfixTime = "AM";
  let messageIndex = 0;
  let greetings = [
    "Give me a moment while I figure out the time.",
    "Let's start the day with a cup of hot coffee! Or do you prefer tea?",
    "Go grab some food for now. Don't worry, I'll still be here.",
    "Please enjoy the rest of the day! Don't forget about your health!!",
    "Time to pack your stuff and head back home. We can continue tomorrow.",
    "A well-rested worker is an efficient worker."
  ];
  let dashboardData = {
			coursesNumber: 0,
			professorsNumber: 0,
			roomsNumber: 0,
			programsNumber: 0,
      subjectsNumber: 0,
      schedulesNumber: 0,
		};

  let viewComponentValueChange = (i) => {
    viewComponentValue.set(i);
  };

  let timeTick = setInterval(() => {
    const date = new Date();
    if (date.getHours() >= 13) {
      if (date.getHours() % 12 < 10) hours = "0" + date.getHours() % 12;
      else hours = date.getHours() % 12;
      postfixTime = "PM";
    }
    else if (date.getHours() % 12 == 0) {
      hours = 12;
      if (date.getHours() == 12) {
        postfixTime = "PM";
      } else postfixTime = "AM";
    }
    else {
      if (date.getHours() % 12 < 10) hours = "0" + date.getHours() % 12;
      else hours = date.getHours() % 12;
      postfixTime = "AM";
    }

    if (date.getHours() >= 6 && date.getHours() <= 7) messageIndex = 1;
    else if (date.getHours() >= 12 && date.getHours() < 13) messageIndex = 2;
    else if (date.getHours() >= 18 && date.getHours() <= 20) messageIndex = 4;
    else if (date.getHours() >= 21) messageIndex = 5;
    else messageIndex = 3;

    if (date.getMinutes() < 10) minutes = "0" + date.getMinutes(); 
    else minutes = date.getMinutes();

    if (date.getSeconds() < 10) seconds = "0" + date.getSeconds();
    else seconds = date.getSeconds();
  }, 1000);

  onMount(() => {
    ipcRenderer.send("retrieve-dashboard-course");
    ipcRenderer.send("retrieve-dashboard-professor");
    ipcRenderer.send("retrieve-dashboard-room");
    ipcRenderer.send("retrieve-dashboard-program");
    ipcRenderer.send("retrieve-dashboard-subject");
    ipcRenderer.send("retrieve-dashboard-schedule");
    ipcRenderer.send("retrieve-settings-data");
  });

  ipcRenderer.on("retrieve-dashboard-course", (event, res) => {
    dashboardData.coursesNumber = res;
    ipcRenderer.removeAllListeners("retrieve-dashboard-course");
  });
  ipcRenderer.on("retrieve-dashboard-professor", (event, res) => {
    dashboardData.professorsNumber = res;
    ipcRenderer.removeAllListeners("retrieve-dashboard-professor");
  });
  ipcRenderer.on("retrieve-dashboard-room", (event, res) => {
    dashboardData.roomsNumber = res;
    ipcRenderer.removeAllListeners("retrieve-dashboard-room");
  });
  ipcRenderer.on("retrieve-dashboard-program", (event, res) => {
    dashboardData.programsNumber = res;
    ipcRenderer.removeAllListeners("retrieve-dashboard-program");
  });
  ipcRenderer.on("retrieve-dashboard-subject", (event, res) => {
    console.log(res);
    dashboardData.subjectsNumber = res;
    ipcRenderer.removeAllListeners("retrieve-dashboard-subject");
  });
  ipcRenderer.on("retrieve-dashboard-schedule", (event, res) => {
    dashboardData.schedulesNumber = res;
    ipcRenderer.removeAllListeners("retrieve-dashboard-schedule");
  });    
  

  ipcRenderer.on("retrieve-settings-data", (event, res) => {
    console.log(res)
    $settingsData.uid = res[0].uid;
    $settingsData.schoolYear = res[0].schoolYear;
    $settingsData.schoolSemester = res[0].schoolSemester;
    $settingsData.systemPassword = res[0].systemPassword;
    ipcRenderer.removeAllListeners("retrieve-settings-data");
  });

  onDestroy(async () => {
   clearInterval(timeTick);
  });
</script>

<svelte:head>
  <title>.dotSystems - Dashboard</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col">
  <div class="h-auto w-full bg-gray-200 rounded-md drop-shadow-md flex flex-col justify-end items-end">
    <div class="h-52 w-full p-4 flex flex-col justify-end">
      <h1 class="text-4xl font-light mb-1">Welcome, it is currently {hours}:{minutes}:{seconds} {postfixTime}.</h1>
      <h2 class="mb-2 text-gray-700">A.Y. {$settingsData.schoolYear} - {parseInt($settingsData.schoolYear) + 1} {$settingsData.schoolSemester == 0 ? "1st Sem" : $settingsData.schoolSemester == 1 ? "2nd Sem" : "Summer"} · "{greetings[messageIndex]}"</h2>
    </div>
    <nav class="grid grid-flow-col w-full self-center bg-gray-300">
      <button on:click={() => viewComponentValueChange(1)} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Courses</button>
      <button on:click={() => viewComponentValueChange(2)} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Rooms</button>
      <button on:click={() => viewComponentValueChange(3)} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Professors</button>
      <button on:click={() => viewComponentValueChange(4)} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Programs</button>
      <!-- <button on:click={() => viewComponentValueChange(5)} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Subjects</button> -->
      <button on:click={() => viewComponentValueChange(6)} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Schedules</button>
      <button on:click={() => viewComponentValueChange(7)} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Professor Overview</button>
    </nav>
  </div>

  <section class="flex flex-row justify-center flex-wrap">
    <div class="w-64 h-auto bg-gray-200 m-6 flex flex-col rounded-md drop-shadow-md">
      <h1 class="w-full py-4 bg-gray-300 text-3xl font-light text-center rounded-t-md drop-shadow-md">Courses</h1>
      <h2 class="text-center py-14 text-7xl font-thin">{ dashboardData.coursesNumber }</h2>
      <h3 class="w-full text-center text-2xl font-light py-2">Registered</h3>
    </div>
    <div class="w-64 h-auto bg-gray-200 m-6 flex flex-col rounded-md drop-shadow-md">
      <h1 class="w-full py-4 bg-gray-300 text-3xl font-light text-center rounded-t-md drop-shadow-md">Professors</h1>
      <h2 class="text-center py-14 text-7xl font-thin">{ dashboardData.professorsNumber }</h2>
      <h3 class="w-full text-center text-2xl font-light py-2">Registered</h3>
    </div>
    <div class="w-64 h-auto bg-gray-200 m-6 flex flex-col rounded-md drop-shadow-md">
      <h1 class="w-full py-4 bg-gray-300 text-3xl font-light text-center rounded-t-md drop-shadow-md">Rooms</h1>
      <h2 class="text-center py-14 text-7xl font-thin">{ dashboardData.roomsNumber }</h2>
      <h3 class="w-full text-center text-2xl font-light py-2">Registered</h3>
    </div>
    <div class="w-64 h-auto bg-gray-200 m-6 flex flex-col rounded-md drop-shadow-md">
      <h1 class="w-full py-4 bg-gray-300 text-3xl font-light text-center rounded-t-md drop-shadow-md">Programs</h1>
      <h2 class="text-center py-14 text-7xl font-thin">{ dashboardData.programsNumber }</h2>
      <h3 class="w-full text-center text-2xl font-light py-2">Registered</h3>
    </div>
    <!-- <div class="w-64 h-auto bg-gray-200 m-6 flex flex-col rounded-md drop-shadow-md">
      <h1 class="w-full py-4 bg-gray-300 text-3xl font-light text-center rounded-t-md drop-shadow-md">Subjects</h1>
      <h2 class="text-center py-14 text-7xl font-thin">{ dashboardData.subjectsNumber }</h2>
      <h3 class="w-full text-center text-2xl font-light py-2">Registered</h3>
    </div> -->
    <div class="w-64 h-auto bg-gray-200 m-6 flex flex-col rounded-md drop-shadow-md">
      <h1 class="w-full py-4 bg-gray-300 text-3xl font-light text-center rounded-t-md drop-shadow-md">Schedules</h1>
      <h2 class="text-center py-14 text-7xl font-thin">{ dashboardData.schedulesNumber }</h2>
      <h3 class="w-full text-center text-2xl font-light py-2">Registered</h3>
    </div>
  </section>
</div>