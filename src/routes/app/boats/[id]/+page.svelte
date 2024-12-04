
<script lang="ts">
  import { enhance } from "$app/forms";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { ArrowLeft } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import type { PageData } from "./$types";

  export let data: PageData;
  let loading = false;
</script>

<div class="container mx-auto p-4 space-y-6">
  <div class="flex items-center space-x-4">
    <a href="/app/boats" class="inline-flex items-center text-muted-foreground hover:text-foreground">
      <ArrowLeft class="h-4 w-4 mr-2" />
      Back to Boats
    </a>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Edit {data.boat.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <form
        method="POST"
        action="?/updateBoat"
        use:enhance={() => {
          loading = true;
          return async ({ result }) => {
            loading = false;
            if (result.type === 'success') {
              toast.success('Boat updated successfully');
            } else {
              toast.error('Failed to update boat');
            }
          };
        }}
        class="space-y-4 max-w-xl"
      >
        <div class="grid gap-4">
          <div class="space-y-2">
            <Label for="name">Boat Name *</Label>
            <Input id="name" name="name" value={data.boat.name} required />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="make">Make</Label>
              <Input id="make" name="make" value={data.boat.make ?? ''} />
            </div>
            <div class="space-y-2">
              <Label for="model">Model</Label>
              <Input id="model" name="model" value={data.boat.model ?? ''} />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="year">Year</Label>
              <Input 
                id="year" 
                name="year" 
                type="number" 
                min="1900" 
                max={new Date().getFullYear() + 1} 
                value={data.boat.year ?? ''} 
              />
            </div>
            <div class="space-y-2">
              <Label for="length">Length (ft)</Label>
              <Input 
                id="length" 
                name="length" 
                type="number" 
                min="0" 
                step="0.1" 
                value={data.boat.length ?? ''} 
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="imageUrl">Image URL</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl" 
              type="url" 
              placeholder="https://example.com/boat-image.jpg" 
              value={data.boat.imageUrl ?? ''} 
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Cost Breakdown</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="mb-4">
        <Button asChild>
          <a href="/app/boats/{data.boat.id}/costs">Manage Costs</a>
        </Button>
      </div>

      {#if data.boat.costs && data.boat.costs.length > 0}
        <div class="space-y-4">
          {#each ['COST_TO_SAIL', 'UPGRADES', 'ACQUISITION'] as category}
            {@const categoryCosts = data.boat.costs.filter(c => c.category === category)}
            {#if categoryCosts.length > 0}
              <div>
                <h3 class="font-medium mb-2">
                  {category.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                </h3>
                <div class="space-y-2">
                  {#each categoryCosts as cost}
                    <div class="flex justify-between items-center text-sm">
                      <span>{cost.item}</span>
                      <span class="font-medium">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cost.cost)}
                      </span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          {/each}
        </div>
      {:else}
        <p class="text-muted-foreground">No costs added yet. Click "Manage Costs" to get started.</p>
      {/if}
    </CardContent>
  </Card>
</div>
