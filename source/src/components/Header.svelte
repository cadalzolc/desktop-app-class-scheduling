<script>
  import { sideMenuStatus, viewComponentValue, selectedData, exitApplicationWindowStatus } from "../stores/ui";
  const { ipcRenderer } = require("electron");

  let headerTitle = [
    "dashboard",
    "courses",
    "rooms",
    "professors",
    "programs",
    "subjects",
    "schedules",
    "professor overview",
    "advising time",
  ];
  let sideMenuStatusChange = () => sideMenuStatus.set(!$sideMenuStatus);
  let clearSelectedData = () => selectedData.set("");
  let shutdownPrompt = () => exitApplicationWindowStatus.set(true);
  let maximizePrompt = () => ipcRenderer.send("maximize-prompt");
  let minimizePrompt = () => ipcRenderer.send("minimize-prompt");
  let returnToProfessor = () => {
    // selectedData.set("");
    viewComponentValue.set(3);
  }  
</script>

<div class="w-full h-12 bg-red-800 drop-shadow-md grid grid-cols-3" style="-webkit-app-region: drag">
  <div class="flex flex-row justify-start items-center">
    <button on:click={sideMenuStatusChange} class="p-1.5 mx-2 mr-1 rounded-full active:bg-red-900 hover:bg-red-700" title="Menu [Press Tab]">
      <svg class="w-6 h-6 fill-white" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </button>
    {#if $selectedData != "" && $viewComponentValue == 8}
      <button on:click={returnToProfessor} class="p-1.5 mx-2 ml-1 rounded-full active:bg-red-900 hover:bg-red-700">
        <svg class="w-6 h-6 fill-white" viewBox="0 0 16 16">
          <text x="1.75" y="12.25">&lt;</text>
        </svg>
      </button>
    {:else if $selectedData != "" && $viewComponentValue != 1}
      <button on:click={clearSelectedData} class="p-1.5 mx-2 ml-1 rounded-full active:bg-red-900 hover:bg-red-700">
        <svg class="w-6 h-6 fill-white" viewBox="0 0 16 16">
          <text x="1.75" y="12.25">&lt;</text>
        </svg>
      </button>    
    {/if}
  </div>
  <h1 class="text-white text-3xl font-light place-self-center"><span class="text-yellow-400 font-medium">.</span>
    {#if $selectedData != "" && $viewComponentValue == 8}
      Advising Time
    {:else}
      {headerTitle[$viewComponentValue]}
    {/if}    
  </h1>
  <div class="place-self-center justify-self-end flex flex-row-reverse">
    <button on:click={shutdownPrompt} class="w-12 h-12 text-white active:bg-red-900 hover:bg-red-700 text-sm">╳</button>
    <button on:click={maximizePrompt} class="w-12 h-12 text-white active:bg-red-900 hover:bg-red-700">☐</button>
    <button on:click={minimizePrompt} class="w-12 h-12 text-white active:bg-red-900 hover:bg-red-700">－</button>
  </div>
</div>

<style>
  button {
    -webkit-app-region: no-drag;
  }

  @media print {
    div {
      display: none;
    }
  }
</style>