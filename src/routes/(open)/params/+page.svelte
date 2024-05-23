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
	import Button from '$lib/components/shadcn/ui/button/button.svelte';
	import { BluetoothConnectedIcon } from 'lucide-svelte';

	let { data } = $props();

	let params = $derived(pageInfo('/(open)/params', $page));

	let displayData = $derived(
		Array(params.current.searchParams?.count).fill(params.current.searchParams?.animal)
	);
	let displayDataFromData = $derived(
		data.searchData ? Array(data.searchData.count).fill(data.searchData.animal) : []
	);
</script>

{#if params.current.searchParams && data.searchData}
	<div class="flex flex-col gap-4 items-stretch self-center p-4 w-96">
		<div class="flex flex-row gap-2 flex-wrap">
			Data From URL : {params.current.searchParams?.owner.name} ({#if params.current.searchParams?.owner.gender === 'male'}
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
		<div class="flex flex-row gap-2 flex-wrap">
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
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					animal: 'cat',
					count: 1,
					owner: { gender: 'male', name: 'Cat Owner' }
				}
			}).url}>1 Cat</Button
		>
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					animal: 'dog',
					count: 3,
					owner: { gender: 'female', name: 'Dog Owner' }
				}
			}).url}>3 Dog</Button
		>
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.current.searchParams,
					animal: 'fish'
				}
			}).url}
		>
			Animal = Fish
		</Button>
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.current.searchParams,
					animal: 'bird'
				}
			}).url}
		>
			Animal = Bird
		</Button>
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.current.searchParams,
					owner: {
						...params.current.searchParams.owner,
						gender: 'male'
					}
				}
			}).url}
		>
			Owner = Male
		</Button>
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.current.searchParams,
					owner: {
						...params.current.searchParams.owner,
						gender: 'female'
					}
				}
			}).url}
		>
			Owner = Female
		</Button>
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.current.searchParams,
					count: params.current.searchParams.count + 1
				}
			}).url}
		>
			+1 Animal
		</Button>
		<Button
			href={urlGenerator({
				address: '/(open)/params',
				searchParamsValue: {
					...params.current.searchParams,
					count: params.current.searchParams.count - 1
				}
			}).url}
		>
			-1 Animal
		</Button>
		<Button
			onclick={() =>
				params.current.searchParams
					? goto(
							urlGenerator({
								address: '/(open)/params',
								searchParamsValue: {
									...params.current.searchParams,
									count: 0
								}
							}).url
						)
					: undefined}>Zero Animals</Button
		>
		<form use:enhance method="post" action="?/testAction">
			<Button type="submit">Test Action</Button>
		</form>
	</div>
{/if}
