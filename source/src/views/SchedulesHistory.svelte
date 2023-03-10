<script>
const { ipcRenderer } = require("electron");
import { onMount, onDestroy } from 'svelte';

let scheduleData = [];
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",  "Sunday"];

onMount(() => {
  ipcRenderer.send("schedule-history-list");
});

onDestroy(() => {
  ipcRenderer.removeAllListeners("schedule-history-list");
})

ipcRenderer.on("schedule-history-list", (event, res) => {
  if (res.success) {
    scheduleData = res.data;;
  }
});
  </script>
  
  <svelte:head>
    <title>.dotSystems - Schedule History</title>
  </svelte:head>
  
  <div class="overflow-auto w-full h-full flex flex-col pb-20">
  
    <div style="margin-top: 10px;">
      <div class="w-full p-2 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen drop-shadow-md table-excel">
          <thead>
            <tr>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Status</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Professor</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">A.Y.</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Type</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Time</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Program</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Room</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Time Stamp</th>
            </tr>
          </thead>
          <tbody>
            {#if !scheduleData}
            <tr>
              <td colspan="20">No record to display.</td>
            </tr>
            {:else if scheduleData.length == 0}
              <tr>
                <td colspan="20">No record to display.</td>
              </tr>
            {:else}
              {#each scheduleData as row}
                <tr>
                  <td>Deleted</td>
                  <td>{row.schedule.professorData.name.last} {row.schedule.professorData.name.first}</td>
                  <td>{row.schedule.school.year}</td>
                  <td>{row.schedule.school.semester}</td>
                  <td><span style="text-transform:capitalize;">{row.schedule.type}</span></td>
                  <td>{days[row.schedule.day]}</td>
                  <td>
                    {(row.schedule.time.start.hours < 10 && row.schedule.time.start.hours >= 0) ? ("0" + row.schedule.time.start.hours) : row.schedule.time.start.hours}:
                    {(row.schedule.time.start.minutes < 10 && row.schedule.time.start.minutes >= 0) ? ("0" + row.schedule.time.start.minutes) : row.schedule.time.start.minutes} 
                    {row.schedule.time.start.zone} 
                    -
                    {(row.schedule.time.end.hours < 10 && row.schedule.time.end.hours >= 0) ? ("0" + row.schedule.time.end.hours) : row.schedule.time.end.hours}:
                    {(row.schedule.time.end.minutes < 10 && row.schedule.time.end.minutes >= 0) ? ("0" + row.schedule.time.end.minutes) : row.schedule.time.end.minutes} 
                    {row.schedule.time.end.zone}</td>
                  <td>{row.schedule.courseData.name}</td>
                  <td>{row.schedule.programData.acronym} {row.schedule.programData.year} - {row.schedule.programData.section}</td>
                  <td>{row.schedule.roomData.name}</td>
                  <td>{row.stamp}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  
  </div>