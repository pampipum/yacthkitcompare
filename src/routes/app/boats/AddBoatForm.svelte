<script lang="ts">
  import { enhance } from "$app/forms";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let loading = false;
</script>

<div class="p-4 border rounded-lg bg-muted/50 mb-6">
  <form
    method="POST"
    action="?/addBoat"
    use:enhance={() => {
      loading = true;
      return async ({ result, update }) => {
        loading = false;
        if (result.type === 'success') {
          toast.success('Boat added successfully');
          dispatch('added');
          await update();
        } else {
          toast.error('Failed to add boat');
        }
      };
    }}
    class="space-y-4"
  >
    <div class="grid gap-4">
      <div class="space-y-2">
        <Label for="name">Boat Name *</Label>
        <Input id="name" name="name" required />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="make">Make</Label>
          <Input id="make" name="make" />
        </div>
        <div class="space-y-2">
          <Label for="model">Model</Label>
          <Input id="model" name="model" />
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="year">Year</Label>
          <Input id="year" name="year" type="number" min="1900" max={new Date().getFullYear() + 1} />
        </div>
        <div class="space-y-2">
          <Label for="length">Length (ft)</Label>
          <Input id="length" name="length" type="number" min="0" step="0.1" />
        </div>
      </div>

      <div class="space-y-2">
        <Label for="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/boat-image.jpg" />
      </div>
    </div>

    <Button type="submit" disabled={loading}>
      {loading ? 'Adding...' : 'Add Boat'}
    </Button>
  </form>
</div>
