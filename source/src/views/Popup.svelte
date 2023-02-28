<script>
    // export let message = 'Default message';
    const { ipcRenderer } = require("electron");
    import 'material-icons/iconfont/material-icons.css';
    import { selectedData } from '../stores/ui';
    import { onMount, onDestroy } from 'svelte';

    export let professor = {};
    let professorSchedules, remainingLoad = 0;

    console.log(professor);

    onMount(() => {
        console.log("Mounted");
        console.log(professor._id);
        ipcRenderer.send("retrieve-schedule-professor-data", professor._id);
    });

    onDestroy(() => {
        console.log("Destroyed");
        ipcRenderer.removeAllListeners("retrieve-schedule-professor-data");
    })

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
</script>
  
<style>
h2 {
        font-size: 2rem;
        text-align: center;
    }
</style>
  
<div class="overflow-auto w-full h-full flex flex-col items-center">
    <div class="h-auto w-full bg-gray-200 rounded-md drop-shadow-md flex flex-col justify-end items-end">
        <div class="h-52 w-full p-4 flex flex-col justify-end hero">
          <h1 class="py-2 -my-2 text-4xl font-light whitespace-nowrap overflow-hidden text-ellipsis" title="{professor.gender == "male" ? "Mr." : "Ms."} {professor.name.last}, {professor.name.first}">{professor.gender == "male" ? "Mr." : "Ms."} {professor.name.last}, {professor.name.first}</h1>
          <h2 class="text-gray-700 w-full whitespace-nowrap overflow-hidden text-ellipsis" title={professor.address}>{professor.address}</h2>
          <h3 class="mb-2 text-gray-700">Employement : {professor.employment.status} | Contact: {professor.contact} | Load: {professor.employment.hours} | Remaining: {professor.employment.hours - remainingLoad} | 
          Status :
          { 
            professor.status == "REGULAR" ? "Regular" :
            professor.status == "PART TIME" ? "Part Time" :
            professor.status == "TEMPORARY" ? "Temporary" :
            ""
          }
          </h3>
        </div>
    </div>

    {#if professorSchedules}
        {#if professorSchedules.length != 0}
        <div class="w-full p-8 flex justify-center pb-20 table-container">
            <table class="w-full max-w-screen drop-shadow-md">
            <tr>
                <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">A.Y.</th>
                <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th>
                <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Type</th>
                <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course Code</th>
                <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">
                    <span style="float:left">
                        Course
                    </span>
                </th>
            </tr>
            {#each professorSchedules as schedule (schedule._id)}
                <tr>
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
                <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.name}</td>
                <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.courseData.name}</td>
                </tr>
            {/each}
            </table>
        </div>
        {:else}
        <div class="w-full h-full p-8 flex justify-center items-center">
            <h1 class="text-4xl font-thin text-center">No schedules found.</h1>
        </div>
        {/if}
    {/if}      
</div>