<script>
  const { ipcRenderer } = require("electron");
  import { exitApplicationWindowStatus } from "../stores/ui";
  import { fly, fade } from "svelte/transition";
  import { onDestroy } from "svelte";
  let message = "Are you sure you want to close the application?"
  let disableWindow = false;

  let resetRequest = () => {
    console.log("tite");
    ipcRenderer.send("shutdown-prompt")
    disableWindow = true;
  }

  onDestroy(() => {
    ipcRenderer.removeAllListeners("login-reset");
  });
</script>

{#if $exitApplicationWindowStatus}
  <div transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-center px-6 items-center backdrop-filter backdrop-blur-sm" >

    <div transition:fly={{y: 200, duration: 250}} class=" w-80 h-auto z-20 drop-shadow-md bg-white fixed flex flex-col rounded-md">
      <h1 class="w-full p-2 px-4 text-2xl font-light text-center rounded-t-md">{message}</h1>
      <div class="flex flex-col justify-center items-center p-2">
        <button disabled={disableWindow} on:click={() => exitApplicationWindowStatus.set(!$exitApplicationWindowStatus)} class="w-4/6 p-1 mb-1 mt-1 rounded-full hover:drop-shadow-md hover:bg-white active:bg-gray-200 font-thin">No, go back</button>
        <button disabled={disableWindow} on:click={resetRequest} class="w-4/6 p-1 mb-1 rounded-full hover:drop-shadow-md hover:bg-red-800 active:bg-red-900 hover:text-white font-thin">Yes, continue</button>
      </div>
    </div>

  </div>
{/if}