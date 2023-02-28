<script>
    const { ipcRenderer } = require("electron");
    import 'material-icons/iconfont/material-icons.css';
    import { selectedData, editWindowStatus, deleteWindowScheduleStatus, deleteWindowStatus, courseData, roomData, programData, tbdData } from "../../stores/ui";
    import { onMount, onDestroy } from "svelte";
    let professorSchedules, remainingLoad = 0;
    
    let courseOrder = 0;
  
    let exportExcel = () => {
      ipcRenderer.send("export-to-excel", $selectedData);
    }
  
    onMount(() => {
      console.log("Mounted");
      console.log($selectedData._id);
      ipcRenderer.send("retrieve-professor-data-advisetime", $selectedData._id);
    });
    onDestroy(() => {
      console.log("Destroyed");
      ipcRenderer.removeAllListeners("retrieve-professor-data-advisetime");
      ipcRenderer.removeAllListeners("save-data-professor-advisetime");
    })
  
    // ipcRenderer.on("retrieve-professor-data-advisetime" , $selectedData._id, (event, res) => {
    ipcRenderer.on("retrieve-professor-data-advisetime", (event, res) => {
      console.log('retrieve-professor-data-advisetime');
      console.log(res);
      $selectedData = res[0];
      console.log(professorData);
    });

    ipcRenderer.on("save-data-professor-advisetime", (event, status) => {
      setTimeout(() => {
        if (status.success == true) {
          ipcRenderer.send("retrieve-professor-data-advisetime" , $selectedData._id);
          $selectedData.advisingTime = status.data;
        }        

        message = status.message;
        windowDisabled = false;
      }, 2000);
    }) 

    // let deleteSelected = () => {
    //   console.log('deleteSelected');
    //   // console.log(tbd);
    //   // tbdData.set(tbd);
    //   // deleteWindowScheduleStatus.set(true);
    //   scheduleData = tbd;
    //   scheduleData.type = 'delete';
    //   ipcRenderer.send("save-data-professor-advisetime", scheduleData);
    // }

    // let editSelected = (tbd) => {
    //   // console.log($selectedData);
    //   $tbd.day = tbd.day;
    //   $tbd.time.start.hours = tbd.time.start.hours;
    //   $tbd.time.start.minutes = tbd.time.start.minutes;
    //   $tbd.time.end.hours = tbd.time.end.hours;
    //   $tbd.time.end.minutes = tbd.time.end.minutes;

    //   tbdData.set(tbd);
    //   editWindowStatus.set(true);
    // }

    let tbdSelected = (tbd) => {
      console.log('deleteSelected');
      console.log(tbd);

      $selectedData.day = tbd.day;
      tbdData.set(tbd);
      deleteWindowStatus.set(true);
    }

    import { viewComponentValue, addWindowStatus } from "../../stores/ui";
    import { fly } from "svelte/transition";

    let addWindowStatusChange = () => addWindowStatus.set(!$addWindowStatus);
  </script>
  
  <svelte:head>
    <title>{$selectedData.name.last}, {$selectedData.name.first} Advising Time</title>
  </svelte:head>
  
  <div class="overflow-auto w-full h-full flex flex-col items-center">
    <div class="h-auto w-full bg-gray-200 rounded-md drop-shadow-md flex flex-col justify-end items-end">
      <div class="h-52 w-full p-4 flex flex-col justify-end hero">
        <h1 class="py-2 -my-2 text-4xl font-light whitespace-nowrap overflow-hidden text-ellipsis" title="{$selectedData.gender == "male" ? "Mr." : "Ms."} {$selectedData.name.last}, {$selectedData.name.first}">{$selectedData.gender == "male" ? "Mr." : "Ms."} {$selectedData.name.last}, {$selectedData.name.first}</h1>
        <h2 class="text-gray-700 w-full whitespace-nowrap overflow-hidden text-ellipsis" title={$selectedData.address}>{$selectedData.address}</h2>
        <h3 class="mb-2 text-gray-700">Employment : {$selectedData.employment.status} | Contact: {$selectedData.contact} | Load: {$selectedData.employment.hours} | Remaining: {$selectedData.employment.hours - remainingLoad} 
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
        <button on:click={addWindowStatusChange} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Add</button>
        <button on:click={() => window.print()} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Print</button>
        <button on:click={exportExcel} class="p-1 border-t-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Export</button>
      </nav>
    </div>
  
    {#if $selectedData.employment.status == "Full-Time"}
      {#if $selectedData.advisingTime && $selectedData.advisingTime.length != 0}
      <div class="w-full p-8 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen drop-shadow-md">
          <tr>
            <!-- <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light"></th> -->
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Start</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">End</th>
          </tr>
          {#each $selectedData.advisingTime as schedule (schedule._id)}
            <tr on:click={() => tbdSelected(schedule)}>
              <!-- <td class="py-3 px-2 text-left border border-gray-300 font-light">
                <button on:click={() => tbdSelected(schedule)}>Delete</button>
              </td> -->
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
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.time.start.hours > 12 ? schedule.time.start.hours - 12 : schedule.time.start.hours}:{schedule.time.start.minutes} {schedule.time.start.hours > 12 ? 'PM' : 'AM'}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.time.end.hours > 12 ? schedule.time.end.hours - 12 : schedule.time.end.hours}:{schedule.time.end.minutes} {schedule.time.end.hours > 12 ? 'PM' : 'AM'}</td>
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
        height: auto;
        padding-left: 0;
        padding-right: 0;
      }
    }
  </style>