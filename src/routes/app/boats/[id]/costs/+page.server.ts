import { getBoat, addBoatCost, deleteBoatCost } from "$lib/server/actions/boats";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { insertBoatCostSchema } from "$lib/db/schema/boats";

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth.validate();
  if (!session) throw redirect(302, "/login");

  const boat = await getBoat(parseInt(params.id), session.user.userId);
  if (!boat) throw redirect(302, "/app/boats");

  return { boat };
};

export const actions: Actions = {
  addCost: async ({ params, request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(302, "/login");

    const formData = Object.fromEntries(await request.formData());
    
    try {
      const data = insertBoatCostSchema.parse({
        category: formData.category,
        item: formData.item,
        cost: parseFloat(formData.cost as string),
        notes: formData.notes || undefined
      });

      await addBoatCost(parseInt(params.id), data, session.user.userId);
      return { type: 'success' };
    } catch (error) {
      console.error('Failed to add cost:', error);
      return fail(400, {
        error: 'Invalid cost data'
      });
    }
  },

  deleteCost: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(302, "/login");

    const formData = Object.fromEntries(await request.formData());
    const costId = parseInt(formData.costId as string);

    try {
      await deleteBoatCost(costId, session.user.userId);
      return { type: 'success' };
    } catch (error) {
      console.error('Failed to delete cost:', error);
      return fail(400, {
        error: 'Failed to delete cost'
      });
    }
  }
};