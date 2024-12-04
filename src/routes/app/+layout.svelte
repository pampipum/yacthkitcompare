<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import { Toaster } from 'svelte-sonner';
</script>

<Header />
<main class="min-h-screen">
  <slot />
</main>
<Toaster />
