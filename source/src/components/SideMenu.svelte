<script>
  import { sideMenuStatus, viewComponentValue, selectedData, settingsWindowStatus } from "../stores/ui";
  import { fade, fly } from "svelte/transition";

  let sideMenuStatusChange = () => sideMenuStatus.set(!$sideMenuStatus);
  let viewComponentValueChange = (i) => {
    selectedData.set("");
    viewComponentValue.set(i);
    sideMenuStatusChange();
  };

  let settingsWindowStatusChange = () => {
    settingsWindowStatus.set(!$settingsWindowStatus);
    sideMenuStatusChange();
  };
</script>

{#if $sideMenuStatus}
  <div on:click={sideMenuStatusChange} transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 backdrop-filter backdrop-blur-sm" />

  <div transition:fly={{x: -200, duration: 250}} class="h-screen w-72 z-20 drop-shadow-md bg-white fixed grid custom-layout">
    <div class="w-full h-12 bg-red-800 flex drop-shadow-md items-center justify-center">
      <h1 class="text-white text-3xl font-light px-2"><span class="text-yellow-400 font-medium">.</span>dotSystems</h1>
    </div>

    <section class="flex flex-col">
      <button on:click={() => viewComponentValueChange(0)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Dashboard</button>
      <button on:click={() => viewComponentValueChange(1)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Courses</button>
      <button on:click={() => viewComponentValueChange(2)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Rooms</button>
      <button on:click={() => viewComponentValueChange(3)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Professors</button>
      <button on:click={() => viewComponentValueChange(4)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Programs</button>
      <!-- <button on:click={() => viewComponentValueChange(5)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Subjects</button>   -->
      <button on:click={() => viewComponentValueChange(6)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Schedules</button>
      <button on:click={() => viewComponentValueChange(7)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Professor Overview</button>
      <button on:click={() => viewComponentValueChange(9)} class="px-3 py-1 text-lg w-full text-left border-b font-light hover:bg-gray-100 active:bg-gray-200">Deleted Files</button>
    </section>

    <button on:click={settingsWindowStatusChange} class="px-3 py-1 text-lg w-full text-left border-t font-light hover:bg-gray-100 active:bg-gray-200">Settings</button>    
    
  </div>
{/if}

<style>
  .custom-layout {
    grid-template-rows: auto 1fr auto;
  }
</style>