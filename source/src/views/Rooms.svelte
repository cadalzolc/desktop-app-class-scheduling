<script>
  const { ipcRenderer } = require("electron");
  import { selectedData } from '../stores/ui';
  import { onMount, onDestroy } from 'svelte';

  let roomData = [];
  onMount(() => {
    ipcRenderer.send("retrieve-room-data");
  });

  let search = "";

  let searchData = (search) => {
    console.log('Search Data');
    console.log('search ' + search);    
    ipcRenderer.send("retrieve-room-data" , search);
  };

  ipcRenderer.on("retrieve-room-data", (event, res) => {
    roomData = res;
    console.log(roomData);
  });

  let selectData = (data) => {
    $selectedData = data;
  }

  onDestroy(() => {
    ipcRenderer.removeAllListeners("retrieve-room-data");
  })
</script>

<svelte:head>
  <title>.dotSystems - Rooms</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col pb-20">
  <div class="w-full flex">
    <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search" id="search" placeholder="Search Room" />
    <button on:click={searchData(search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
  </div>  
  {#if roomData.length != 0}
    {#each roomData as room (room._id)}
      <button on:click={() => selectData(room)} class="card h-14 w-full border-b flex flex-row justify-between items-center hover:bg-gray-100 active:bg-gray-200">
        <h1 class="text-xl font-light m-6">{room.name}</h1>
        <h2 class="p-6 text-3xl font-light -mt-1">></h2>
      </button>
    {/each}
  {:else}
    <h1 class="text-4xl font-thin text-center">No data found.</h1>
  {/if}
</div>