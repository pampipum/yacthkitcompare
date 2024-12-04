
<script lang="ts">
  import { enhance } from "$app/forms";
  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Pencil, Trash2, DollarSign } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  
  export let boats: any[] = [];
  
  let deletingId: number | null = null;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function calculateTotalCosts(boat: any) {
    if (!boat.costs) return 0;
    return boat.costs.reduce((total: number, cost: any) => total + cost.cost, 0);
  }
</script>

{#if boats.length === 0}
  <div class="text-center py-8 text-muted-foreground">
    <p>No boats added yet. Click "Add New Boat" to get started!</p>
  </div>
{:else}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each boats as boat (boat.id)}
      <Card class="relative overflow-hidden">
        {#if boat.imageUrl}
          <img
            src={boat.imageUrl}
            alt={boat.name}
            class="w-full h-48 object-cover"
          />
        {:else}
          <div class="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
            No image available
          </div>
        {/if}
        
        <div class="p-4">
          <h3 class="text-lg font-semibold">{boat.name}</h3>
          <div class="text-sm text-muted-foreground">
            {#if boat.make || boat.model}
              <p>{[boat.make, boat.model].filter(Boolean).join(' ')}</p>
            {/if}
            {#if boat.year || boat.length}
              <p>
                {#if boat.year}{boat.year}{/if}
                {#if boat.length}
                  {#if boat.year} • {/if}
                  {boat.length}ft
                {/if}
              </p>
            {/if}
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="text-sm">
              <p class="font-medium">Total Cost:</p>
              <p class="text-primary">{formatCurrency(calculateTotalCosts(boat))}</p>
            </div>
            
            <div class="space-x-2">
              <Button variant="outline" size="icon" asChild>
                <a href="/app/boats/{boat.id}">
                  <Pencil class="h-4 w-4" />
                </a>
              </Button>
              
              <Button variant="outline" size="icon" asChild>
                <a href="/app/boats/{boat.id}/costs">
                  <DollarSign class="h-4 w-4" />
                </a>
              </Button>

              <form
                method="POST"
                action="?/deleteBoat"
                class="inline"
                use:enhance={() => {
                  deletingId = boat.id;
                  return async ({ result }) => {
                    deletingId = null;
                    if (result.type === 'success') {
                      toast.success('Boat deleted successfully');
                    } else {
                      toast.error('Failed to delete boat');
                    }
                  };
                }}
              >
                <input type="hidden" name="id" value={boat.id} />
                <Button
                  variant="destructive"
                  size="icon"
                  type="submit"
                  disabled={deletingId === boat.id}
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    {/each}
  </div>
{/if}
