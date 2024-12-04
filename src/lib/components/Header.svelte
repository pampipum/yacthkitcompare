<script lang="ts">
	import { PUBLIC_PROJECT_NAME } from '$env/static/public';
	import { page } from '$app/stores';
	import { buttonVariants } from './ui/button';
	import LogoutButton from './login/LogoutButton.svelte';
	import { Ship, Anchor } from 'lucide-svelte';
</script>

<header
	class="container border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
	<div class="flex h-14 max-w-screen-2xl items-center">
		<div class="mr-4 flex justify-between w-full">
			<div class="flex items-center">
				<a href="/" class="mr-6 flex items-center space-x-2">
					<Ship class="h-8 w-8" />
					<span class="font-bold inline-block">{PUBLIC_PROJECT_NAME}</span>
				</a>
				{#if $page.data.user}
					<nav class="flex items-center space-x-6 text-sm">
						<a
							href="/app/boats"
							class="flex items-center transition-colors hover:text-foreground/80 text-foreground/60"
						>
							<Anchor class="h-4 w-4 mr-2" />
							My Boats
						</a>
					</nav>
				{/if}
			</div>
			<div>
				{#if $page.data.user}
					<LogoutButton />
				{:else}
					<a href="/login" class={buttonVariants({ variant: 'ghost' })}>Sign in</a>
				{/if}
			</div>
		</div>
	</div>
</header>
