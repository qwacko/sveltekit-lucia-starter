<div class="col">
	<div class="header bg-blue-200">Title</div>
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
