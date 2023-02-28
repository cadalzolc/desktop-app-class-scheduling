<script>
  import SettingsSchool from "./SettingsWindowViews/SettingsSchool.svelte";
  import SettingsPassword from "./SettingsWindowViews/SettingsPassword.svelte";
  import { settingsWindowStatus } from "../stores/ui";
  import { fly, fade } from "svelte/transition";

  let headerOptions = 0;
  let headerDisabled = false;
</script>

{#if $settingsWindowStatus}
  <div transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-start px-6 pb-4 items-end backdrop-filter backdrop-blur-sm" >

    <div transition:fly={{y: 200, duration: 250}} class="z-20 drop-shadow-md bg-white fixed flex flex-col rounded-md" style="width: 28rem; height: 32rem;">
      <div class="grid bg-red-800 rounded-t-md drop-shadow-md" style="grid-template-columns: 1fr auto 1fr">
        <div />
        <h1 class="w-full p-2 text-2xl font-light text-center text-white">System Settings</h1>
        <div />
      </div>
      <nav class="grid grid-flow-col w-full self-center bg-gray-300 drop-shadow-md">
        <button disabled={headerDisabled} class:border-gray-400={headerOptions == 0} on:click={() => {headerOptions = 0}} class="p-1 border-b-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">School</button>
        <button disabled={headerDisabled} class:border-gray-400={headerOptions == 1} on:click={() => {headerOptions = 1}} class="p-1 border-b-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Password</button>
      </nav>


      {#if headerOptions == 0}
        <SettingsSchool bind:headerDisabled />
      {:else if headerOptions == 1}
        <SettingsPassword />
      {/if}
    </div>

  </div>
{/if}