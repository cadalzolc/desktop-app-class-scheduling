<script>
  import SettingsSchool from "./SettingsWindowViews/SettingsSchool.svelte";
  import SettingsPassword from "./SettingsWindowViews/SettingsPassword.svelte";
  import { settingsWindowStatus } from "../stores/ui";
  import { fly, fade } from "svelte/transition";
  let headerOptions = 0;
  let headerDisabled = false;
  const settingsWindowStatusChange = () => settingsWindowStatus.set(!$settingsWindowStatus);
</script>

{#if $settingsWindowStatus}
  <div transition:fade={{duration: 100}} class="form bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-start px-6 pb-4 items-end backdrop-filter backdrop-blur-sm" >
    <div transition:fly={{y: 200, duration: 250}} class="tab">
        <div class="tab-header">
          <span> System Settings</span>
            <button title="Close" class="btn-close" on:click={settingsWindowStatusChange}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff;">
                  <title>Close</title>
                  <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                </svg>
            </button>
        </div>
        <div class="tab-menu">
          <nav class="grid grid-flow-col w-full self-center bg-gray-300 drop-shadow-md">
            <button disabled={headerDisabled} class:border-gray-400={headerOptions == 0} on:click={() => {headerOptions = 0}} class="p-1 border-b-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">School</button>
            <button disabled={headerDisabled} class:border-gray-400={headerOptions == 1} on:click={() => {headerOptions = 1}} class="p-1 border-b-2 font-light border-gray-300 hover:border-gray-400 active:bg-gray-400 active:border-gray-400 active:text-white">Password</button>
          </nav>
        </div>
        <div class="tab-body">
          {#if headerOptions == 0}
            <SettingsSchool bind:headerDisabled />
          {:else}
            <SettingsPassword />
          {/if}
        </div>
    </div>
  </div>
{/if}

<style>
  .form .tab {
    background: #fff;
    width: 450px;
    height: 98%;
  }
  .form .tab-menu {
    display: flex;
  }
  .form .tab-header {
    background: rgb(153 28 28);
    line-height: 35px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
    padding: 7px 0;
  }
  .form .tab-header .btn-close {
    float: right;
    cursor: pointer;
    position: relative;
    width: 24px;
    height: 24px;
    right: 12px;
    top: 8px;
  }
  .form .tab-header .btn-close > svg{
    fill: #fff;
  }
  .form .tab-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
</style>