<script>
  const { ipcRenderer } = require("electron");
  import { selectedData, editWindowStatus, deleteWindowScheduleStatus, deleteWindowStatus, tbdData } from "../../stores/ui";
  import { onMount, onDestroy } from "svelte";
  let programSchedule;

  let editSelected = () => {
    console.log($selectedData);
    editWindowStatus.set(true);
  }
  let tbdSelected = (tbd) => {
    tbdData.set(tbd);
    deleteWindowScheduleStatus.set(true);
  }
  let exportExcel = () => {
    ipcRenderer.send("export-to-excel-program", $selectedData);
  }

  onMount(() => {
    console.log("Mounted");
    console.log($selectedData._id);
    ipcRenderer.send("retrieve-schedule-program-data", $selectedData._id);
  })
  onDestroy(() => {
    ipcRenderer.removeAllListeners("retrieve-schedule-program-data");
  })

  ipcRenderer.on("retrieve-schedule-program-data", (event, res) => {
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

    programSchedule = temporaryContainer;
  });
</script>

<svelte:head>
  <title>{$selectedData.name} {$selectedData.year}-{$selectedData.section}</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col">
  <div class="h-auto w-full bg-gray-200 rounded-md drop-shadow-md flex flex-col justify-end items-end">
    <div class="h-52 w-full p-4 flex flex-col justify-end hero">
      <h1 class="py-2 -my-2 text-4xl font-light whitespace-nowrap overflow-hidden text-ellipsis" title={$selectedData.name}>{$selectedData.name}</h1>
      <h3 class="mb-2 text-gray-700">{$selectedData.acronym} | Year: {$selectedData.year} | Section: {$selectedData.section}</h3>
    </div>
    <nav class="grid grid-flow-col w-full self-center bg-gray-300">
      <button on:click={() => window.print()} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Print</button>
      <button on:click={exportExcel} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Export</button>
      <button on:click={editSelected} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Edit</button>
      <button on:click={() => $deleteWindowStatus = true} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Delete</button>
    </nav>
  </div>

  {#if programSchedule}
    {#if programSchedule.length != 0}
      <div class="w-full p-8 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen-xl drop-shadow-md">
          <tr>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">A.Y.</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Time</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course Code</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Professor</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Room</th>
          </tr>
          {#each programSchedule as schedule (schedule._id)}
            <tr on:click={() => tbdSelected(schedule)}>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.year} - {parseInt(schedule.school.year) + 1}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.semester == 0 ? "1st Sem" : schedule.school.semester == 1 ? "2nd Sem" : "Summer"}</td>
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
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.name}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.courseData.name}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.professorData.gender == "male" ? "Mr." : "Ms."} {schedule.professorData.name.last}, {schedule.professorData.name.first}</td>
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
      width: 75%;
      height: 128px;
      padding-left: 0;
      padding-right: 0;
      align-self: flex-start;
    }
  }
</style>