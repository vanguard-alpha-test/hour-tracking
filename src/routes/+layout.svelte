<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data.session}
	<header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
		<a href="/" class="text-sm font-semibold text-gray-900">Hour Tracking</a>
		<div class="flex items-center gap-4">
			<span class="text-sm text-gray-600">{data.session.user.email}</span>
			<form method="POST" action="/logout">
				<button
					type="submit"
					class="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
				>
					Sign Out
				</button>
			</form>
		</div>
	</header>
{/if}

{@render children()}
