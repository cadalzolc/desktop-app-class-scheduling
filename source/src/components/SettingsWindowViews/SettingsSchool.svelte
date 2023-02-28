<script>
  const { ipcRenderer } = require("electron");
  import { onDestroy } from "svelte";
  import { settingsWindowStatus, settingsData } from "../../stores/ui";
  let message = "", windowDisabled = false, fieldDisabled = false;
  export let headerDisabled;

  let currentSettingsData = {
    uid: $settingsData.uid,
    schoolYear: $settingsData.schoolYear,
    schoolSemester: $settingsData.schoolSemester,
  };

  let settingsWindowStatusChange = () => settingsWindowStatus.set(!$settingsWindowStatus);
  let saveData = () => {
    windowDisabled = true;
    headerDisabled = true;
    ipcRenderer.send("edit-data-settings", currentSettingsData);
  };

  ipcRenderer.on("edit-data-settings", (event, status) => {
    setTimeout(() => {
      if (status.success == true) {
        $settingsData.schoolYear = currentSettingsData.schoolYear;
        $settingsData.schoolSemester = currentSettingsData.schoolSemester;
      }
      message = status.message;
      windowDisabled = false;
      headerDisabled = false;
    }, 2000);
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("edit-data-settings");
  })
</script>

<div class="w-full h-full flex flex-col">
  <p class="px-2 mx-2 mt-2 rounded-md font-light">Current School Year:</p>
  <div class="w-full flex -my-2">
    <input bind:value={currentSettingsData.schoolYear} disabled={windowDisabled} type="text" class="p-2 w-full drop-shadow-md ml-2 my-2 rounded-md font-light" name="Year" id="settings.year" placeholder="20XX" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
    <p class="p-2 w-full drop-shadow-md my-2 mr-2 rounded-md font-light">- {parseInt(currentSettingsData.schoolYear) + 1 || "0"}</p>
  </div>
  <p class="px-2 mx-2 mt-2 rounded-md font-light">Current School Semester:</p>
  <select bind:value={currentSettingsData.schoolSemester} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light" name="Semester" id="settings.semester">
    <option value="0" class="font-light">1st Semester</option>
    <option value="1" class="font-light">2nd Semester</option>
    <option value="2" class="font-light">Summer Semester</option>
  </select>
  <p class="w-full text-center font-light m-2">{message}</p>
</div>

<div class="flex flex-row justify-end">
  <button on:click={settingsWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
  <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
</div>