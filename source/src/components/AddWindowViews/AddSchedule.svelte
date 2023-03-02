<script>
  const { ipcRenderer } = require("electron");
  import { range } from "../../utils/helpers"
  import { onMount, onDestroy } from 'svelte';
  import { 
    addWindowStatus,  
    settingsData,
  } from "../../stores/ui";

  let scheduleData = {
    day: 0,
    name: '',
    type: 'FULLTIME',
    time: {start: {}, end: {}},
    school: {
      year: $settingsData.schoolYear,
      semester: $settingsData.schoolSemester,
    },
    courseData: {},
    professorData: {},
    programData: {},
    roomData: {}
  };
  let message = "", windowDisabled = false, fieldDisabled = false;
  let dayPlaceholder = "--DAY--", daySelected = "";
  let profsList = [], profInfo = "", profPlaceholder = "--SELECT EMPLOYEE--";
  let programList = [], programInfo = "", programPlaceholder = "--SELECT PROGGAM--";
  let coursesList = [], coursesInfo = "", coursesPlaceholder = "--SELECT COURSE--";
  let roomList = [], roomInfo = "", roomPlaceholder = "--SELECT ROOM--";
  let timeRange = [], timeStart = "0700AM", timeEnd = "0700AM";

  let addWindowStatusChange = () => addWindowStatus.set(!$addWindowStatus);

  onMount(() => {
    timeRange = generateTimeRange();
    ipcRenderer.send("get-professor-list");
    ipcRenderer.send("get-program-list");
    ipcRenderer.send("get-courses-list");
    ipcRenderer.send("get-room-list");
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("save-data-schedule");
    ipcRenderer.removeAllListeners("get-professor-list");
    ipcRenderer.removeAllListeners("get-program-list");
    ipcRenderer.removeAllListeners("get-courses-list");
    ipcRenderer.removeAllListeners("get-room-list");
  });

  ipcRenderer.on("get-professor-list", (e, res) => {
      if (res.success) profsList = res.data;
  });
  ipcRenderer.on("get-program-list", (e, res) => {
    if (res.success) programList = res.data;
  });
  ipcRenderer.on("get-courses-list", (e, res) => {
    if (res.success) coursesList = res.data;
  });
  ipcRenderer.on("get-room-list", (e, res) => {
    if (res.success) roomList = res.data;
  });
  ipcRenderer.on("save-data-schedule", (e, res) => {
      windowDisabled = false;
      console.log(res);
  });
  const generateTimeRange = () => {
    let arr = [];
    Array.from(range(7, 12), (n) => {
      let H = (n < 10 && n > 0) ? ("0" + n) : n;
      if (n == 7) {
        arr.push({ _id: `${H}30AM`, value: `${H}:30 AM`, hour: n, minute: 30, tt: "AM" });
      } else {
        arr.push({ _id: `${H}00AM`, value: `${H}:00 AM`, hour: n, minute: 0, tt: "AM" });
        arr.push({ _id: `${H}30AM`, value: `${H}:30 AM`, hour: n, minute: 30, tt: "AM" });
      }
    });
    Array.from(range(1, 9), (n) => {
      let H = (n < 10 && n > 0) ? ("0" + n) : n;
      if (n == 9) {
        arr.push({ _id: `${H}00PM`, value: `${H}:00 PM`, hour: n, minute: 0, tt: "PM" });
      } else {
        arr.push({ _id: `${H}00PM`, value: `${H}:00 PM`, hour: n, minute: 0, tt: "PM" });
        arr.push({ _id: `${H}30PM`, value: `${H}:30 PM`, hour: n, minute: 30, tt: "PM" });
      }
    });
    return arr;
  }
  const handleTimeStart = () => {
    const tym = timeRange.find(p => p._id == timeStart);
    scheduleData.time.start = { hours: parseInt(tym.hour), minutes: parseInt(tym.minute) };
  }
  const handleTimeEnd = () => {
    const tym = timeRange.find(p => p._id == timeEnd);
    scheduleData.time.end = { hours: parseInt(tym.hour), minutes: parseInt(tym.minute) };
  }
  const handleDaySelection = () => {
    scheduleData.day = parseInt(daySelected);
  }
  const handleProfSelection = () => {
    const info = profsList.find(p => p._id == profInfo);
    scheduleData.professorData = info;
    scheduleData.type = info.status;
  }
  const handleProgramSelection = () => {
    scheduleData.programData = programList.find(p => p._id == programInfo);
  }
  const handleCourseSelection = () => {
    scheduleData.courseData = coursesList.find(p => p._id == coursesInfo);
  }
  const handleRoomSelection = () => {
    scheduleData.roomData = roomList.find(p => p._id == roomInfo);
  }
  const onSubmitSchedule = () => {
    windowDisabled = true;
    ipcRenderer.send("save-data-schedule", scheduleData);
    return false;
  };

