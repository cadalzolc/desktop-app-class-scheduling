<script>
  const { ipcRenderer } = require("electron");
  import { deleteWindowScheduleStatus, tbdData, selectedData } from "../stores/ui";
  import { fly, fade } from "svelte/transition";
  import { onDestroy } from "svelte";
  let message = "Do you want to delete this?"
  let disableWindow = false;

  let deleteRequest = () => {
    disableWindow = true;
    ipcRenderer.send("delete-schedule-data", $tbdData._id)
  }

  onDestroy(() => ipcRenderer.removeAllListeners("delete-schedule-data"));

  ipcRenderer.on("delete-schedule-data", (event, res) => {
    console.log(res)
    if (res.success) {
      message = res.message;
      setTimeout(() => {
        $deleteWindowScheduleStatus = false;
        message = "Do you want to delete this?";
        disableWindow = false;
        ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-program-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-room-data", $selectedData._id);
      }, 1000);
    }
  })
</script>

{#if $deleteWindowScheduleStatus}
  <div transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-center px-6 items-center backdrop-filter backdrop-blur-sm" >

    <div transition:fly={{y: 200, duration: 250}} class=" w-80 h-auto z-20 drop-shadow-md bg-white fixed flex flex-col rounded-md">
      <h1 class="w-full p-2 px-4 text-2xl font-light text-center rounded-t-md">{message}</h1>
      <div class="flex flex-col justify-center items-center p-2">
        <button disabled={disableWindow} on:click={() => deleteWindowScheduleStatus.set(!$deleteWindowScheduleStatus)} class="w-4/6 p-1 mb-1 mt-1 rounded-full hover:drop-shadow-md hover:bg-white active:bg-gray-200 font-thin">No, go back</button>
        <button disabled={disableWindow} on:click={deleteRequest} class="w-4/6 p-1 mb-1 rounded-full hover:drop-shadow-md hover:bg-red-800 active:bg-red-900 hover:text-white font-thin">Yes, continue</button>
      </div>
    </div>

  </div>
{/if}