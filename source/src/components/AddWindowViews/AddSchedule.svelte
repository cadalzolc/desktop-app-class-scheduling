<script>
  const { ipcRenderer } = require("electron");
  import { range } from "../../utils/helpers"
  import { onMount, onDestroy } from 'svelte';
  import { addWindowStatus } from "../../stores/ui";
  import AlertDialog from "../AlertDialog.svelte";

  let alertOpen = false;
  let alertOptions = {
    success: false,
    message: "Alert Box"
  }
  let curSy;
  let scheduleData = {
    day: 0,
    name: '',
    type: 'FULLTIME',
    time: {start: {}, end: {}},
    school: {year: '', semester: ''},
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
  let timeRange = [], timeStart = "", timeStartPlaceholder = "--TIME START--", timeEnd = "", timeEndPlaceholder = "--TIME END--";

  onMount(() => {
    timeRange = generateTimeRange();
    ipcRenderer.send("professor-list");
    ipcRenderer.send("program-list");
    ipcRenderer.send("courses-list");
    ipcRenderer.send("room-list");
    ipcRenderer.send("sy-active");
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("save-data-schedule");
    ipcRenderer.removeAllListeners("professor-list");
    ipcRenderer.removeAllListeners("program-list");
    ipcRenderer.removeAllListeners("courses-list");
    ipcRenderer.removeAllListeners("room-list");
    ipcRenderer.removeAllListeners("sy-active");
  });

  ipcRenderer.on("sy-active", (e, res) => {
    if (res.success) {
      curSy = res.data;
      return;
    }
    alertOpen = true;
    alertOptions = {
      success: false,
      message: "No active School Year Semester. Go to settings and activate one"
    };
  });

  ipcRenderer.on("professor-list", (e, res) => {
      if (res.success) profsList = res.data;
  });

  ipcRenderer.on("program-list", (e, res) => {
    if (res.success) programList = res.data;
  });

  ipcRenderer.on("courses-list", (e, res) => {
    if (res.success) coursesList = res.data;
  });

  ipcRenderer.on("room-list", (e, res) => {
    if (res.success) roomList = res.data;
  });

  ipcRenderer.on("save-data-schedule", (e, res) => {
    windowDisabled = false;
    alertOpen = true;
    alertOptions = res;
    if (res.success) {
      daySelected = "";
      profInfo = "";
      programInfo = "";
      coursesInfo = "";
      roomInfo = "";
      timeStart = "";
      timeEnd = "";
      scheduleData = {
        day: 0,
        name: '',
        type: 'FULLTIME',
        time: {start: {}, end: {}},
        school: {year: '', semester: ''},
        courseData: {},
        professorData: {},
        programData: {},
        roomData: {}
      };
      ipcRenderer.send("retrieve-schedule-data");
    }
  });

  const addWindowStatusChange = () => addWindowStatus.set(!$addWindowStatus);
  const generateTimeRange = () => {
    let arr = [];
    Array.from(range(7, 12), (n) => {
      let H = (n < 10 && n > 0) ? ("0" + n) : n;
      if (n == 7) {
        arr.push({ _id: `${H}30AM`, value: `${H}:30 AM`, hour: n, minute: 30, tt: "AM", date: `2023-03-01 ${H}:30 AM` });
      } else {
        arr.push({ _id: `${H}00AM`, value: `${H}:00 AM`, hour: n, minute: 0, tt: "AM", date: `2023-03-01 ${H}:00 AM` });
        arr.push({ _id: `${H}30AM`, value: `${H}:30 AM`, hour: n, minute: 30, tt: "AM", date: `2023-03-01 ${H}:30 AM` });
      }
    });

    Array.from(range(1, 9), (n) => {
      let H = (n < 10 && n > 0) ? ("0" + n) : n;
      if (n == 9) {
        arr.push({ _id: `${H}00PM`, value: `${H}:00 PM`, hour: n, minute: 0, tt: "PM", date: `2023-03-01 ${H}:00 PM` });
      } else {
        arr.push({ _id: `${H}00PM`, value: `${H}:00 PM`, hour: n, minute: 0, tt: "PM", date: `2023-03-01 ${H}:00 PM` });
        arr.push({ _id: `${H}30PM`, value: `${H}:30 PM`, hour: n, minute: 30, tt: "PM", date: `2023-03-01 ${H}:30 PM` });
      }
    });
    return arr;
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

    const tym1 = timeRange.find(p => p._id == timeStart);
    const tym2 = timeRange.find(p => p._id == timeEnd);

    scheduleData.school.year = curSy.schoolYear;
    scheduleData.school.semester = curSy.schoolSemester;
    scheduleData.time.start = { hours: parseInt(tym1.hour), minutes: parseInt(tym1.minute), zone: tym1.tt };
    scheduleData.time.end = { hours: parseInt(tym2.hour), minutes: parseInt(tym2.minute), zone: tym2.tt  };

    const date1 = new Date(tym1.date);
    const date2 = new Date(tym2.date);
    const diff = date2.getTime() - date1.getTime();
    const val = (((diff / 1000) / 60) / 60);

    if (val < 1.0 || val > 5.0) {
      windowDisabled = false;
      alertOpen = true;
      alertOptions = {
        success: false,
        message: "A minimum of 1 hour or maximum of 5 hours schedule is required"
      };
      return;
    }

    ipcRenderer.send("save-data-schedule", scheduleData);

    return false;
  };

</script>

<AlertDialog bind:alertOpen bind:alertOptions />

<form method="post" on:submit|preventDefault={onSubmitSchedule}>

  <div class="w-full h-full flex flex-col">

    <div class="w-full flex flex-row mt-2">
      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">School Year:</p>
        <div class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if curSy}
            {curSy.schoolYear} {curSy.schoolSemester}
          {:else}
            No active school year semester
          {/if}
        </div>
      </div>
    </div>
    
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
        <select bind:value={timeStart} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if timeStartPlaceholder}
            <option value="" disabled selected>{timeStartPlaceholder}</option>
          {/if}
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
        <select bind:value={timeEnd} disabled={windowDisabled} required class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          {#if timeEndPlaceholder}
            <option value="" disabled selected>{timeEndPlaceholder}</option>
          {/if}
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
    {#if curSy}
      <button type="submt" disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
    {/if}  
  </div>
</form>