<script lang="ts">
	import IconAccountBox from '~icons/mdi/pencil';

	export let message: string | null | undefined = undefined;
</script>

<button on:click on:keydown on:keypress class="wrapper">
	{#if message}<div class="popover">{message}</div>{/if}
	<div class="icon">
		<IconAccountBox />
	</div>
</button>

<style>
	.popover {
		position: absolute;
		top: 100%;
		left: 100%;
		transform: translate(-50%, 0.25rem);
		padding: 0.5rem;
		border-radius: 0.5rem;
		background-color: rgb(255, 255, 255);
		border: 1px solid rgb(222, 220, 255);
		box-shadow: 0 0 0.5rem 0.1rem rgb(222, 220, 255);
		opacity: 0;
		transition: 0.2s linear;
	}

	.wrapper:hover .popover {
		opacity: 1;
		scale: 0.8;
		visibility: visible;
		/* transform: translate(0, 0); */
	}

	.wrapper {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
		width: 24px;
		height: 24px;
		border-radius: 20px;
		transition: 0.2s ease-in-out;
		background-color: rgb(222, 220, 255);
		border: 1px solid rgb(222, 220, 255);
		margin: 2px;
	}

	.icon {
		position: absolute;
		top: 20%;
		left: 20%;
		font-size: 0.7rem;
		color: rgb(46, 35, 255);
	}

	.wrapper:hover {
		transform: scale(1.2);
		border: 1px solid rgb(46, 35, 255);
	}
</style>
