<script>
  const { ipcRenderer } = require("electron");
  import { resetPasswordWindowStatus } from "../stores/ui";
  import { fly, fade } from "svelte/transition";
  import { onDestroy } from "svelte";
  let message = "Are you sure you want to reset your password? This will delete all data saved on the system."
  let disableWindow = false;

  let resetRequest = () => {
    console.log("tite");
    ipcRenderer.send("login-reset");
    disableWindow = true;
  }

  ipcRenderer.on("login-reset", (event, res) => {
    if (res.success) {
      message = res.message;
      setTimeout(() => {
        $resetPasswordWindowStatus = false;
        disableWindow = false;
        message = "Are you sure you want to reset your password? This will delete all data saved on the system."
      }, 5000);
    }
  })

  onDestroy(() => {
    ipcRenderer.removeAllListeners("login-reset");
  });
</script>

{#if $resetPasswordWindowStatus}
  <div transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-center px-6 items-center backdrop-filter backdrop-blur-sm" >

    <div transition:fly={{y: 200, duration: 250}} class=" w-80 h-auto z-20 drop-shadow-md bg-white fixed flex flex-col rounded-md">
      <h1 class="w-full p-2 px-4 text-2xl font-light text-center rounded-t-md">{message}</h1>
      <div class="flex flex-col justify-center items-center p-2">
        <button disabled={disableWindow} on:click={() => resetPasswordWindowStatus.set(!$resetPasswordWindowStatus)} class="w-4/6 p-1 mb-1 mt-1 rounded-full hover:drop-shadow-md hover:bg-white active:bg-gray-200 font-thin">No, go back</button>
        <button disabled={disableWindow} on:click={resetRequest} class="w-4/6 p-1 mb-1 rounded-full hover:drop-shadow-md hover:bg-red-800 active:bg-red-900 hover:text-white font-thin">Yes, continue</button>
      </div>
    </div>

  </div>
{/if}