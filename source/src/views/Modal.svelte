<!-- <script context="module" lang="ts">
	let onTop   //keeping track of which open modal is on top
	const modals={}  //all modals get registered here for easy future access
	
	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	export function getModal(id=''){
		return modals[id]
	}
</script>

<script lang="ts">
import {onDestroy} from 'svelte'
	
let topDiv
let visible=false
let prevOnTop
let closeCallback

export let id=''

function keyPress(ev){
	//only respond if the current modal is the top one
	if(ev.key=="Escape" && onTop==topDiv) close() //ESC
}

/**  API **/
function open(callback){
	closeCallback=callback
	if(visible) return
	prevOnTop=onTop
	onTop=topDiv
	window.addEventListener("keydown",keyPress)
	
	//this prevents scrolling of the main window on larger screens
	document.body.style.overflow="hidden" 

	visible=true
	//Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
	document.body.appendChild(topDiv)
}
	
function close(retVal){
	if(!visible) return
	window.removeEventListener("keydown",keyPress)
	onTop=prevOnTop
	if(onTop==null) document.body.style.overflow=""
	visible=false
	if(closeCallback) closeCallback(retVal)
}
	
//expose the API
modals[id]={open,close}
	
onDestroy(()=>{
	delete modals[id]
	window.removeEventListener("keydown",keyPress)
})
	
</script>

<div id="topModal" class:visible bind:this={topDiv} on:click={()=>close()}>
	<div id='modal' on:click|stopPropagation={()=>{}}>
		<svg id="close" on:click={()=>close()} viewBox="0 0 12 12">
			<circle cx=6 cy=6 r=6 />
			<line x1=3 y1=3 x2=9 y2=9 />
			<line x1=9 y1=3 x2=3 y2=9 />
		</svg>
		<div id='modal-content'>
			<slot></slot>
		</div>
	</div>
</div>

<style>
	#topModal {
		visibility: hidden;
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #4448;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#modal {
		position: relative;
		border-radius: 6px;
		background: white;
    border: 2px solid #000;
		filter: drop-shadow(5px 5px 5px #555);
		padding: 1em;
	}

	.visible {
		visibility: visible !important;
	}

	#close {
		position: absolute;
		top:-12px;
		right:-12px;
		width:24px;
		height:24px;
		cursor: pointer;
		fill:#F44;
		transition: transform 0.3s;
	}	

	#close:hover {
		transform: scale(2);
	}

	#close line {
		stroke:#FFF;
		stroke-width:2;
	}
	#modal-content {
		max-width: calc(100vw - 20px);
		max-height: calc(100vh - 20px);
		overflow: auto;
	}
</style> -->

<script>
    import EditCourse from "./EditWindowViews/EditCourse.svelte";
    import EditProfessor from "./EditWindowViews/EditProfessor.svelte";
    import EditProgram from "./EditWindowViews/EditProgram.svelte";
    import EditRoom from "./EditWindowViews/EditRoom.svelte";
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
        <h1 class="w-full p-2 text-2xl font-light text-center text-white bg-yellow-400 rounded-t-md drop-shadow-md">Edit Existing {headerTitle[$viewComponentValue - 1]}</h1>
  
        {#if $viewComponentValue == 1}
          <EditCourse />
        {:else if $viewComponentValue == 2}
          <EditRoom />
        {:else if $viewComponentValue == 3}
          <EditProfessor />
        {:else if $viewComponentValue == 4}
          <EditProgram />
        {/if}
      </div>
  
    </div>
  {/if}