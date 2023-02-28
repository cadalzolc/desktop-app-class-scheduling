<script>
  const { ipcRenderer } = require("electron");
  import { deleteWindowStatus, selectedData, viewComponentValue, editWindowStatus , tbdData } from "../stores/ui";
  import { fly, fade } from "svelte/transition";
  import { onDestroy } from "svelte";
  let message = "Do you want to delete this?"
  let disableWindow = false;

  let deleteRequest = () => {
    disableWindow = true;
    console.log('deleteRequest : ' + $viewComponentValue);

    switch ($viewComponentValue) {
      case 1:
        console.log("Entered 1");
        ipcRenderer.send("delete-course-data", $selectedData._id);
        break;
      case 2:
        console.log("Entered 2");
        ipcRenderer.send("delete-room-data", $selectedData._id);
        break;
      case 3:
        console.log("Entered 3");
        ipcRenderer.send("delete-professor-data", $selectedData._id);
        break;
      case 4:
        console.log("Entered 4");
        ipcRenderer.send("delete-program-data", $selectedData._id);
        break;
      case 8:
        console.log("Entered 8");
        // ipcRenderer.send("delete-advisetime", $selectedData._id);
        
        let scheduleData = $selectedData;
        scheduleData.type = 'delete';
        scheduleData.day = $selectedData.day;
        //     _id: $selectedData._id,
        //     day: $selectedData.day,
        //     type : 'delete',
        // }
        
        ipcRenderer.send("save-data-professor-advisetime", scheduleData);
        break;        
    }
  }

  onDestroy(() => {
    ipcRenderer.removeAllListeners("delete-course-data");
    ipcRenderer.removeAllListeners("delete-room-data");
    ipcRenderer.removeAllListeners("delete-professor-data");
    ipcRenderer.removeAllListeners("delete-program-data");
    ipcRenderer.removeAllListeners("delete-advisetime");
    ipcRenderer.removeAllListeners("save-data-professor-advisetime");
  });

  ipcRenderer.on("delete-course-data", (event, res) => {
    console.log(res)
    if (res.success) {
      message = res.message;
      setTimeout(() => {
        $selectedData = "";
        $deleteWindowStatus = false;
        message = "Do you want to delete this?";
        disableWindow = false;
        ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-program-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-room-data", $selectedData._id);
        ipcRenderer.send("retrieve-course-data");
        $editWindowStatus = false;
      }, 1000);
    }
  })
  ipcRenderer.on("delete-room-data", (event, res) => {
    console.log(res)
    if (res.success) {
      message = res.message;
      setTimeout(() => {
        $selectedData = "";
        $deleteWindowStatus = false;
        message = "Do you want to delete this?";
        disableWindow = false;
        ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-program-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-room-data", $selectedData._id);
      }, 1000);
    }
  })
  ipcRenderer.on("delete-professor-data", (event, res) => {
    console.log(res)
    if (res.success) {
      message = res.message;
      setTimeout(() => {
        $selectedData = "";
        $deleteWindowStatus = false;
        message = "Do you want to delete this?";
        disableWindow = false;
        ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-program-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-room-data", $selectedData._id);
      }, 1000);
    }
  })
  ipcRenderer.on("delete-program-data", (event, res) => {
    console.log(res)
    if (res.success) {
      message = res.message;
      setTimeout(() => {
        $selectedData = "";
        $deleteWindowStatus = false;
        message = "Do you want to delete this?";
        disableWindow = false;
        ipcRenderer.send("retrieve-schedule-professor-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-program-data", $selectedData._id);
        ipcRenderer.send("retrieve-schedule-room-data", $selectedData._id);
      }, 1000);
    }
  })

  ipcRenderer.on("save-data-professor-advisetime", (event, status) => {
      setTimeout(() => {
        if (status.success == true) {
          ipcRenderer.send("retrieve-professor-data-advisetime" , $selectedData._id);
          $selectedData.advisingTime = status.data;
          $deleteWindowStatus = false;
          message = "Do you want to delete this?";
          disableWindow = false;
        }
      }, 1000);
    }) 
</script>

{#if $deleteWindowStatus}
  <div transition:fade={{duration: 100}} class="bg-black fixed z-10 w-screen h-screen bg-opacity-20 flex justify-center px-6 items-center backdrop-filter backdrop-blur-sm" >

    <div transition:fly={{y: 200, duration: 200}} class=" w-80 h-auto z-20 drop-shadow-md bg-white fixed flex flex-col rounded-md">
      <h1 class="w-full p-2 px-4 text-2xl font-light text-center rounded-t-md">
        {message}
      </h1>
      <div class="flex flex-col justify-center items-center p-2">
        <button disabled={disableWindow} on:click={() => deleteWindowStatus.set(!$deleteWindowStatus)} class="w-4/6 p-1 mb-1 mt-1 rounded-full hover:drop-shadow-md hover:bg-white active:bg-gray-200 font-thin">No, go back</button>
        <button disabled={disableWindow} on:click={deleteRequest} class="w-4/6 p-1 mb-1 rounded-full hover:drop-shadow-md hover:bg-red-800 active:bg-red-900 hover:text-white font-thin">Yes, continue</button>
      </div>
    </div>

  </div>
{/if}