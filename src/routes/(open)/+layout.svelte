<div class="col">
	<div class="header">Title</div>
	<slot />
</div>

<style>
	.col {
		display: flex;
		flex-direction: column;
	}

	.header {
		background-color: #f5f5f5;
	}
</style>
