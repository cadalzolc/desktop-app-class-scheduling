<script>
  const { ipcRenderer } = require("electron");
  import { selectedData, editWindowStatus } from '../stores/ui';
  import { onMount, onDestroy } from 'svelte';

  let courseData = [], search = "";
  
  onMount(() => {
    ipcRenderer.send("retrieve-course-data");
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("retrieve-course-data");
  });

  ipcRenderer.on("retrieve-course-data", (event, res) => {
    courseData = res;
  });

  let searchData = (search) => {   
    ipcRenderer.send("retrieve-course-data" , search);
  };

  let selectData = (data) => {
    $selectedData = data;
    editWindowStatus.set(true);
  }
</script>

<svelte:head>
  <title>.dotSystems - Courses</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col pb-20">
  <div class="w-full flex">
    <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search" id="search" placeholder="Search Course" />
    <button on:click={searchData(search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
  </div>
  
  <div style="margin-top: 10px;">
    <div class="w-full p-2 flex justify-center pb-20 table-container">
      <table class="w-full max-w-screen drop-shadow-md table-excel">
        <thead>
          <tr>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light" style="width: 30px;"></th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Code</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Course Name</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Unit</th>
            <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Hours</th>
          </tr>
        </thead>
        <tbody>
          {#if !courseData}
          <tr>
            <td colspan="4">No record to display. Please add a course.</td>
          </tr>
          {:else if courseData.length == 0}
            <tr>
              <td colspan="4">No record to display. Please add a course.</td>
            </tr>
          {:else}
            {#each courseData as course}
              <tr>
                  <td class="center">
                    <button on:click={() => selectData(course)} class="btn-icon"> 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>Edit</title>
                        <path d="M18.13 12L19.39 10.74C19.83 10.3 20.39 10.06 21 10V9L15 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11V19.13L11.13 19H5V5H12V12H18.13M14 4.5L19.5 10H14V4.5M19.13 13.83L21.17 15.87L15.04 22H13V19.96L19.13 13.83M22.85 14.19L21.87 15.17L19.83 13.13L20.81 12.15C21 11.95 21.33 11.95 21.53 12.15L22.85 13.47C23.05 13.67 23.05 14 22.85 14.19Z" />
                      </svg>
                    </button>
                  </td>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td class="center">{course.units}</td>
                  <td class="center">{course.hours}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>

</div>