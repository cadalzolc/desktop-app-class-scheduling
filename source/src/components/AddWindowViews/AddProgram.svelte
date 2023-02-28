<script>
  const { ipcRenderer } = require("electron"); 
  import { onDestroy } from "svelte";
  import { addWindowStatus } from "../../stores/ui";
  let message = "", windowDisabled = false, fieldDisabled = false;
  let programData = {
    name: "",
    acronym: "",
    year: "",
    section: "",
  }

  $: if (!programData.name || !programData.acronym || !programData.year || !programData.section) {
    fieldDisabled = true;
  } else fieldDisabled = false;

  let addWindowStatusChange = () => addWindowStatus.set(!$addWindowStatus);
  let saveData = () => {
    windowDisabled = true;
    ipcRenderer.send("save-data-program", programData);
  }

  ipcRenderer.on("save-data-program", (event, status) => {
    setTimeout(() => {
      if (status.success == true) {
        programData = {
          name: "",
          acronym: "",
          year: "",
          section: "",
        }
      }
      ipcRenderer.send("retrieve-program-data");
      message = status.message;
      windowDisabled = false;
    }, 2000);
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("save-data-program");
  })
</script>

<div class="w-full h-full flex flex-col">
  <input bind:value={programData.name} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Program" id="program.name" placeholder="Program Name" />
  <input bind:value={programData.acronym} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Program" id="program.acronym" placeholder="Program Acronym (e.g. BSIT)" />
  <input bind:value={programData.year} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Program" id="program.year" placeholder="Program Year" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
  <input bind:value={programData.section} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Program" id="program.section" placeholder="Program Section" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
  <p class="w-full text-center font-light m-2">{message}</p>
</div>

<div class="flex flex-row justify-end">
  <button on:click={addWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
  <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
</div>