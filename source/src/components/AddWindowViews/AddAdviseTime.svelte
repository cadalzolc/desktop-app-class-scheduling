<script>
const { ipcRenderer } = require("electron");

import { onDestroy } from "svelte";
import { addWindowStatus , selectedData } from "../../stores/ui";
import AlertDialog from "../AlertDialog.svelte";

let alertOpen = false;
let alertOptions = {
  success: false,
  message: "Alert Box"
};

let message = "", windowDisabled = false, fieldDisabled = false;
let scheduleTimeHourStart, scheduleTimeMinuteStart, scheduleTimePostfixStart, scheduleTimeHourEnd, scheduleTimeMinuteEnd, scheduleTimePostfixEnd, scheduleCourse, scheduleProgram, scheduleRoom;
let scheduleData = {
    type : 'add',
    _id: $selectedData._id,
    day: 0,
    time: {
        start: {
            hours: 0,
            minutes: 0,
        },
        end: {
            hours: 0,
            minutes: 0,
        }
    },
}
  
let addWindowStatusChange = () => addWindowStatus.set(!$addWindowStatus);
let saveData = () => {
    if (scheduleTimePostfixStart == "PM") {
        if (scheduleTimeHourStart != 12)
        scheduleData.time.start.hours = scheduleTimeHourStart + 12;
        else scheduleData.time.start.hours = 12;
    } else {
        if (scheduleTimeHourStart + 12 == 24) {
        scheduleData.time.start.hours = 0;
        } else {
        scheduleData.time.start.hours = scheduleTimeHourStart;
        }
    }
    if (scheduleTimePostfixEnd == "PM") {
        if (scheduleTimeHourEnd != 12)
        scheduleData.time.end.hours = scheduleTimeHourEnd + 12;
        else scheduleData.time.end.hours = 12;
    } else {
        if (scheduleTimeHourEnd + 12 == 24) {
        scheduleData.time.end.hours = 0;
        } else {
        scheduleData.time.end.hours = scheduleTimeHourEnd;
        }
    }
    scheduleData.time.start.minutes = scheduleTimeMinuteStart;
    scheduleData.time.end.minutes = scheduleTimeMinuteEnd;
    scheduleData.type = 'add';

    windowDisabled = true;

    ipcRenderer.send("save-data-professor-advisetime", scheduleData);
};

ipcRenderer.on("save-data-professor-advisetime", (e, res) => {
  windowDisabled = false;
  alertOpen = true;
  alertOptions = res;
  if (res.success) {        
    scheduleData = {
        _id: $selectedData._id,
        type : 'add',
        day: 0,
        time: {
            start: {
                hours: 0,
                minutes: 0,
            },
            end: {
                hours: 0,
                minutes: 0,
            }
        },
    }
    $selectedData.advisingTime = res.data;
    ipcRenderer.send("retrieve-professor-data-advisetime" , $selectedData._id);
  } 
})

onDestroy(() => {
  ipcRenderer.removeAllListeners("save-data-professor-advisetime");
})
</script>

<AlertDialog bind:alertOpen bind:alertOptions />
  
<div class="w-full h-full flex flex-col">
  <div class="w-full flex flex-row">
      <div class="w-full flex flex-col">
        <p class="px-2 mx-2 rounded-md font-light">Select Day:</p>
        <select bind:value={scheduleData.day} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
          <option value="0" class="font-light">Monday</option>
          <option value="1" class="font-light">Tuesday</option>
          <option value="2" class="font-light">Wednesday</option>
          <option value="3" class="font-light">Thursday</option>
          <option value="4" class="font-light">Friday</option>
        </select>
      </div>
  </div>
  <p class="px-2 mx-2 rounded-md font-light">Select Start Time:</p>
  <div class="w-full flex items-center">
    <select bind:value={scheduleTimeHourStart} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 w-full drop-shadow-md rounded-md font-light">
      {#each Array(12) as _, i}
        <option value="{i + 1}" class="font-light">{i + 1}</option>
      {/each}
    </select>
    <p class="mb-2">:</p>
    <select bind:value={scheduleTimeMinuteStart} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 w-full drop-shadow-md rounded-md font-light">
      <option value={"00"} class="font-light">00</option>
      <option value={"30"} class="font-light">30</option>
    </select>
    <select bind:value={scheduleTimePostfixStart} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 w-full drop-shadow-md rounded-md font-light">
      <option value="AM" class="font-light">AM</option>
      <option value="PM" class="font-light">PM</option>
    </select>
  </div>
  <p class="px-2 mx-2 rounded-md font-light">Select End Time:</p>
  <div class="w-full flex items-center">
    <select bind:value={scheduleTimeHourEnd} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 w-full drop-shadow-md rounded-md font-light">
      {#each Array(12) as _, i}
        <option value="{i + 1}" class="font-light">{i + 1}</option>
      {/each}
    </select>
    <p class="mb-2">:</p>
    <select bind:value={scheduleTimeMinuteEnd} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 w-full drop-shadow-md rounded-md font-light">
      <option value={"00"} class="font-light">00</option>
      <option value={"30"} class="font-light">30</option>
    </select>
    <select bind:value={scheduleTimePostfixEnd} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 w-full drop-shadow-md rounded-md font-light">
      <option value="AM" class="font-light">AM</option>
      <option value="PM" class="font-light">PM</option>
    </select>
  </div>    
  <p class="w-full text-center font-light m-2">{message}</p>
</div>

<div class="flex flex-row justify-end">
  <button on:click={addWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
  <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
</div>