<script>
    const { ipcRenderer } = require("electron");
    import { selectedData , editWindowStatus, deleteWindowScheduleStatus, deleteWindowStatus, tbdData , } from '../stores/ui';
    import { onMount, onDestroy } from 'svelte';
    let scheduleData , search = "";
  
    let courseOrder = 0;

    let filterSubjectsData = (course_filter = 0 , search = '') => {
        if(course_filter == courseOrder) course_filter = 0;

        courseOrder = course_filter;
        console.log('subject filter : ' + courseOrder);
        ipcRenderer.send("retrieve-schedule-data", courseOrder , search);
    };

    let editSelected = () => {
        console.log($selectedData);
        editWindowStatus.set(true);
    }

    let tbdSelected = (tbd) => {
        tbdData.set(tbd);
        deleteWindowScheduleStatus.set(true);
    }

    let exportExcel = () => {
        ipcRenderer.send("export-to-excel", $selectedData);
    }

    onMount(() => {
        ipcRenderer.send("retrieve-schedule-data");
    });

    ipcRenderer.on("retrieve-schedule-data", (event, res) => {
      scheduleData = res;
      console.log(scheduleData);
    });
  
    let selectData = (data) => {
      $selectedData = data;
    }
  
    onDestroy(() => {
      ipcRenderer.removeAllListeners("retrieve-schedule-data");
    })
  </script>
  
  <svelte:head>
    <title>.dotSystems - Schedules</title>
  </svelte:head>
  
<div class="overflow-auto w-full h-full flex flex-col pb-20">
    <div class="w-full flex">
        <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search" id="search" placeholder="Search By Subject / Course / Professor / Program / Room" />
        <button on:click={filterSubjectsData( courseOrder , search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
    </div>
    {#if scheduleData}
    {#if scheduleData.length != 0}
      <div class="w-full p-2 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen drop-shadow-md">
          <tr>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Professor</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">A.Y.</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Type</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Time</th>
            <!-- <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course Code</th> -->
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">
                <span style="float:left">
                    Course
                </span>
                
                <button on:click={() => filterSubjectsData(-1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↓</span></button>
                <button on:click={() => filterSubjectsData(1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↑</span></button>
            </th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">
              <span style="float:left">
                    Program
                </span>
                
                <button on:click={() => filterSubjectsData(-1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↓</span></button>
                <button on:click={() => filterSubjectsData(1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↑</span></button>
              </th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Room</th>
          </tr>
          {#each scheduleData as schedule (schedule._id)}
            <tr on:click={() => tbdSelected(schedule)}>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.professorData.name.last} {schedule.professorData.name.first}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.year} - {parseInt(schedule.school.year) + 1}</td>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.school.semester == 0 ? "1st Sem" : schedule.school.semester == 1 ? "2nd Sem" : "Summer"}</td>              
              <td class="py-3 px-2 text-left border border-gray-300 font-light">
                {
                  schedule.type == "REGULAR" ? "Regular" :
                  schedule.type == "SUBSTITUTE" ? "Substitute" :
                  schedule.type == "TEMPORARY SUBSTITUTE" ? "Temporary Substitute" :
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
</div>
