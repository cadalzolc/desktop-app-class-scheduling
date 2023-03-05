<script>
  const { ipcRenderer } = require("electron");

  import { onDestroy, onMount } from "svelte";
  import { slide } from 'svelte/transition'

  import ConfirmDialog from "../ConfirmDialog.svelte"
  import AlertDialog from "../AlertDialog.svelte";


  let Sy_List = [];
  let Sy_ID = "", SY_Start = 2020, SY_End = 2021, SY_Sem = "";
  let alertOpen = false;
  let alertOptions = {
    success: false,
    message: "Alert Box"
  }
  let curSy;

  onMount(() => {
    onRefreshlist();
    ipcRenderer.send("sy-active");
  });

  onDestroy(() => {
    ipcRenderer.removeAllListeners("sy-add");
    ipcRenderer.removeAllListeners("sy-update");
    ipcRenderer.removeAllListeners("sy-delete");
    ipcRenderer.removeAllListeners("sy-list");
    ipcRenderer.removeAllListeners("sy-active");
  })

  const onRefreshlist = () => {
    ipcRenderer.send("sy-list");
  }

  const onSY_StartInput = () => {
    SY_End = SY_Start + 1;
  };

  const onClearSySemester = () => {
    Sy_ID = "";
    SY_Start = 2020;
    SY_End = 2021;
    SY_Sem = "";
  };

  const onSaveSySemester = () => {
    const Sy = `${SY_Start}-${SY_End}`;
    const res = Sy_List.findIndex(r => r.schoolYear == Sy && r.schoolSemester == SY_Sem);
    if (res >= 0) {
      alertOpen = true;
      alertOptions = {
        success: false,
        message: `School year semester ${Sy} ${SY_Sem} is already in used`
      };
      return;
    }
    const payload = {
      SY_Start: SY_Start,
      SY_End: SY_End,
      SY_Sem: SY_Sem
    };
    ipcRenderer.send("sy-add", payload);
  };

  const onActivateSySemester = (id) => {
    const payload = Sy_List.find(r => r._id === id);
    if (payload) {
      payload.isActive = true;
      payload.isCompleted = false;
      ipcRenderer.send("sy-update", payload);
    }
  }

  const onEndSySemester = (id) => {
    const payload = Sy_List.find(r => r._id === id);
    if (payload) {
      payload.isActive = false;
      payload.isCompleted = true;
      ipcRenderer.send("sy-update", payload);
    }
  }

  const onDeleteSySemester = (id) => {
    const payload = Sy_List.find(r => r._id === id);
    Sy_List = Sy_List.filter(r => r._id !== id);
    if (payload) {
      ipcRenderer.send("sy-delete", payload);
    }
  }

  ipcRenderer.on("sy-active", (e, res) => {
    console.log(res);
    if (res.success) {
      curSy = res.data;
      return;
    }
  });

  ipcRenderer.on("sy-list", (e, res) => {
    if (res.success) Sy_List = res.data;
  });

  ipcRenderer.on("sy-add", (e, res) => {
    alertOpen = true;
    alertOptions = res;
    if (res.success) {
      onClearSySemester();
      onRefreshlist();
    }
  });

  ipcRenderer.on("sy-delete", (e, res) => {
    alertOpen = true;
    alertOptions = res;
  });

  ipcRenderer.on("sy-update", (e, res) => {
    alertOpen = true;
    alertOptions = res;
    if (res.success) {
      onRefreshlist();
    }
  });

</script>

<AlertDialog bind:alertOpen bind:alertOptions />

<form class="flex flex-col form-sy" method="post" on:submit|preventDefault={onSaveSySemester}>
  <input type="hidden" bind:value={Sy_ID} />
  <div class="flex flex-row">
    <div class="flex-row f-col" style="width: 120px;">
      <label for="SY_Start" class="px-2 mx-2 mt-2 rounded-md font-light">Start</label>
      <input bind:value={SY_Start} on:input={onSY_StartInput} name="SY_Start" type="number" min="2020" max="3000" step="1" required class="p-2 input-box  m-2 rounded-md font-light"/>
    </div>
    <div class="flex-row f-col" style="width: 120px;">
      <label for="SY_End" class="px-2 mx-2 mt-2 rounded-md font-light">End</label>
      <input bind:value={SY_End} name="SY_End" type="number" min="2020" max="3000" step="1" required readonly class="p-2 input-box  m-2 rounded-md font-light"/>
    </div>
    <div class="flex-row f-col" style="width: 200px;">
      <label for="SY_Sem" class="px-2 mx-2 mt-2 rounded-md font-light">Semester</label>
      <select bind:value={SY_Sem} name="SY_Sem" required class="p-2 input-box m-2 rounded-md font-light">
        <option value="" selected disabled>--Semester--</option>
        <option value="1st Semester">1st Semester</option>
        <option value="2nd Semester">2nd Semester</option>
        <option value="Summer Semester">Summer Semester</option>
      </select>
    </div>
  </div>
  <div class="flex flex-row justify-end" style="padding: 5px; padding-top: 5px;">
      <button type="button" on:click={onClearSySemester} class="form-sy f-btn-clear">Clear</button>
      <button type="submit" class="form-sy f-btn-add">Add SY - Semester</button>
  </div>
