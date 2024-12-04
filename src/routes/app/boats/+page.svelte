
<script lang="ts">
  import { enhance } from "$app/forms";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { PlusCircle } from "lucide-svelte";
  import AddBoatForm from "./AddBoatForm.svelte";
  import BoatList from "./BoatList.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let showAddForm = false;

  function toggleAddForm() {
    console.log('Toggle button clicked. Current showAddForm:', showAddForm);
    showAddForm = !showAddForm;
    console.log('New showAddForm value:', showAddForm);
  }
</script>

<div class="container mx-auto p-4 space-y-6">
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">🚤 Boat Comparison Tool</CardTitle>
      <div class="text-muted-foreground">
        <p class="mb-2">Compare different boats and their associated costs to make an informed decision.</p>
        <div class="mt-2 space-y-1 text-sm">
          <p>• Start by clicking "Add New Boat" and enter the vessel's basic information</p>
          <p>• Use the edit button (✏️) to add detailed costs in three categories: Cost To Sail, Upgrades, and Acquisition</p>
          <p>• Add boat images by providing image URLs</p>
          <p>• All your boats are automatically saved to your account</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="mb-6">
        <Button on:click={toggleAddForm}>
          <PlusCircle class="mr-2 h-4 w-4" />
          {showAddForm ? 'Cancel' : 'Add New Boat'}
        </Button>
      </div>

      {#if showAddForm}
        <AddBoatForm on:added={() => {
          console.log('Form submitted successfully');
          showAddForm = false;
        }} />
      {/if}

      <BoatList boats={data.boats} />
    </CardContent>
  </Card>
</div>
