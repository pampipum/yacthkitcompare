<script lang="ts">
  import { cn } from "$lib/utils";
  import { buttonVariants, type ButtonProps } from "./index.js";

  let className: ButtonProps["class"] = undefined;
  export let variant: ButtonProps["variant"] = "default";
  export let size: ButtonProps["size"] = "default";
  export { className as class };
</script>

<button
  class={cn(buttonVariants({ variant, size, className }))}
  type="button"
  {...$$restProps}
  on:click
>
  <slot />
</button>