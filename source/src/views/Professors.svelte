<script>
  const { ipcRenderer } = require("electron");
  
  import { selectedData } from '../stores/ui';
  import { onMount, onDestroy } from 'svelte';

  let professorData = [], search = "";

  onMount(() => {
    ipcRenderer.send("retrieve-professor-data");
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("retrieve-professor-data");
  })

  ipcRenderer.on("retrieve-professor-data", (e, res) => {
    professorData = res;
  });

  let searchData = (search) => {   
    ipcRenderer.send("retrieve-professor-data" , search);
  };

  let selectData = (data) => {
    $selectedData = data;
  }

</script>

<svelte:head>
  <title>.dotSystems - Professor</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col pb-20">

  <div class="w-full flex">
    <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search professor" id="search" placeholder="Search Professor By Name" />
    <button on:click={searchData(search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
  </div>

  <div style="margin-top: 10px;">
    <div class="w-full p-2 flex justify-center pb-20 table-container">
      <table class="w-full max-w-screen drop-shadow-md table-excel">
        <thead>
          <tr>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light" style="width: 30px;"></th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">ID#</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Name</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Phone</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Email</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Gender</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Status</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Load</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Hours</th>
          </tr>
        </thead>
        <tbody>
          {#if !professorData}
          <tr>
            <td colspan="4">No record to display. Please add a professor.</td>
          </tr>
          {:else if professorData.length == 0}
            <tr>
              <td colspan="4">No record to display. Please add a professor.</td>
            </tr>
          {:else}
            {#each professorData as row}
              <tr>
                  <td class="center">
                    <button on:click={() => selectData(row)} class="btn-icon"> 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>View</title>
                        <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                      </svg>
                    </button>
                  </td>
                  <td>{row.id}</td>
                  <td>{row.gender == "male" ? "Mr." : "Ms."} {row.name.last} - {row.name.first}</td>
                  <td>{row.contact}</td>
                  <td>{row.email}</td>
                  <td>{row.gender}</td>
                  <td>{row.status}</td>
                  <td>{row.employment.status}</td>
                  <td>{row.employment.hours}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>

</div>