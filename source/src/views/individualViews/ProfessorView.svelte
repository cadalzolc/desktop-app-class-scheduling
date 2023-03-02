<script>
  const { ipcRenderer } = require("electron");
  import 'material-icons/iconfont/material-icons.css';
  import { selectedData, editWindowStatus, deleteWindowScheduleStatus, deleteWindowStatus, courseData, roomData, programData, tbdData , settingsData } from "../../stores/ui";
  import { onMount, onDestroy } from "svelte";
  let professorSchedules, remainingLoad = 0;
  
  let courseOrder = 0;

  let filterSubjectsData = (course_filter = 0) => {
    if(course_filter == courseOrder) course_filter = 0;
    courseOrder = course_filter;
    ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id , courseOrder);
  };

  let editSelected = () => {
    editWindowStatus.set(true);
  }

  let tbdSelected = (tbd) => {
    tbdData.set(tbd);
    deleteWindowScheduleStatus.set(true);
  }

  let exportExcel = () => {
    ipcRenderer.send("export-to-excel", $selectedData);
  }

  ipcRenderer.on("retrieve-settings-data", (event, res) => {
    console.log(res)
    $settingsData.uid = res[0].uid;
    $settingsData.schoolYear = res[0].schoolYear;
    $settingsData.schoolSemester = res[0].schoolSemester;
    $settingsData.systemPassword = res[0].systemPassword;
    ipcRenderer.removeAllListeners("retrieve-settings-data");
  });

  onMount(() => {
    console.log($selectedData._id);
    ipcRenderer.send("retrieve-settings-data");
    ipcRenderer.send("retrieve-course-data");
    ipcRenderer.send("retrieve-room-data");
    ipcRenderer.send("retrieve-program-data");
    ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id);
  });
  
  onDestroy(() => {
    ipcRenderer.removeAllListeners("retrieve-course-data");
    ipcRenderer.removeAllListeners("retrieve-room-data");
    ipcRenderer.removeAllListeners("retrieve-program-data");
    ipcRenderer.removeAllListeners("retrieve-schedule-professor-data");
  })

  ipcRenderer.on("retrieve-course-data", (event, res) => $courseData = res);
  ipcRenderer.on("retrieve-room-data", (event, res) => $roomData = res);
  ipcRenderer.on("retrieve-program-data", (event, res) => $programData = res);
  ipcRenderer.on("retrieve-schedule-professor-data", (event, res) => {
    let temporaryContainer = res;
    temporaryContainer.forEach(temporaryTime => {
      if (temporaryTime.time.start.hours >= 13) {
        if (temporaryTime.time.start.hours % 12 < 10) temporaryTime.time.start.hours = "0" + temporaryTime.time.start.hours % 12;
        else temporaryTime.time.start.hours = temporaryTime.time.start.hours % 12;
        temporaryTime.time.start.minutes = `${temporaryTime.time.start.minutes} PM`;
      }
      else if (temporaryTime.time.start.hours % 12 == 0) {
        temporaryTime.time.start.hours = 12;
        if (temporaryTime.time.start.hours == 12) {
          temporaryTime.time.start.minutes = `${temporaryTime.time.start.minutes} PM`;
        } else temporaryTime.time.start.minutes = `${temporaryTime.time.start.minutes} AM`;
      }
      else {
        if (temporaryTime.time.start.hours % 12 < 10) temporaryTime.time.start.hours = "0" + temporaryTime.time.start.hours % 12;
        else temporaryTime.time.start.hours = temporaryTime.time.start.hours % 12;
        temporaryTime.time.start.minutes = `${temporaryTime.time.start.minutes} AM`;
      }

      if (temporaryTime.time.end.hours >= 13) {
        if (temporaryTime.time.end.hours % 12 < 10) temporaryTime.time.end.hours = "0" + temporaryTime.time.end.hours % 12;
        else temporaryTime.time.end.hours = temporaryTime.time.end.hours % 12;
        temporaryTime.time.end.minutes = `${temporaryTime.time.end.minutes} PM`;
      }
      else if (temporaryTime.time.end.hours % 12 == 0) {
        temporaryTime.time.end.hours = 12;
        if (temporaryTime.time.end.hours == 12) {
          temporaryTime.time.end.minutes = `${temporaryTime.time.end.minutes} PM`;
        } else temporaryTime.time.end.minutes = `${temporaryTime.time.end.minutes} AM`;
      }
      else {
        if (temporaryTime.time.end.hours % 12 < 10) temporaryTime.time.end.hours = "0" + temporaryTime.time.end.hours % 12;
        else temporaryTime.time.end.hours = temporaryTime.time.end.hours % 12;
        temporaryTime.time.end.minutes = `${temporaryTime.time.end.minutes} AM`;
      }
    });

    remainingLoad = 0;
    res.forEach((time) => {
      remainingLoad = remainingLoad + time.courseData.hours
    });

    professorSchedules = temporaryContainer;
  });


  import { sideMenuStatus, viewComponentValue } from "../../stores/ui";
  import { fade, fly } from "svelte/transition";

  let viewComponentValueChange = (i) => {
    viewComponentValue.set(i);
  };

