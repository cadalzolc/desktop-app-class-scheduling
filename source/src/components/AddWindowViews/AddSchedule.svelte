<script>
    const { ipcRenderer } = require("electron");
    import { addWindowStatus, courseData, roomData, programData, selectedData, settingsData } from "../../stores/ui";
    import { onDestroy } from "svelte";
    let message = "", windowDisabled = false, fieldDisabled = false;
    let scheduleTimeHourStart, scheduleTimeMinuteStart, scheduleTimePostfixStart, scheduleTimeHourEnd, scheduleTimeMinuteEnd, scheduleTimePostfixEnd, scheduleCourse, scheduleProgram, scheduleRoom;
  
    let scheduleData = {
      day: 0,
      name: '',
      type: 'FULLTIME',
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
      school: {
        year: $settingsData.schoolYear,
        semester: $settingsData.schoolSemester,
      },
      courseData: {
        _id: "",
        name: "",
        code: "",
        units: "",
        hours: 0,
      },
      professorData: {
        _id: toString($selectedData._id),
        name: {
          first: $selectedData.name.first,
          last: $selectedData.name.first,
        },
        address: $selectedData.address,
        employment: {
          status: $selectedData.employment.status,
          hours: $selectedData.employment.hours,
        },
        gender: $selectedData.gender,
        contact: $selectedData.contact,
      },
      programData: {
        _id: "",
        name: "",
        acronym: "",
        year: "",
        section: "",
      },
      roomData: {
        _id: "",
        name: ""
      }
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
  
      scheduleData.courseData._id = $courseData[scheduleCourse]._id;
      scheduleData.courseData.name = $courseData[scheduleCourse].name;
      scheduleData.courseData.code = $courseData[scheduleCourse].code;
      scheduleData.courseData.units = $courseData[scheduleCourse].units;
      scheduleData.courseData.hours = $courseData[scheduleCourse].hours;
  
      scheduleData.professorData._id = $selectedData._id;
      scheduleData.professorData.name.first = $selectedData.name.first;
      scheduleData.professorData.name.last = $selectedData.name.last;
      scheduleData.professorData.address = $selectedData.address;
      scheduleData.professorData.employment.status = $selectedData.employment.status;
      scheduleData.professorData.employment.hours = $selectedData.employment.hours;
      scheduleData.professorData.gender = $selectedData.gender;
      scheduleData.professorData.contact = $selectedData.contact;
  
      scheduleData.programData._id = $programData[scheduleProgram]._id;
      scheduleData.programData.name = $programData[scheduleProgram].name;
      scheduleData.programData.acronym = $programData[scheduleProgram].acronym;
      scheduleData.programData.year = $programData[scheduleProgram].year;
      scheduleData.programData.section = $programData[scheduleProgram].section;

      scheduleData.professorData._id = $programData[scheduleProgram]._id;
      scheduleData.professorData.last = $programData[scheduleProgram].last;
      scheduleData.professorData.first = $programData[scheduleProgram].first;
  
      scheduleData.roomData._id = $roomData[scheduleRoom]._id;
      scheduleData.roomData.name = $roomData[scheduleRoom].name;
  
      console.log(scheduleData);
  
      windowDisabled = true;
      ipcRenderer.send("save-data-schedule", scheduleData);
    };
  
    ipcRenderer.on("save-data-schedule", (event, status) => {
      setTimeout(() => {
        if (status.success == true) {
          scheduleData = {
            day: 0,
            name: "",
            type: "FULLTIME",
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
            school: {
              year: $settingsData.schoolYear,
              semester: $settingsData.schoolSemester,
            },
            courseData: {
              _id: "",
              name: "",
              code: "",
              units: "",
              hours: 0,
            },
            professorData: {
              _id: toString($selectedData._id),
              name: {
                first: $selectedData.name.first,
                last: $selectedData.name.first,
              },
              address: $selectedData.address,
              employment: {
                status: $selectedData.employment.status,
                hours: $selectedData.employment.hours,
              },
              gender: $selectedData.gender,
              contact: $selectedData.contact,
            },
            programData: {
              _id: "",
              name: "",
              acronym: "",
              year: "",
              section: "",
            },
            roomData: {
              _id: "",
              name: ""
            }
          }
        }
        message = status.message;

        if(message != "")
        {
            // patunog logic or show alert message popup
        }

        windowDisabled = false;
        ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id);
      }, 2000)
    })
  
    onDestroy(() => {
      ipcRenderer.removeAllListeners("save-data-schedule");
    })
  </script>
  
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
          <option value="5" class="font-light">Saturday</option>
          <option value="6" class="font-light">Sunday</option>
        </select>
      </div>
    </div>
    <p class="px-2 mx-2 rounded-md font-light">Select Professor:</p>
    <select bind:value={scheduleProgram} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
      {#each $programData as { last, first }, i}
        <option value={i} class="font-light">{last},{first} </option>
      {/each}
    </select>
    <div class="w-full flex flex-row">
        <div class="w-full flex flex-col">
          <p class="px-2 mx-2 rounded-md font-light">Assigned Type:</p>
          <select bind:value={scheduleData.type} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
            {#if $selectedData.employment.status == "Full-Time"}
              <option value="REGULAR" class="font-light">Regular</option>
              <option value="SUBSTITUTE" class="font-light">Substitute</option>
              <option value="TEMPORARY SUBSTITUTE" class="font-light">Temporary Substitute</option>
            {:else}
              <option value="TEMPORARY SUBSTITUTE" class="font-light">Temporary Substitute</option>
              <option value="PART TIME" class="font-light">Part Time</option>
            {/if}
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
    <p class="px-2 mx-2 rounded-md font-light">Select Program:</p>
    <select bind:value={scheduleProgram} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
      {#each $programData as { acronym, year, section }, i}
        <option value={i} class="font-light">{acronym} {year}-{section}</option>
      {/each}
    </select>
    <p class="px-2 mx-2 rounded-md font-light">Select Course:</p>
    <select bind:value={scheduleCourse} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
      {#each $courseData as { name, code }, i}
        <option value={i} class="font-light">{name} [{code}]</option>
      {/each}
    </select>
    <!-- <div class="w-full flex"> -->
      <!-- <input bind:value={scheduleData.name} disabled={windowDisabled} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Course Code" id="Course Code" placeholder="Course Code" /> -->
    <!-- </div>  -->
    <p class="px-2 mx-2 rounded-md font-light">Select Room:</p>
    <select bind:value={scheduleRoom} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light">
      {#each $roomData as { name }, i}
        <option value={i} class="font-light">{name}</option>
      {/each}
    </select>
    <p class="w-full text-center font-light" style="color:red">{message}</p>
  </div>
  
  <div class="flex flex-row justify-end">
    <button on:click={addWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
    <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
  </div>