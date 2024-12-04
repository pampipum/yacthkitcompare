
<script lang="ts">
  import { enhance } from "$app/forms";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ArrowLeft, Trash2 } from "lucide-svelte";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "$lib/components/ui/select";
  import { toast } from "svelte-sonner";
  import type { PageData } from "./$types";

  export let data: PageData;
  let loading = false;
  let selectedCategory = "COST_TO_SAIL";

  const categories = [
    { value: "COST_TO_SAIL", label: "Cost To Sail" },
    { value: "UPGRADES", label: "Upgrades" },
    { value: "ACQUISITION", label: "Acquisition" }
  ];

  let deletingId: number | null = null;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function calculateCategoryTotal(category: string) {
    if (!data.boat.costs) return 0;
    return data.boat.costs
      .filter(cost => cost.category === category)
      .reduce((total, cost) => total + cost.cost, 0);
  }

  function calculateTotalCosts() {
    if (!data.boat.costs) return 0;
    return data.boat.costs.reduce((total, cost) => total + cost.cost, 0);
  }
</script>

<div class="container mx-auto p-4 space-y-6">
  <div class="flex items-center justify-between">
    <a href="/app/boats/{data.boat.id}" class="inline-flex items-center text-muted-foreground hover:text-foreground">
      <ArrowLeft class="h-4 w-4 mr-2" />
      Back to {data.boat.name}
    </a>
    <div class="text-right">
      <p class="text-sm text-muted-foreground">Total Cost</p>
      <p class="text-xl font-semibold text-primary">{formatCurrency(calculateTotalCosts())}</p>
    </div>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Manage Costs - {data.boat.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <form
        method="POST"
        action="?/addCost"
        use:enhance={() => {
          loading = true;
          return async ({ result, form }) => {
            loading = false;
            if (result.type === 'success') {
              toast.success('Cost added successfully');
              form.reset();
            } else {
              toast.error('Failed to add cost');
            }
          };
        }}
        class="space-y-4 max-w-xl mb-8"
      >
        <div class="grid gap-4">
          <div class="space-y-2">
            <Label for="category">Category *</Label>
            <Select name="category" bind:value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {#each categories as category}
                  <SelectItem value={category.value}>{category.label}</SelectItem>
                {/each}
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="item">Item Description *</Label>
            <Input id="item" name="item" required />
          </div>

          <div class="space-y-2">
            <Label for="cost">Cost ($) *</Label>
            <Input id="cost" name="cost" type="number" min="0" step="0.01" required />
          </div>

          <div class="space-y-2">
            <Label for="notes">Notes</Label>
            <Textarea id="notes" name="notes" />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Cost'}
        </Button>
      </form>

      <div class="space-y-6">
        {#each categories as category}
          {@const categoryCosts = data.boat.costs?.filter(c => c.category === category.value) ?? []}
          <div>
            <h3 class="text-lg font-medium mb-2 flex justify-between items-center">
              <span>{category.label}</span>
              <span class="text-primary">{formatCurrency(calculateCategoryTotal(category.value))}</span>
            </h3>
            {#if categoryCosts.length > 0}
              <div class="space-y-2">
                {#each categoryCosts as cost}
                  <div class="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p class="font-medium">{cost.item}</p>
                      {#if cost.notes}
                        <p class="text-sm text-muted-foreground">{cost.notes}</p>
                      {/if}
                    </div>
                    <div class="flex items-center space-x-4">
                      <span class="font-medium">{formatCurrency(cost.cost)}</span>
                      <form
                        method="POST"
                        action="?/deleteCost"
                        class="inline"
                        use:enhance={() => {
                          deletingId = cost.id;
                          return async ({ result }) => {
                            deletingId = null;
                            if (result.type === 'success') {
                              toast.success('Cost deleted successfully');
                            } else {
                              toast.error('Failed to delete cost');
                            }
                          };
                        }}
                      >
                        <input type="hidden" name="costId" value={cost.id} />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                          disabled={deletingId === cost.id}
                          class="h-8 w-8 hover:bg-destructive/10"
                        >
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-muted-foreground">No {category.label.toLowerCase()} costs added yet.</p>
            {/if}
          </div>
        {/each}
      </div>
    </CardContent>
  </Card>
</div>
