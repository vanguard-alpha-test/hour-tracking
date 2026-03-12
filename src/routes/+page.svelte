<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Hour Tracking</title>
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl px-4 py-16">
		<header class="mb-12">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900">Hour Tracking</h1>
			<p class="mt-2 text-lg text-gray-600">Track time across projects with precision.</p>
		</header>

		<section class="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">System Status</h2>
			<dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="rounded-md bg-green-50 p-4">
					<dt class="text-sm font-medium text-green-700">Database</dt>
					<dd class="mt-1 text-2xl font-bold text-green-900 capitalize">{data.dbStatus}</dd>
				</div>
				<div class="rounded-md bg-blue-50 p-4">
					<dt class="text-sm font-medium text-blue-700">Projects</dt>
					<dd class="mt-1 text-2xl font-bold text-blue-900">{data.projects.length}</dd>
				</div>
				<div class="rounded-md bg-purple-50 p-4">
					<dt class="text-sm font-medium text-purple-700">Time Entries</dt>
					<dd class="mt-1 text-2xl font-bold text-purple-900">{data.entryCount}</dd>
				</div>
			</dl>
		</section>

		<section class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Projects</h2>
			{#if data.projects.length === 0}
				<p class="text-gray-500">No projects yet. The database is ready — start adding projects to track time.</p>
			{:else}
				<ul class="divide-y divide-gray-100">
					{#each data.projects as project}
						<li class="py-3">
							<span class="font-medium text-gray-900">{project.name}</span>
							<span class="ml-2 text-sm text-gray-400">{project.created_at}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</main>
