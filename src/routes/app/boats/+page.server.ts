import { getBoats, addBoat, deleteBoat } from "$lib/server/actions/boats";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { insertBoatSchema } from "$lib/db/schema/boats";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(302, "/login");

  const boats = await getBoats(locals.user.id);
  return { boats };
};

export const actions: Actions = {
  addBoat: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, "/login");

    const formData = Object.fromEntries(await request.formData());
    
    try {
      const data = insertBoatSchema.parse({
        name: formData.name,
        make: formData.make || undefined,
        model: formData.model || undefined,
        year: formData.year ? parseInt(formData.year as string) : undefined,
        length: formData.length ? parseFloat(formData.length as string) : undefined,
        imageUrl: formData.imageUrl || undefined
      });

      await addBoat(data, locals.user.id);
      return { type: 'success' };
    } catch (error) {
      console.error('Failed to add boat:', error);
      return fail(400, {
        error: 'Invalid boat data'
      });
    }
  },

  deleteBoat: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, "/login");

    const formData = Object.fromEntries(await request.formData());
    const id = parseInt(formData.id as string);

    try {
      await deleteBoat(id, locals.user.id);
      return { type: 'success' };
    } catch (error) {
      console.error('Failed to delete boat:', error);
      return fail(400, {
        error: 'Failed to delete boat'
      });
    }
  }
};