</script>
<form method="post" on:submit|preventDefault={onSubmitSchedule}>
  <div class="w-full h-full flex flex-col">

    <div class="w-full flex flex-row mt-2">
      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">Select Professor:</p>
        <select bind:value={profInfo} on:change={handleProfSelection} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if profPlaceholder}
            <option value="" disabled selected>{profPlaceholder}</option>
          {/if}
          {#each profsList as prof}
            <option value={prof._id} class="font-light">{prof.name.last}, {prof.name.first} </option>
          {/each}
        </select>
     </div>
    </div>

    <div class="w-full flex flex-row mt-2">
      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">Select Day:</p>
        <select bind:value={daySelected} on:change={handleDaySelection} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if dayPlaceholder}
            <option value="" disabled selected>{dayPlaceholder}</option>
          {/if}
          <option value="0" class="font-light">Monday</option>
          <option value="1" class="font-light">Tuesday</option>
          <option value="2" class="font-light">Wednesday</option>
          <option value="3" class="font-light">Thursday</option>
          <option value="4" class="font-light">Friday</option>
          <option value="5" class="font-light">Saturday</option>
          <option value="6" class="font-light">Sunday</option>
        </select>
      </div>
    </div>

    <div class="w-full flex flex-row mt-2">
      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">Select Program:</p>
        <select bind:value={programInfo} on:change={handleProgramSelection} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if programPlaceholder}
          <option value="" disabled selected>{programPlaceholder}</option>
          {/if}
          {#each programList as row}
            <option value={row._id} class="font-light">{row.acronym} {row.year}-{row.section}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="w-full flex flex-row mt-2">
      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">Select Course:</p>
        <select bind:value={coursesInfo} on:change={handleCourseSelection} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if coursesPlaceholder}
            <option value="" disabled selected>{coursesPlaceholder}</option>
          {/if}
          {#each coursesList as row}
            <option value={row._id} class="font-light">{row.name} [{row.code}]</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="w-full flex flex-row mt-2">
      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">Select Room:</p>
        <select bind:value={roomInfo} on:change={handleRoomSelection} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if roomPlaceholder}
            <option value="" disabled selected>{roomPlaceholder}</option>
          {/if}
          {#each roomList as row}
            <option value={row._id} class="font-light">{row.name}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="w-full flex flex-row mt-2">
      <p class="px-2 mx-2 rounded-md font-light">Class Schedule:</p>
    </div>
    <div class="w-full flex flex-row mt-2">

      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">Start</p>
        <select bind:value={timeStart} on:change={handleTimeStart} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#each timeRange as row}
            {#if row._id == timeStart}
              <option value={row._id} selected>{row.value}</option>
            {:else}
              <option value={row._id} class="font-light">{row.value}</option>
            {/if}
          {/each}
        </select>
      </div>

      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">End</p>
        <select bind:value={timeEnd} on:change={handleTimeEnd} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#each timeRange as row}
            {#if row._id == timeEnd}
              <option value={row._id} selected>{row.value}</option>
            {:else}
              <option value={row._id} class="font-light">{row.value}</option>
            {/if}
          {/each}
        </select>
      </div>
      
    </div>

    <p class="w-full text-center font-light" style="color:red">{message}</p>
  </div>
  
  <div class="flex flex-row justify-end">
    <button type="button" on:click={addWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
    <button type="submt" disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
  </div>
</form>