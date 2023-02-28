<script>
  const { ipcRenderer } = require("electron");
  import { selectedData } from '../stores/ui';
  import { onMount, onDestroy } from 'svelte';

  let programData = [];
  onMount(() => {
    ipcRenderer.send("retrieve-program-data");
  });

  let search = "";

  let searchData = (search) => {
    console.log('Search Data');
    console.log('search ' + search);    
    ipcRenderer.send("retrieve-program-data" , search);
  };

  ipcRenderer.on("retrieve-program-data", (event, res) => {
    programData = res;
    console.log(programData);
  });

  let selectData = (data) => {
    $selectedData = data;
  }

  onDestroy(() => {
    ipcRenderer.removeAllListeners("retrieve-program-data");
  })
</script>

<svelte:head>
  <title>.dotSystems - Programs</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col pb-20">
  <div class="w-full flex">
    <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search" id="search" placeholder="Search Program" />
    <button on:click={searchData(search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
  </div>  

  {#if programData.length != 0}
    <div class="w-full p-8 flex justify-center pb-20 table-container">
      <table class="w-full max-w-screen-xl drop-shadow-md">
        <tr>
          <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Programs</th>
        </tr>
        {#each programData as program (program._id)}
        <tr>
          <td on:click={() => selectData(program)}
            class="card h-14 w-full border-b flex flex-row justify-between items-center hover:bg-gray-100 active:bg-gray-200"
            >[{program.acronym} {program.year} - {program.section}] {program.name} {program.year} - {program.section}</td>
        </tr>
        {/each}
      </table>
    </div>
    {:else}
      <div class="w-full h-full p-8 flex justify-center items-center">
        <h1 class="text-4xl font-thin text-center">No data found.</h1>
      </div>
  {/if}
  
  <!-- {#if programData.length != 0}
    {#each programData as program (program._id)}
      <button on:click={() => selectData(program)} class="card h-14 w-full border-b flex flex-row justify-between items-center hover:bg-gray-100 active:bg-gray-200">
        <h1 class="text-xl font-light m-6">[{program.acronym} {program.year} - {program.section}] {program.name} {program.year} - {program.section}</h1>
        <h2 class="p-6 text-3xl font-light -mt-1">></h2>
      </button>
    {/each}
  {:else}
    <h1 class="text-4xl font-thin text-center">No data found.</h1>
  {/if} -->
</div>