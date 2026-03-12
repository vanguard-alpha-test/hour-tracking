<script lang="ts">
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();
</script>

<svelte:head>
	<title>Hour Tracking</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-12">
	{#if data.session}
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Welcome back</h1>
			<p class="mt-2 text-gray-600">Signed in as {data.session.user.email}</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<a
				href="/hours"
				class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
			>
				<h2 class="text-lg font-semibold text-gray-900">Log Hours</h2>
				<p class="mt-1 text-sm text-gray-500">Record time entries for your tasks.</p>
			</a>
			<a
				href="/reports"
				class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
			>
				<h2 class="text-lg font-semibold text-gray-900">Reports</h2>
				<p class="mt-1 text-sm text-gray-500">View summaries and export your time data.</p>
			</a>
			<a
				href="/dashboard"
				class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
			>
				<h2 class="text-lg font-semibold text-gray-900">Dashboard</h2>
				<p class="mt-1 text-sm text-gray-500">Overview of your tracked hours.</p>
			</a>
		</div>
	{:else}
		<div class="flex flex-col items-center py-24 text-center">
			<h1 class="text-4xl font-bold text-gray-900">Hour Tracking</h1>
			<p class="mt-4 max-w-md text-lg text-gray-600">
				Track your work hours, generate reports, and stay on top of your time.
			</p>
			<a
				href="/login"
				class="mt-8 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
			>
				Sign In
			</a>
		</div>
	{/if}
</div>
