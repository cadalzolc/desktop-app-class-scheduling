<script>
    const { ipcRenderer } = require("electron");
    import { selectedData , editWindowStatus, deleteWindowScheduleStatus, deleteWindowStatus, tbdData , } from '../stores/ui';
    import { onMount, onDestroy } from 'svelte';
    let scheduleData , search = "";
  
    let courseOrder = 0;

    let filterSubjectsData = (search = '') => {

        ipcRenderer.send("retrieve-subject-data" , search);
    };

    let editSelected = () => {
        console.log($selectedData);
        editWindowStatus.set(true);
    }

    let tbdSelected = (tbd) => {
        tbdData.set(tbd);
        deleteWindowScheduleStatus.set(true);
    }

    let exportExcel = () => {
        ipcRenderer.send("export-to-excel", $selectedData);
    }

    onMount(() => {
        ipcRenderer.send("retrieve-subject-data");
    });

    ipcRenderer.on("retrieve-subject-data", (event, res) => {
      scheduleData = res;
      console.log(scheduleData);
    });
  
    let selectData = (data) => {
      $selectedData = data;
    }
  
    onDestroy(() => {
      ipcRenderer.removeAllListeners("retrieve-subject-data");
    })
  </script>
  
  <svelte:head>
    <title>.dotSystems - Subjects</title>
  </svelte:head>
  
<div class="overflow-auto w-full h-full flex flex-col pb-20">
    <div class="w-full flex">
        <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search" id="search" placeholder="Search Subject" />
        <button on:click={filterSubjectsData(search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
    </div>
    {#if scheduleData}
    {#if scheduleData.length != 0}
      <div class="w-full p-2 flex justify-center pb-20 table-container">
        <table class="w-full max-w-screen drop-shadow-md">
          <tr>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Subject</th>
          </tr>
          {#each scheduleData as schedule (schedule._id)}
            <tr on:click={() => tbdSelected(schedule)}>
              <td class="py-3 px-2 text-left border border-gray-300 font-light">{schedule.name}</td>
            </tr>
          {/each}
        </table>
      </div>
    {:else}
      <div class="w-full h-full p-8 flex justify-center items-center">
        <h1 class="text-4xl font-thin text-center">No data found.</h1>
      </div>
    {/if}
  {/if}
</div>