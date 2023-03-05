<script>

export let alertOpen;
export let alertOptions = {
    success: false,
    message: ""
};

let dialog;

$: if (dialog && alertOpen) {
    dialog.showModal();
};
</script>

<dialog bind:this={dialog} 
        on:close={() => (alertOpen = false)}
	    on:click|self={() => dialog.close()}>
	<div on:click|stopPropagation class="alert-container">
		<div class="{alertOptions.success === true ? 'alert-box success' : 'alert-box failed'}">
            <div>
                <strong>{alertOptions.message}</strong>
                <!-- svelte-ignore a11y-autofocus -->
                <button title="Close" class="btn-close" autofocus on:click={() => dialog.close()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff;">
                        <title>Close</title>
                        <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                    </svg>
                </button>
            </div>
        </div>
	</div>
</dialog>

<style>
    dialog {
		overflow: hidden;
        position: relative;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
    .alert-container {
        position: fixed;
        display: flex;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        justify-content: center;
        align-items: center;
    }
    .alert-box {
        min-height: 50px;
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
        padding: 20px;
        font-size: 13px;
        border-radius: 3px;
    }
    .success {
        background: #4CAF50;
        color: #fff;
    }
    .failed {
        background: #e31a0b;
        color: #fff;
    }
    .btn-close {
        float: right;
        cursor: pointer;
        position: relative;
        width: 15px;
        height: 24px;
        right: -15px;
        top: -16px;
    }
    .btn-close > svg{
    fill: #fff;
    }
</style>