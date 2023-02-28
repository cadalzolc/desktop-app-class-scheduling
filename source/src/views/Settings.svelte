<script>
  const { ipcRenderer } = require("electron");
  import { onMount } from 'svelte';

  let selectedSection = 0;
  let changeSelectedSection = (i) => {
    selectedSection = i;
  }
</script>

<div class="overflow-auto w-full h-full grid" style="grid-template-columns: 18rem 1fr">
  <div class="bg-gray-100 w-full h-full drop-shadow-md flex flex-col justify-start">
    <button on:click={() => changeSelectedSection(0)} class="px-6 text-lg h-14 w-full text-left border-b border-gray-300 hover:bg-gray-200 active:bg-gray-300 font-light flex flex-row justify-between items-center">
      <h1>Adjustment</h1>
      {#if selectedSection == 0}
        <h2 class="text-2xl font-light -mt-1">></h2>
      {/if}
    </button>
    <button on:click={() => changeSelectedSection(1)} class="px-6 text-lg h-14 w-full text-left border-b border-gray-300 hover:bg-gray-200 active:bg-gray-300 font-light flex flex-row justify-between items-center">
      <h1>Data</h1>
      {#if selectedSection == 1}
        <h2 class="text-2xl font-light -mt-1">></h2>
      {/if}
    </button>
    <button on:click={() => changeSelectedSection(2)} class="px-6 text-lg h-14 w-full text-left border-b border-gray-300 hover:bg-gray-200 active:bg-gray-300 font-light flex flex-row justify-between items-center">
      <h1>About</h1>
      {#if selectedSection == 2}
        <h2 class="text-2xl font-light -mt-1">></h2>
      {/if}
    </button>
  </div>
  <div class="w-full h-full flex flex-col justify-start">
    {#if selectedSection == 0}
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">School year</button>
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Current semester</button>
    {:else if selectedSection == 1}
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Delete courses</button>
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Delete rooms</button>
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Delete professors</button>
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Delete programs</button>
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Delete schedules</button>
    {:else if selectedSection == 2}
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Test 5</button>
      <button class="px-6 text-lg h-14 w-full text-left border-b hover:bg-gray-100 active:bg-gray-200 font-light">Test 6</button>
    {/if}
  </div>
</div>