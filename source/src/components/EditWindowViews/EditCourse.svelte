<script>
  const { ipcRenderer } = require("electron");
  import { onDestroy } from "svelte";
  import { editWindowStatus, selectedData, deleteWindowStatus } from "../../stores/ui";
  let message = "", windowDisabled = false, fieldDisabled = false;
  let courseData = {
    _id: $selectedData._id,
    name: $selectedData.name,
    code: $selectedData.code,
    units: $selectedData.units,
    hours: $selectedData.hours,
  }

  $: if (!courseData.name || !courseData.code || !courseData.units || !courseData.hours) {
    fieldDisabled = true;
  } else fieldDisabled = false;

  let editWindowStatusChange = () => editWindowStatus.set(!$editWindowStatus);
  let saveData = () => {
    windowDisabled = true;
    ipcRenderer.send("edit-data-course", courseData, $selectedData);
  };

  ipcRenderer.on("edit-data-course", (event, status) => {
    setTimeout(() => {
      ipcRenderer.send("retrieve-course-data");
      message = status.message;
      windowDisabled = false;
    }, 2000);
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("edit-data-course");
  })
</script>

<div class="w-full h-full flex flex-col">
  <input bind:value={courseData.name} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Course" id="course.name" placeholder="Course Name" />
  <input bind:value={courseData.code} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Code" id="course.code" placeholder="Course Code (e.g GEED 10083)" />
  <input bind:value={courseData.units} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Units" id="course.units" placeholder="Course Units" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
  <input bind:value={courseData.hours} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Hours" id="course.hours" placeholder="Course Hours" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
  <button on:click={() => $deleteWindowStatus = true} disabled={windowDisabled} class="p-2 m-2 rounded-full font-light hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100 hover:drop-shadow-md active:drop-shadow-md">Delete Course</button>
  <p class="w-full text-center font-light m-2">{message}</p>
</div>

<div class="flex flex-row justify-end">
  <button on:click={editWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
  <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
</div>