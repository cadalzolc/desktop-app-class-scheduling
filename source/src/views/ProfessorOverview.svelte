<script>
    const { ipcRenderer } = require("electron");
    import 'material-icons/iconfont/material-icons.css';
    import { selectedData } from '../stores/ui';
    import { onMount, onDestroy } from 'svelte';
  
    let professorData = [];
    let allow = 0;

    onMount(() => {
      ipcRenderer.send("retrieve-professor-data");
      allow = 1;
    });
  
    let search = "";
  
    let searchData = (search) => {
      console.log('Search Data');
      console.log('search ' + search);    
      ipcRenderer.send("retrieve-professor-data" , search);
    };
  
    ipcRenderer.on("retrieve-professor-data", (event, res) => {
      console.log(res);
      console.log("search" + search);
      professorData = res;
      console.log(professorData);
    });
  
    let selectData = (data) => {
      // $selectedData = data;

    }
  
    onDestroy(() => {      
      modal.set(null);
      allow = 0;
      ipcRenderer.removeAllListeners("retrieve-professor-data");
    })

    import { fly } from 'svelte/transition';
	
	import { bind } from './CustomModal.svelte';
	
  import Popup from './Popup.svelte';
	
  import Modal from './CustomModal.svelte';
	import { modal } from './stores.js';
	
	let opening = false;
	let opened = false;
	let closing = false;
	let closed = false;

  const showPopup = () => {
		modal.set(Popup);
	};

  let showPopupWithProps = (professor) => {
    console.log("click");
    console.log("allow : " + allow);
    if(allow == 1)
    {
      modal.set(bind(Popup, { professor : professor }));
    }
	};
  </script>
  
  <svelte:head>
    <title>.dotSystems - Professors</title>
  </svelte:head>
  
  <div class="overflow-auto w-full h-full flex flex-col pb-20">
    <div class="w-full flex">
      <input bind:value={search} type="text" class="p-2 w-full drop-shadow-md m-2 rounded-md font-light" name="Search professor" id="search" placeholder="Search Professor By Name" />
      <button on:click={searchData(search)} class="px-5 py-1 drop-shadow-md rounded-full font-light my-2 mx-1 mr-2 bg-gray-300 hover:bg-gray-300 active:bg-gray-400 active:text-white disabled:bg-gray-100">Search</button>
    </div>
    {#if professorData.length != 0}
      {#each professorData as professor (professor._id)}
        <button on:click={() => showPopupWithProps(professor)} class="card h-14 w-full border-b flex flex-row justify-between items-center hover:bg-gray-100 active:bg-gray-200">
          <h1 class="text-xl font-light m-6">{professor.gender == "male" ? "Mr." : "Ms."} {professor.name.last}, {professor.name.first} - [
            {
              professor.status == "REGULAR" ? "Regular" :
              professor.status == "PART TIME" ? "Part time" :
              professor.status == "TEMPORARY" ? "Temporary" :
              ""
            } - {professor.employment.status}]</h1>
          <!-- <h2 class="p-6 text-3xl font-light -mt-1">></h2> -->
          <!-- <button on:click={() => showPopupWithProps(professor)} class="p-6 text-3xl font-light -mt-1">></button> -->
        </button>
        <!-- <button >View Details</button> -->
        <!-- <button on:click={showSurprise}>Show me a surprise!</button> -->        
      {/each}
    {:else}
      <h1 class="text-4xl font-thin text-center">No data found.</h1>
    {/if}
  </div>
  
  <Modal show={$modal}>
	
  </Modal>