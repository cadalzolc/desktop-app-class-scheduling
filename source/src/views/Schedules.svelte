<script>
const { ipcRenderer } = require("electron");

import { onMount, onDestroy } from 'svelte';
import ConfirmDialog from "../components/ConfirmDialog.svelte"

let scheduleData = [] , search = "", courseOrder = 0;
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",  "Sunday"];
let arrSelected = [];

let filterSubjectsData = (course_filter = 0 , search = '') => {
    if(course_filter == courseOrder) course_filter = 0;
    courseOrder = course_filter;
    ipcRenderer.send("retrieve-schedule-data", courseOrder , search);
};

onMount(() => {
  ipcRenderer.send("schedule-list");
});

onDestroy(() => {
  ipcRenderer.removeAllListeners("schedule-list");
  ipcRenderer.removeAllListeners("retrieve-schedule-data");
  ipcRenderer.removeAllListeners("schedule-delete-single");
})

ipcRenderer.on("schedule-list", (event, res) => {
  if (res.success = false) return;
  scheduleData = res.data;
  if (scheduleData) {
    arrSelected.forEach((obj) => scheduleData.push({
        selected: false,
        id: obj._id
    }));
  }
});

ipcRenderer.on("retrieve-schedule-data", (event, res) => {
  if (res.success = false) return;
  scheduleData = res.data;
  if (scheduleData) {
    arrSelected.forEach((obj) => scheduleData.push({
        selected: false,
        id: obj._id
    }));
  }
});

ipcRenderer.on("schedule-delete-single", (event, res) => {
  if (res.success = false) return;
  ipcRenderer.send("schedule-list");
});

const onDeleteSchedule = (id) => {
  const payload = scheduleData.find(r => r._id === id);
  if (payload) {
    ipcRenderer.send("schedule-delete-single", payload);
  }
}

</script>
  
<svelte:head>
  <title>.dotSystems - Schedules</title>
</svelte:head>
  
<div class="overflow-auto w-full h-full flex flex-col pb-20">


    <div class="w-full flex">
        <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search" id="search" placeholder="Search By Subject / Course / Professor / Program / Room" />
        <button on:click={filterSubjectsData( courseOrder , search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
    </div>

    <div style="margin-top: 10px;">
      <div class="w-full p-2 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen drop-shadow-md table-excel">
          <thead>
            <tr>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light" style="width: 30px;"></th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Professor</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">A.Y.</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Type</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Day</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Time</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">
                <span style="float:left">
                      Program
                  </span>
                  <button on:click={() => filterSubjectsData(-1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↓</span></button>
                  <button on:click={() => filterSubjectsData(1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↑</span></button>
                </th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Room</th>
              <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">
                <span style="float:left">
                    Course
                </span>
                <button on:click={() => filterSubjectsData(-1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↓</span></button>
                <button on:click={() => filterSubjectsData(1 , search)} style="float:right" class="border-none px-1 drop-shadow-md font-light bg-red-800 active:bg-red-900 hover:bg-red-700 active:text-white"><span class="border-none material-icons">↑</span></button>
              </th>
            </tr>
          </thead>
          <tbody>
            {#if !scheduleData}
              <tr>
                <td colspan="20">No record to display. Please add a schedule.</td>
              </tr>
            {:else if scheduleData.length == 0}
              <tr>
                <td colspan="20">No record to display. Please add a schedule.</td>
              </tr>
            {:else}
              {#each scheduleData as row}
                <tr>
                    <td class="center">
                      <ConfirmDialog confirmTitle="Delete" cancelTitle="Cancel" let:confirm="{confirmThis}">
                        <svg on:click="{() => confirmThis(onDeleteSchedule, row._id)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <title>Delete</title>
                          <path d="M20.37,8.91L19.37,10.64L7.24,3.64L8.24,1.91L11.28,3.66L12.64,3.29L16.97,5.79L17.34,7.16L20.37,8.91M6,19V7H11.07L18,11V19A2,2 0 0,1 16,21H8A2,2 0 0,1 6,19M8,19H16V12.2L10.46,9H8V19Z" />
                        </svg>
                        <span slot="title">Delete this professor schedule?</span>
                        <span slot="description">You will be deleting the school year semester 
                          <strong>
                            {row.professorData.name.last} 
                            {row.professorData.name.first} - 
                            {row.courseData.name} {row.programData.acronym} {row.programData.year} - 
                            {row.programData.section} 
                            [
                              {(row.time.start.hours < 10 && row.time.start.hours >= 0) ? ("0" + row.time.start.hours) : row.time.start.hours}:
                              {(row.time.start.minutes < 10 && row.time.start.minutes >= 0) ? ("0" + row.time.start.minutes) : row.time.start.minutes} 
                              {row.time.start.zone} - 
                              {(row.time.end.hours < 10 && row.time.end.hours >= 0) ? ("0" + row.time.end.hours) : row.time.end.hours}:
                              {(row.time.end.minutes < 10 && row.time.end.minutes >= 0) ? ("0" + row.time.end.minutes) : row.time.end.minutes} 
                              {row.time.end.zone}
                            ]
                          </strong>!
                      </span>
                    </ConfirmDialog>
                    </td>
                    <td>{row.professorData.name.last} {row.professorData.name.first}</td>
                    <td>{row.school.year}</td>
                    <td>{row.school.semester}</td>
                    <td><span style="text-transform:capitalize;">{row.type}</span></td>
                    <td>{days[row.day]}</td>
                    <td>
                      {(row.time.start.hours < 10 && row.time.start.hours >= 0) ? ("0" + row.time.start.hours) : row.time.start.hours}:
                      {(row.time.start.minutes < 10 && row.time.start.minutes >= 0) ? ("0" + row.time.start.minutes) : row.time.start.minutes} 
                      {row.time.start.zone} - 
                      {(row.time.end.hours < 10 && row.time.end.hours >= 0) ? ("0" + row.time.end.hours) : row.time.end.hours}:
                      {(row.time.end.minutes < 10 && row.time.end.minutes >= 0) ? ("0" + row.time.end.minutes) : row.time.end.minutes} 
                      {row.time.end.zone}
                    </td>
                    <td>{row.courseData.name}</td>
                    <td>{row.programData.acronym} {row.programData.year} - {row.programData.section}</td>
                    <td>{row.roomData.name}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>

</div>
