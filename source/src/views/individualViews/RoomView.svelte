<script>
  const { ipcRenderer } = require("electron");
  import { selectedData, editWindowStatus, deleteWindowScheduleStatus, deleteWindowStatus,tbdData } from "../../stores/ui";
  import { onMount, onDestroy } from "svelte";
  let roomSchedule, daySelected = -1, scheduleExist = false;
  let mondaySchedule = [], tuesdaySchedule = [], wednesdaySchedule = [], thursdaySchedule = [], fridaySchedule = [], saturdaySchedule = [], sundaySchedule = [];

  let editSelected = () => {
    console.log($selectedData);
    editWindowStatus.set(true);
  }
  let tbdSelected = (tbd) => {
    tbdData.set(tbd);
    deleteWindowScheduleStatus.set(true);
  }
  let exportExcel = () => {
    ipcRenderer.send("export-to-excel-room", $selectedData);
  }

  onMount(() => {
    console.log("Mounted");
    console.log($selectedData._id);
    ipcRenderer.send("retrieve-schedule-room-data", $selectedData._id);
  });
  onDestroy(() => {
    console.log("Destroyed");
    ipcRenderer.removeAllListeners("retrieve-schedule-room-data");
  })

  ipcRenderer.on("retrieve-schedule-room-data", (event, res) => {
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

    temporaryContainer.forEach((daySort) => {
      switch (daySort.day) {
        case 0:
          mondaySchedule.push(daySort);
          scheduleExist = true;
          break;
        case 1:
          tuesdaySchedule.push(daySort);
          scheduleExist = true;
          break;
        case 2:
          wednesdaySchedule.push(daySort);
          scheduleExist = true;
          break;
        case 3:
          thursdaySchedule.push(daySort);
          scheduleExist = true;
          break;
        case 4:
          fridaySchedule.push(daySort);
          scheduleExist = true;
          break;
        case 5:
          saturdaySchedule.push(daySort);
          scheduleExist = true;
          break;
        case 6:
          sundaySchedule.push(daySort);
          scheduleExist = true;
          break;
      }
    })

    roomSchedule = [...mondaySchedule, ...tuesdaySchedule, ...wednesdaySchedule, ...thursdaySchedule, ...fridaySchedule,  ...saturdaySchedule, ...sundaySchedule];
    console.log(roomSchedule)
  })

  $: switch (daySelected) {
    case -1:
      roomSchedule = [...mondaySchedule, ...tuesdaySchedule, ...wednesdaySchedule, ...thursdaySchedule, ...fridaySchedule,  ...saturdaySchedule, ...sundaySchedule];
      break;
    case 0:
      roomSchedule = mondaySchedule;
      break;
    case 1:
      roomSchedule = tuesdaySchedule
      break;
    case 2:
      roomSchedule = wednesdaySchedule;
      break;
    case 3:
      roomSchedule = thursdaySchedule;
      break;
    case 4:
      roomSchedule = fridaySchedule;
      break;
    case 5:
      roomSchedule = saturdaySchedule;
      break;
    case 6:
      roomSchedule = sundaySchedule;
      break;
  }
</script>

<svelte:head>
  <title>{$selectedData.name}</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col">
  <div class="h-auto w-full bg-gray-200 rounded-md drop-shadow-md flex flex-col justify-end items-end">
    <div class="h-52 w-full p-4 flex flex-col justify-end hero">
      <h1 class="py-2 -my-2 text-4xl font-light whitespace-nowrap overflow-hidden text-ellipsis" title={$selectedData.name}>{$selectedData.name}</h1>
    </div>
    <nav class="grid grid-flow-col w-full self-center bg-gray-300">
      <button on:click={() => { window.print() }} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Print</button>
      <button on:click={exportExcel} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Export</button>
      <button on:click={editSelected} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Edit</button>
      <button on:click={() => $deleteWindowStatus = true} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Delete</button>
    </nav>
  </div>

  {#if scheduleExist}
    <div class="w-full p-8 pb-3 max-w-screen-lg flex flex-row justify-evenly self-center day-navigation">
      <button on:click={() => daySelected = -1} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != -1} class:bg-yellow-400={daySelected == -1}>All</button>
      <button on:click={() => daySelected = 6} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != 6} class:bg-yellow-400={daySelected == 6}>Sunday</button>
      <button on:click={() => daySelected = 0} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != 0} class:bg-yellow-400={daySelected == 0}>Monday</button>
      <button on:click={() => daySelected = 1} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != 1} class:bg-yellow-400={daySelected == 1}>Tuesday</button>
      <button on:click={() => daySelected = 2} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != 2} class:bg-yellow-400={daySelected == 2}>Wednesday</button>
      <button on:click={() => daySelected = 3} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != 3} class:bg-yellow-400={daySelected == 3}>Thursday</button>
      <button on:click={() => daySelected = 4} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != 4} class:bg-yellow-400={daySelected == 4}>Friday</button>
      <button on:click={() => daySelected = 5} class="w-full p-1 mx-2 rounded-full drop-shadow-md text-white" class:bg-red-800={daySelected != 5} class:bg-yellow-400={daySelected == 5}>Saturday</button>
    </div>
    {#if roomSchedule.length != 0}
      <div class="w-full p-8 pt-0 flex flex-col justify-center pb-20 table-container">
        <table class="w-full max-w-screen-xl drop-shadow-md justify-self-center self-center">
          <tr>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">A.Y.</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th>
            {#if daySelected == -1}
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
            {/if}
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Time</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course Code</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Professor</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Program</th>
          </tr>
          {#each roomSchedule as schedule (schedule._id)}
            <tr on:click={() => tbdSelected(schedule)}>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.year} - {parseInt(schedule.school.year) + 1}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.semester == 0 ? "1st Sem" : schedule.school.semester == 1 ? "2nd Sem" : "Summer"}</td>
              {#if daySelected == -1}
                <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.day == 0 ? "Monday" : schedule.day == 1 ? "Tuesday" : schedule.day == 2 ? "Wednesday" : schedule.day == 3 ? "Thursday" : schedule.day == 4 ? "Friday" : schedule.day == 5 ? "Saturday" : "Sunday"}</td>
              {/if}
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.time.start.hours}:{schedule.time.start.minutes} - {schedule.time.end.hours}:{schedule.time.end.minutes}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.name}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.courseData.name}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.professorData.gender == "male" ? "Mr." : "Ms."} {schedule.professorData.name.last}, {schedule.professorData.name.first}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.programData.acronym} {schedule.programData.year} - {schedule.programData.section}</td>
            </tr>
          {/each}
        </table>
      </div>
    {:else}
      <div class="w-full h-full p-8 flex justify-center items-center">
        <h1 class="text-4xl font-thin text-center">No data found.</h1>
      </div>
    {/if}
  {:else}
    <div class="w-full h-full p-8 flex justify-center items-center">
      <h1 class="text-4xl font-thin text-center">No data found.</h1>
    </div>
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
    .day-navigation {
      display: none;
    }
  }
</style>