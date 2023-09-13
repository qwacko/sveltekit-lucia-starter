<script lang="ts">
	import { goto } from '$app/navigation';
	import IconDog from '~icons/ph/dog';
	import IconCat from '~icons/ph/cat';
	import IconFish from '~icons/ph/fish';
	import IconBird from '~icons/ph/bird';
	import IconMale from '~icons/ph/gender-male';
	import IconFemale from '~icons/ph/gender-female';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { pageInfo, urlGenerator } from '$lib/routes.js';

	export let data;

	$: params = pageInfo('/(open)/params', $page);

	$: displayData = Array(params.searchParams?.count).fill(params.searchParams?.animal);
	$: displayDataFromData = data.searchData ?  Array(data.searchData.count).fill(data.searchData.animal) : [];
</script>

{#if params.searchParams && data.searchData}
	<div class="button-row">
		<div class="icon-row">
			Data From URL : {params.searchParams?.owner.name} ({#if params.searchParams?.owner.gender === 'male'}
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
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					animal: 'cat',
					count: 1,
					owner: { gender: 'male', name: 'Cat Owner' }
				}
			}).url}>1 Cat</a
		>
		<a
			class="button"
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					animal: 'dog',
					count: 3,
					owner: { gender: 'female', name: 'Dog Owner' }
				}
			}).url}>3 Dog</a
		>
		<a
			class="button"
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.searchParams,
					animal: 'fish'
				}
			}).url}
		>
			Animal = Fish
		</a>
		<a
			class="button"
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.searchParams,
					animal: 'bird'
				}
			}).url}
		>
			Animal = Bird
		</a>
		<a
			class="button"
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.searchParams,
					owner: {
						...params.searchParams.owner,
						gender: 'male'
					}
				}
			}).url}
		>
			Owner = Male
		</a>
		<a
			class="button"
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.searchParams,
					owner: {
						...params.searchParams.owner,
						gender: 'female'
					}
				}
			}).url}
		>
			> Owner = Female
		</a>
		<a
			class="button"
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.searchParams,
					count: params.searchParams.count + 1
				}
			}).url}
		>
			+1 Animal
		</a>
		<a
			class="button"
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.searchParams,
					count: params.searchParams.count - 1
				}
			}).url}
		>
			-1 Animal
		</a>
		<button
			class="button"
			on:click={() => params.searchParams ? 
				goto(
					urlGenerator({
						address: '/(open)/params',
						searchParamsValue: {
							...params.searchParams,
							count: 0
						}
					}).url
				) : undefined}>Zero Animals</button
		>
		<form use:enhance method="post" action="?/testAction">
			<button class="submitButton" type="submit">Test Action</button>
		</form>
	</div>
{/if}

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
