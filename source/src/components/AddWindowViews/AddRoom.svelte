<script>
const { ipcRenderer } = require("electron");
import { onDestroy } from "svelte";
import { addWindowStatus } from "../../stores/ui";
import AlertDialog from "../AlertDialog.svelte";

let alertOpen = false;
let alertOptions = {
  success: false,
  message: "Alert Box"
};
let message = "", windowDisabled = false, fieldDisabled = false;
let roomData = {
  name: "",
}

$: if (!roomData.name) {
  fieldDisabled = true;
} else fieldDisabled = false;

let addWindowStatusChange = () => addWindowStatus.set(!$addWindowStatus);
let saveData = () => {
  windowDisabled = true;
  ipcRenderer.send("save-data-room", roomData);
};

ipcRenderer.on("save-data-room", (e, res) => {
  windowDisabled = false;
  alertOpen = true;
  alertOptions = res;
  if (res.success) {
    roomData =  { name: "" }
  }
  ipcRenderer.send("retrieve-room-data");
});

onDestroy(() => {
  ipcRenderer.removeAllListeners("save-data-room");
})
</script>

<AlertDialog bind:alertOpen bind:alertOptions />

<div class="w-full h-full flex flex-col">
  <input bind:value={roomData.name} disabled={windowDisabled} type="text" class="p-2 drop-shadow-md m-2 rounded-md font-light" name="Room" id="room.name" placeholder="Room Name (e.g. Faculty Room)" />
  <p class="w-full text-center font-light m-2">{message}</p>
</div>

<div class="flex flex-row justify-end">
  <button on:click={addWindowStatusChange} disabled={windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Close</button>
  <button on:click={saveData} disabled={fieldDisabled || windowDisabled} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Save</button>
</div>