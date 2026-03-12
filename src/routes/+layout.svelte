<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { signOut } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { children, data } = $props();

	async function handleLogout() {
		await signOut();
		await goto('/login');
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if data.user}
	<header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
		<span class="text-sm text-gray-600">{data.user.email}</span>
		<button
			onclick={handleLogout}
			class="rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Sign Out
		</button>
	</header>
{/if}

{@render children()}
