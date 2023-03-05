<script>
  import { viewComponentValue, addWindowStatus, selectedData } from "../stores/ui";
  import { fly } from "svelte/transition";

  let addWindowStatusChange = () => addWindowStatus.set(!$addWindowStatus)

</script>

{#if $viewComponentValue != 9}
  {#if ($viewComponentValue != 0 && $viewComponentValue != 7)  && ($selectedData == "" || $viewComponentValue == 1)}
      <button on:click={addWindowStatusChange} transition:fly={{y: 200, duration: 250}} class="fixed bottom-0 right-0 w-14 h-14 m-5 mr-7 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 rounded-full drop-shadow-md">
        <h1 class="text-6xl font-thin -mt-3.5 text-white">+</h1>
      </button>
  {/if}
{/if}



<style>
  @media print {
    button {
      display: none;
    }
  }
</style>