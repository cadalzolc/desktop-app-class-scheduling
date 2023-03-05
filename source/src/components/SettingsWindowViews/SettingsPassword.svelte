<script>
  const { ipcRenderer } = require("electron");
  import { onDestroy } from "svelte";
  import { settingsWindowStatus, settingsData } from "../../stores/ui";
  let message = "", windowDisabled = false, fieldDisabled = false;
  export let headerDisabled;

  let currentSettingsData = {
    uid: $settingsData.uid,
    systemPassword: $settingsData.systemPassword,
    oldSystemPassword: "",
    newSystemPassword: "",
    confirmNewSystemPassword: ""
  };

  let settingsWindowStatusChange = () => settingsWindowStatus.set(!$settingsWindowStatus);
  let saveData = () => {
    windowDisabled = true;
    headerDisabled = true;
    ipcRenderer.send("edit-data-password", currentSettingsData);
  };

  ipcRenderer.on("edit-data-password", (event, status) => {
    setTimeout(() => {
      if (status.success == true) {
        $settingsData.systemPassword = currentSettingsData.newSystemPassword;
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
  <p class="px-2 mx-2 mt-2 rounded-md font-light">Enter Old Password:</p>
  <div class="w-full flex -my-2">
    <input bind:value={currentSettingsData.oldSystemPassword} disabled={windowDisabled} type="password" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Password" id="settings.password" placeholder="******" />
  </div>
  <p class="px-2 mx-2 mt-2 rounded-md font-light">New System Password:</p>
  <div class="w-full flex -my-2">
    <input bind:value={currentSettingsData.newSystemPassword} disabled={windowDisabled} type="password" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Password" id="settings.password" placeholder="******" />
  </div>
  <p class="px-2 mx-2 mt-2 rounded-md font-light">Confirm New System Password:</p>
  <div class="w-full flex -my-2">
    <input bind:value={currentSettingsData.confirmNewSystemPassword} disabled={windowDisabled} type="password" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Password" id="settings.password" placeholder="******" />
  </div>
  <p class="w-full text-center font-light m-2">{message}</p>
</div>

<div class="flex flex-row justify-end">
  <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
</div>