</script>

<svelte:head>
  <title>{$selectedData.name.last}, {$selectedData.name.first}</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col items-center">
  <div class="h-auto w-full bg-gray-200 rounded-md drop-shadow-md flex flex-col justify-end items-end">
    <div class="h-52 w-full p-4 flex flex-col justify-end hero">
      <h1 class="py-2 -my-2 text-4xl font-light whitespace-nowrap overflow-hidden text-ellipsis" title="{$selectedData.gender == "male" ? "Mr." : "Ms."} {$selectedData.name.last}, {$selectedData.name.first}">{$selectedData.gender == "male" ? "Mr." : "Ms."} {$selectedData.name.last}, {$selectedData.name.first}</h1>
      <h2 class="text-gray-700 w-full whitespace-nowrap overflow-hidden text-ellipsis" title={$selectedData.address}>{$selectedData.address}</h2>
      <h3 class="mb-2 text-gray-700">Faculty ID : {$selectedData.id} | Employment : {$selectedData.employment.status} | Contact: {$selectedData.contact} | Email: {$selectedData.email} | Load: {$selectedData.employment.hours} | Remaining: {$selectedData.employment.hours - remainingLoad} 
      </h3>
      <h3>
        Status :
        { 
          $selectedData.status == "REGULAR" ? "Regular" :
          $selectedData.status == "PART TIME" ? "Part Time" :
          $selectedData.status == "TEMPORARY" ? "Temporary" :
          ""
        }
      </h3>
    </div>
    <nav class="grid grid-flow-col w-full self-center bg-gray-300">
      {#if $selectedData.employment.status == "Full-Time"}
        <button on:click={() => viewComponentValueChange(8)}>Manage Advise Time</button>
      {/if}      
      <button on:click={() => window.print()} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Print</button>
      <button on:click={exportExcel} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Export</button>
      <button on:click={editSelected} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Edit</button>
      <button on:click={() => $deleteWindowStatus = true} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Delete</button>
    </nav>
  </div>

  <div class="w-full p-12 flex justify-center pb-10 table-container" style="padding-top:15px"> A.Y. {$settingsData.schoolYear} - {parseInt($settingsData.schoolYear) + 1} {$settingsData.schoolSemester == 0 ? "1st Sem" : $settingsData.schoolSemester == 1 ? "2nd Sem" : "Summer"}</div>

  {#if professorSchedules}
    {#if professorSchedules.length != 0}
      <div class="w-full p-8 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen drop-shadow-md">
          <tr>
            <!-- <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">A.Y.</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th> -->
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Type</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Time</th>
            <!-- <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course Code</th> -->
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">
                <span style="float:left">
                    Course
                </span>
                
                <button on:click={() => filterSubjectsData(-1)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↑</span></button>
                <button on:click={() => filterSubjectsData(1)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↓</span></button>
            </th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Program</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Room</th>
          </tr>
          {#each professorSchedules as schedule (schedule._id)}
            <tr on:click={() => tbdSelected(schedule)}>
              <!-- <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.year} - {parseInt(schedule.school.year) + 1}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.semester == 0 ? "1st Sem" : schedule.school.semester == 1 ? "2nd Sem" : "Summer"}</td> -->
              <td class="py-3 px-2 text-left border border-gray-300 font-light">
                {
                  schedule.type == "REGULAR" ? "Regular" :
                  schedule.type == "SUBSTITUTE" ? "Substitute" :
                  schedule.type == "TEMPORARY SUBSTITUTE" ? "Temporary Substitute" :
                  schedule.type == "PART TIME" ? "Part Time" :
                  ""
                }
              </td>              
              <td class="py-3 px-2 text-left border border-gray-300 font-light">
                {
                  schedule.day == 0 ? "Monday" :
                  schedule.day == 1 ? "Tuesday" :
                  schedule.day == 2 ? "Wednesday" :
                  schedule.day == 3 ? "Thursday" :
                  schedule.day == 4 ? "Friday" :
                  schedule.day == 5 ? "Saturday" :
                  "Sunday"
                  
                }
               
              </td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.time.start.hours}:{schedule.time.start.minutes} - {schedule.time.end.hours}:{schedule.time.end.minutes}</td>
              <!-- <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.name}</td> -->
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.courseData.name}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.programData.acronym} {schedule.programData.year} - {schedule.programData.section}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.roomData.name}</td>
            </tr>
          {/each}
        </table>
      </div>
    {:else}
      <div class="w-full h-full p-8 flex justify-center items-center">
        <h1 class="text-4xl font-thin text-center">No data found.</h1>
      </div>
    {/if}
  {/if}