</form>

<div style="margin-top: 10px;">
  <div class="w-full p-2 flex justify-center pb-20 table-container">
    <table class="w-full max-w-screen drop-shadow-md table-excel">
      <thead>
        <tr>
          <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light"></th>
          <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">School Year</th>
          <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Semester</th>
          <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light">Status</th>
          <th class="py-3 px-2 text-left border border-gray-300 bg-red-800 text-white font-light"></th>
        </tr>
      </thead>
      <tbody>
        {#if !Sy_List}
        <tr>
          <td colspan="4">No record to display. Please add a new semester.</td>
        </tr>
        {:else if Sy_List.length == 0}
          <tr>
            <td colspan="4">No record to display. Please add a new semester.</td>
          </tr>
        {:else}
          {#each Sy_List as sy}
            <tr transition:slide>
                <td class="center">
                  {#if !sy.isCompleted && sy.isActive}
                    <ConfirmDialog confirmTitle="End" cancelTitle="Cancel" let:confirm="{endThis}">
                      <svg on:click="{() => endThis(onEndSySemester, sy._id)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <title>End</title>
                          <path d="M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2Z" />
                      </svg>
                      <span slot="title">End this school year semester?</span>
                      <span slot="description">You will be ending the school year semester 
                          <strong>{sy.schoolYear} {sy.schoolSemester}</strong>!
                      </span>
                    </ConfirmDialog>
                    {:else if !sy.isCompleted && !sy.isActive && !curSy}
                    <ConfirmDialog confirmTitle="Activate" cancelTitle="Cancel" let:confirm="{activateThis}">
                      <svg on:click="{() => activateThis(onActivateSySemester, sy._id)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <title>Activate</title>
                          <path d="M12 20A8 8 0 1 1 20 12A8 8 0 0 1 12 20M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Z" />
                      </svg>
                      <span slot="title">Activate this school year semester?</span>
                      <span slot="description">You are activating for the school year semester 
                        <strong>{sy.schoolYear} {sy.schoolSemester}</strong>!
                      </span>
                    </ConfirmDialog>
                  {/if}
                </td>
                <td>{sy.schoolYear}</td>
                <td>{sy.schoolSemester}</td>
                <td class="center">{sy.isCompleted ? 'Completed' : (sy.isActive ? "Active" : "")}</td>
                <td class="center">
                  {#if !sy.isCompleted && !sy.isActive}
                    <ConfirmDialog confirmTitle="Delete" cancelTitle="Cancel" let:confirm="{confirmThis}">
                        <svg on:click="{() => confirmThis(onDeleteSySemester, sy._id)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <title>Delete</title>
                          <path d="M20.37,8.91L19.37,10.64L7.24,3.64L8.24,1.91L11.28,3.66L12.64,3.29L16.97,5.79L17.34,7.16L20.37,8.91M6,19V7H11.07L18,11V19A2,2 0 0,1 16,21H8A2,2 0 0,1 6,19M8,19H16V12.2L10.46,9H8V19Z" />
                        </svg>
                      <span slot="title">Delete this school year semester?</span>
                      <span slot="description">You will be deleting the school year semester 
                        <strong>{sy.schoolYear} {sy.schoolSemester}</strong>!
                    </span>
                    </ConfirmDialog>
                  {/if}
                </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style>
  .input-box {
    border: 1px solid #ddd;
    border-radius: 0;
  }
  .form-sy .f-col {
    padding: 5px;
  }
  .form-sy .f-btn-add,
  .form-sy .f-btn-clear {
    padding: 8px 15px;
    margin-left: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  .form-sy .f-btn-add {
    background: #03A9F4;
    color: #eee;
  }
  .form-sy .f-btn-add:hover {
    background: #111fec;
    color: #eee;
  }
  .form-sy .f-btn-clear {
    background: #d3d1d1;
    color: #292727;
  }
  .form-sy .f-btn-clear:hover {
    background: #a4a5a5;
    color: #eee;
  }
</style>