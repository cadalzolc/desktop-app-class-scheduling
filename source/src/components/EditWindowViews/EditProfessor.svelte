<script>
  const { ipcRenderer } = require("electron");
  import { onDestroy } from "svelte";
  import { editWindowStatus, selectedData } from "../../stores/ui";
  import AlertDialog from "../AlertDialog.svelte";

  let alertOpen = false;
  let alertOptions = {
    success: false,
    message: "Alert Box"
  };
  let message = "", windowDisabled = false, fieldDisabled = false;
  let professorData = {
    _id: $selectedData._id,
    name: {
      first: $selectedData.name.first,
      last: $selectedData.name.last,
    },
    address: $selectedData.address,
    email: $selectedData.email,
    employment: {
      status: $selectedData.employment.status,
      hours: $selectedData.employment.hours,
    },
    gender: $selectedData.gender,
    contact: $selectedData.contact,
    status: $selectedData.status,
  }

  $: if (!professorData.name.first || !professorData.name.last || !professorData.address || !professorData.employment.status || !professorData.employment.hours || !professorData.gender || !professorData.contact || !professorData.status) {
    fieldDisabled = true;
  } else fieldDisabled = false;
 
  let editWindowStatusChange = () => editWindowStatus.set(!$editWindowStatus);
  let saveData = () => {
    windowDisabled = true;
    ipcRenderer.send("edit-data-professor", professorData, $selectedData);
  };

ipcRenderer.on("edit-data-professor", (e, res) => {
  windowDisabled = false;
  alertOpen = true;
  alertOptions = res;
  if (res.success) {
      $selectedData.name.first = professorData.name.first;
      $selectedData.name.last = professorData.name.last;
      $selectedData.address = professorData.address;
      $selectedData.employment.status = professorData.employment.status;
      $selectedData.employment.hours = professorData.employment.hours;
      $selectedData.gender = professorData.gender;
      $selectedData.contact = professorData.contact;
      $selectedData.status = professorData.status;
    }
});

onDestroy(() => {
  ipcRenderer.removeAllListeners("edit-data-professor");
})
</script>

<AlertDialog bind:alertOpen bind:alertOptions />

<div class="w-full h-full flex flex-col">
  <div class="w-full flex">
    <input bind:value={professorData.name.first} disabled={windowDisabled} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Professor" id="professor.name.first" placeholder="Professor First Name" />
    <input bind:value={professorData.name.last} disabled={windowDisabled} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Professor" id="professor.name.last" placeholder="Professor Last Name" />
  </div>
  <input bind:value={professorData.email} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Professor" id="professor.email" placeholder="Professor Email Address" />
  <input bind:value={professorData.address} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Professor" id="professor.address" placeholder="Professor Address" />
  <input bind:value={professorData.contact} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Professor" id="professor.contact" placeholder="Professor Phone Number" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" />
  <p class="px-2 mx-2 rounded-md font-light">Select Gender:</p>
  <select bind:value={professorData.gender} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light" name="Professor" id="professor.gender">
    <option value="male" class="font-light">Male</option>
    <option value="female" class="font-light">Female</option>
  </select>
  <div class="w-full flex justify-evenly flex-row">
    <div class="w-full flex flex-col">
      <p class="px-2 mx-2 rounded-md font-light w-full">Status:</p>
      <select bind:value={professorData.status} disabled={windowDisabled} class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Status" id="professor.status" title="Status">
        <option value="REGULAR" class="font-light">Regular</option>
        <option value="PART TIME" class="font-light">Part Time</option>
      <option value="TEMPORARY" class="font-light">Temporary</option>
      </select>
    </div>
    
  </div>

  <p class="px-2 mx-2 rounded-md font-light w-full">Load:</p>
  <div class="w-full flex">
    
    <select bind:value={professorData.employment.status} disabled={windowDisabled} class="px-4 py-1 mx-2 mb-2 drop-shadow-md rounded-md font-light" name="Professor" id="professor.employment.status" title="Testing">
      <option value="Full-Time" class="font-light">Full-Time</option>
      <option value="Part-Time" class="font-light">Part-Time</option>
      <option value="TS-Load" class="font-light">TS-Load</option>
    </select>  
    <input bind:value={professorData.employment.hours} disabled={windowDisabled} type="text"  class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Professor" id="professor.employment.hours" placeholder="Professor Load Hours" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');" /> 
  </div>
  
  <p class="w-full text-center font-light m-2">{message}</p>
</div>

<div class="flex flex-row justify-end">
  <button on:click={editWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
  <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
</div>