<script>
  import EditCourse from "./EditWindowViews/EditCourse.svelte";
  import EditProfessor from "./EditWindowViews/EditProfessor.svelte";
  import EditProgram from "./EditWindowViews/EditProgram.svelte";
  import EditRoom from "./EditWindowViews/EditRoom.svelte";
  import EditAdviseTime from "./EditWindowViews/EditAdviseTime.svelte";
  import { viewComponentValue, editWindowStatus } from "../stores/ui";
  import { fly, fade } from "svelte/transition"; 

  let headerTitle = [
    "Courses",
    "Rooms",
    "Professors",
    "Programs",
  ];
</script>

{#if $editWindowStatus}
  <div transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-end px-6 pb-4 items-end backdrop-filter backdrop-blur-sm" >

    <div transition:fly={{y: 200, duration: 250}} class="z-20 drop-shadow-md bg-white fixed flex flex-col rounded-md" style="width: 28rem; height: 38rem;">
      <h1 class="w-full p-2 text-2xl font-light text-center text-white bg-yellow-400 rounded-t-md drop-shadow-md">
        Edit Existing 
        {#if $viewComponentValue == 8}
          Advise Time
        {:else}
          {headerTitle[$viewComponentValue - 1]}
        {/if}   
      </h1>

      {#if $viewComponentValue == 1}
        <EditCourse />
      {:else if $viewComponentValue == 2}
        <EditRoom />
      {:else if $viewComponentValue == 3}
        <EditProfessor />
      {:else if $viewComponentValue == 4}
        <EditProgram />
      {:else if $viewComponentValue == 8}
        <EditAdviseTime />        
      {/if}
    </div>

  </div>
{/if}