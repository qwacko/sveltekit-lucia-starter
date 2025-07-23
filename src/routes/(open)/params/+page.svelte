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
	import Button from '$lib/components/Button.svelte';
	import { BluetoothConnectedIcon } from '@lucide/svelte';

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
	<div class="flex-1 flex items-center justify-center min-h-screen p-8">
		<div
			class="w-full max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
		>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
				Search Params Demo
			</h1>
			<div class="flex flex-col gap-4">
				<div class="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 mb-4">
					<div class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
						Data From URL:
					</div>
					<div class="flex flex-row gap-2 flex-wrap items-center text-gray-700 dark:text-gray-300">
						{params.current.searchParams?.owner.name}
						{#if params.current.searchParams?.owner.gender === 'male'}
							<IconMale class="w-4 h-4 text-blue-500" />
						{:else}
							<IconFemale class="w-4 h-4 text-pink-500" />
						{/if}
						{#each displayData as animal}
							{#if animal === 'cat'}
								<IconCat class="w-5 h-5 text-orange-500" />
							{:else if animal === 'dog'}
								<IconDog class="w-5 h-5 text-brown-500" />
							{:else if animal === 'fish'}
								<IconFish class="w-5 h-5 text-blue-500" />
							{:else if animal === 'bird'}
								<IconBird class="w-5 h-5 text-green-500" />
							{:else}
								<span class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{animal}</span>
							{/if}
						{/each}
					</div>
				</div>

				<div class="bg-purple-50 dark:bg-purple-950/50 rounded-lg p-4 mb-6">
					<div class="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
						Data From Server:
					</div>
					<div class="flex flex-row gap-2 flex-wrap items-center text-gray-700 dark:text-gray-300">
						{data.searchData.owner.name}
						{#if data.searchData.owner.gender === 'male'}
							<IconMale class="w-4 h-4 text-blue-500" />
						{:else}
							<IconFemale class="w-4 h-4 text-pink-500" />
						{/if}
						{#each displayDataFromData as animal}
							{#if animal === 'cat'}
								<IconCat class="w-5 h-5 text-orange-500" />
							{:else if animal === 'dog'}
								<IconDog class="w-5 h-5 text-brown-500" />
							{:else if animal === 'fish'}
								<IconFish class="w-5 h-5 text-blue-500" />
							{:else if animal === 'bird'}
								<IconBird class="w-5 h-5 text-green-500" />
							{:else}
								<span class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{animal}</span>
							{/if}
						{/each}
					</div>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<Button
						size="sm"
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
						size="sm"
						href={urlGenerator({
							address: '/(open)/params',
							searchParamsValue: {
								animal: 'dog',
								count: 3,
								owner: { gender: 'female', name: 'Dog Owner' }
							}
						}).url}>3 Dogs</Button
					>
					<Button
						size="sm"
						variant="secondary"
						href={urlGenerator({
							address: '/(open)/params',
							searchParamsValue: {
								...params.current.searchParams,
								animal: 'fish'
							}
						}).url}
					>
						🐟 Fish
					</Button>
					<Button
						size="sm"
						variant="secondary"
						href={urlGenerator({
							address: '/(open)/params',
							searchParamsValue: {
								...params.current.searchParams,
								animal: 'bird'
							}
						}).url}
					>
						🐦 Bird
					</Button>
					<Button
						size="sm"
						variant="outline"
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
						👨 Male
					</Button>
					<Button
						size="sm"
						variant="outline"
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
						👩 Female
					</Button>
					<Button
						size="sm"
						variant="ghost"
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
						size="sm"
						variant="ghost"
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
				</div>

				<div class="flex gap-2 mt-4">
					<Button
						size="sm"
						variant="destructive"
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
								: undefined}>Clear</Button
					>
					<form use:enhance method="post" action="?/testAction" class="flex-1">
						<Button size="sm" variant="outline" type="submit" class="w-full">Test Action</Button>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}