<!-- {#if $selectedData.employment.status == "Full-Time"}
    Advising Time List
    <nav class="grid grid-flow-col w-full self-center bg-gray-300">
      <button on:click={editSelected} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Edit</button>
    </nav>
      {#if $selectedData.advisingTime && $selectedData.advisingTime.schedules.length != 0}
      <div class="w-full p-8 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen drop-shadow-md">
          <tr>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Start</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">End</th>
          </tr>
          {#each $selectedData.advisingTime.schedules as schedule (schedule._id)}
            <tr>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">
                {
                  schedule.day == 0 ? "Monday" :
                  schedule.day == 1 ? "Tuesday" :
                  schedule.day == 2 ? "Wednesday" :
                  schedule.day == 3 ? "Thursday" :
                  schedule.day == 4 ? "Friday" :
                  schedule.day == 5 ? "Saturday" :
                  "Sunday"
                }
              </td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.time.start.hours}:{schedule.time.start.minutes}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.time.end.hours}:{schedule.time.end.minutes}</td>
            </tr>
          {/each}
        </table>
      </div>
    {:else}
      <div class="w-full h-full p-8 flex justify-center items-center">
        <h1 class="text-4xl font-thin text-center">No data found.</h1>
      </div>
    {/if}
{/if} -->
</div>

<style>
  tr:nth-child(even) {
    background-color: rgb(229 231 235);
  }
  tr:nth-child(odd) {
    background-color: white;
  }
  tr:hover {
    background-color: rgb(156 163 175);
    color: white
  }

  @media print {
    tr, th, td {
      background-color: white;
      color: black;
    }
    div {
      filter: none;
    }
    nav {
      color: transparent
    }
    table {
      filter: none;
      margin: 0;
      padding: 0;
    }
    .table-container {
      width: 100%;
      margin-top: -10px;
      padding: 0;
      padding-bottom: 10px;
    }
    .hero {
      height: auto;
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>