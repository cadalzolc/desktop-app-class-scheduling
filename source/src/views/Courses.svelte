<script>
  const { ipcRenderer } = require("electron");
  import { selectedData, editWindowStatus } from '../stores/ui';
  import { onMount, onDestroy } from 'svelte';

  let courseData = [];
  onMount(() => {
    ipcRenderer.send("retrieve-course-data");
  });

  ipcRenderer.on("retrieve-course-data", (event, res) => {
    courseData = res;
    console.log(courseData);
  });

  let search = "";

  let searchData = (search) => {
    console.log('Search Data');
    console.log('search ' + search);    
    ipcRenderer.send("retrieve-course-data" , search);
  };

  let selectData = (data) => {
    $selectedData = data;
    editWindowStatus.set(true);
  }

  onDestroy(() => {
    ipcRenderer.removeAllListeners("retrieve-course-data");
  })
</script>

<svelte:head>
  <title>.dotSystems - Courses</title>
</svelte:head>

<div class="overflow-auto w-full h-full flex flex-col pb-20">
  <div class="w-full flex">
    <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search" id="search" placeholder="Search Course" />
    <button on:click={searchData(search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
  </div>
  {#if courseData.length != 0}
    {#each courseData as course (course._id)}
      <button on:click={() => selectData(course)} class="card h-14 w-full border-b flex flex-row justify-between items-center hover:bg-gray-100 active:bg-gray-200">
        <div class="w-full h-full grid items-center" style="grid-template-columns: 50% auto auto">
          <h1 class="text-xl font-light mx-6 text-left whitespace-nowrap overflow-hidden text-ellipsis" title="{course.name} [{course.code}]">{course.name} [{course.code}]</h1>
          <h1 class="text-xl font-light text-left">Units: {course.units}</h1>
          <h1 class="text-xl font-light text-left">Hours: {course.hours}</h1>
        </div>
      </button>
    {/each}
  {:else}
    <h1 class="text-4xl font-thin text-center">No data found.</h1>
  {/if}
</div>