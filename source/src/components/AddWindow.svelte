<script>
  import AddCourse from "./AddWindowViews/AddCourse.svelte";
  import AddProfessor from "./AddWindowViews/AddProfessor.svelte";
  import AddProgram from "./AddWindowViews/AddProgram.svelte";
  import AddRoom from "./AddWindowViews/AddRoom.svelte";
  import AddSchedule from "./AddWindowViews/AddSchedule.svelte";
  import ProfessorOverviewModal from "./ProfessorOverviewModal.svelte";
  import AddAdviseTime from "./AddWindowViews/AddAdviseTime.svelte";
  import { viewComponentValue, addWindowStatus, selectedData } from "../stores/ui";
  import { fly, fade } from "svelte/transition"; 
  import { onDestroy, onMount } from "svelte";

  let headerTitle = [
    "Courses",
    "Rooms",
    "Professors",
    "Programs",
    "Schedules",
    "Schedules",
  ];
</script>

{#if $addWindowStatus}
  <div transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-end px-6 pb-4 items-end" class:backdrop-filter={$selectedData == ""} class:backdrop-blur-sm={$selectedData == ""} >

    <div transition:fly={{y: 200, duration: 250}} class="z-20 drop-shadow-md bg-white fixed flex flex-col rounded-md" style="width: 28rem; height: 42rem;">
      <h1 class="w-full p-2 text-2xl font-light text-center text-white bg-yellow-400 rounded-t-md drop-shadow-md">Add New         
        {#if $selectedData != "" && $viewComponentValue == 8}
          Advise Time
        {:else}
          {$selectedData == "" ? headerTitle[$viewComponentValue - 1] : "Schedule"}
        {/if}        
      </h1>
      {#if $viewComponentValue == 1}
        <AddCourse />
      {:else if $viewComponentValue == 2}
        <AddRoom />
      {:else if $viewComponentValue == 3}
        <AddProfessor />
      {:else if $viewComponentValue == 4}
        <AddProgram />
      {:else if $viewComponentValue == 6}
        <AddSchedule />
      {:else if $viewComponentValue == 8}
        <AddAdviseTime />
      {/if}
    </div>

  </div>
{/if}