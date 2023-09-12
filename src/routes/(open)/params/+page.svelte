<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchSchema } from './searchSchema.js';
	import { validatedSearchParamsStore } from 'sksearchparams';
	import IconDog from '~icons/ph/dog';
	import IconCat from '~icons/ph/cat';
	import IconFish from '~icons/ph/fish';
	import IconBird from '~icons/ph/bird';
	import IconMale from '~icons/ph/gender-male';
	import IconFemale from '~icons/ph/gender-female';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let data;

	const searchParams = validatedSearchParamsStore(searchSchema.passthrough().parse, page);

	$: displayData = Array($searchParams.value.count).fill($searchParams.value.animal);
	$: displayDataFromData = Array(data.searchData.count).fill(data.searchData.animal);
</script>

<div class="button-row">
	<div class="icon-row">
		Data From URL : {$searchParams.value.owner.name} ({#if $searchParams.value.owner.gender === 'male'}
			<IconMale />
		{:else}
			<IconFemale />
		{/if})

		{#each displayData as animal}
			{#if animal === 'cat'}
				<IconCat />
			{:else if animal === 'dog'}
				<IconDog />
			{:else if animal === 'fish'}
				<IconFish />
			{:else if animal === 'bird'}
				<IconBird />
			{:else}
				{animal},
			{/if}
		{/each}
	</div>
	<div class="icon-row">
		Data From Data: {data.searchData.owner.name} ({#if data.searchData.owner.gender === 'male'}
			<IconMale />
		{:else}
			<IconFemale />
		{/if}) {#each displayDataFromData as animal}
			{#if animal === 'cat'}
				<IconCat />
			{:else if animal === 'dog'}
				<IconDog />
			{:else if animal === 'fish'}
				<IconFish />
			{:else if animal === 'bird'}
				<IconBird />
			{:else}
				{animal},
			{/if}
		{/each}
	</div>
	<a
		class="button"
		href={$searchParams.resetSearch({
			animal: 'cat',
			count: 1,
			owner: { gender: 'male', name: 'Cat Owner' }
		})}>1 Cat</a
	>
	<a
		class="button"
		href={$searchParams.resetSearch({
			animal: 'dog',
			count: 3,
			owner: { gender: 'female', name: 'Dog Owner' }
		})}>3 Dog</a
	>
	<a class="button" href={$searchParams.updateSearch({ animal: 'fish' })}> Animal = Fish </a>
	<a class="button" href={$searchParams.updateSearch({ animal: 'bird' })}> Animal = Bird </a>
	<a
		class="button"
		href={$searchParams.updateSearch({
			owner: { gender: 'male', name: $searchParams.value.owner.name }
		})}
	>
		Owner = Male
	</a>
	<a
		class="button"
		href={$searchParams.updateSearch({
			owner: { gender: 'female', name: $searchParams.value.owner.name }
		})}
	>
		Owner = Female
	</a>
	<a class="button" href={$searchParams.updateSearch({ count: $searchParams.value.count + 1 })}>
		+1 Animal
	</a>
	<a class="button" href={$searchParams.updateSearch({ count: $searchParams.value.count - 1 })}>
		-1 Animal
	</a>
	<button class="button" on:click={() => goto($searchParams.updateSearch({ count: 0 }))}
		>Zero Animals</button
	>
	<form use:enhance method="post" action="?/testAction">
		<button class="submitButton" type="submit">Test Action</button>
	</form>
</div>

<style>
	.submitButton {
		margin: 2rem 0.5rem;
		width: 20rem;
		text-align: center;
		border-width: 1px;
		border-color: black;
		border-radius: 0.5rem;
		background: rgb(115, 94, 234);
	}

	.button-row {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 1rem;
	}

	.icon-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.button {
		margin: 0 0.5rem;
		width: 20rem;
		text-align: center;
		border-width: 1px;
		border-color: black;
		border-radius: 0.5rem;
		background: rgb(94 234 212);
	}
</style>
