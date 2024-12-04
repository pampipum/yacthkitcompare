import { getBoat, updateBoat } from "$lib/server/actions/boats";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { insertBoatSchema } from "$lib/db/schema/boats";

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth.validate();
  if (!session) throw redirect(302, "/login");

  const boat = await getBoat(parseInt(params.id), session.user.userId);
  if (!boat) throw redirect(302, "/app/boats");

  return { boat };
};

export const actions: Actions = {
  updateBoat: async ({ params, request, locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(302, "/login");

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

      await updateBoat(parseInt(params.id), data, session.user.userId);
      return { type: 'success' };
    } catch (error) {
      console.error('Failed to update boat:', error);
      return fail(400, {
        error: 'Invalid boat data'
      });
    }
  }
};