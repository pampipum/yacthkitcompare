import { db } from "$lib/server/db";
import { boats, boatCosts } from "$lib/db/schema/boats";
import { eq } from "drizzle-orm";

export async function getBoats(userId: string) {
  return await db
    .select()
    .from(boats)
    .where(eq(boats.userId, userId))
    .orderBy(boats.createdAt);
}

export async function getBoat(id: number, userId: string) {
  const [boat] = await db
    .select()
    .from(boats)
    .where(eq(boats.id, id))
    .where(eq(boats.userId, userId));
  
  if (boat) {
    const costs = await db
      .select()
      .from(boatCosts)
      .where(eq(boatCosts.boatId, id));
    
    return { ...boat, costs };
  }
  
  return null;
}

export async function addBoat(data: any, userId: string) {
  const [boat] = await db
    .insert(boats)
    .values({ ...data, userId })
    .returning();
  return boat;
}

export async function updateBoat(id: number, data: any, userId: string) {
  const [boat] = await db
    .select()
    .from(boats)
    .where(eq(boats.id, id))
    .where(eq(boats.userId, userId));
  
  if (!boat) {
    throw new Error("Boat not found or unauthorized");
  }
  
  const [updated] = await db
    .update(boats)
    .set(data)
    .where(eq(boats.id, id))
    .returning();
  
  return updated;
}

export async function deleteBoat(id: number, userId: string) {
  const [boat] = await db
    .select()
    .from(boats)
    .where(eq(boats.id, id))
    .where(eq(boats.userId, userId));
  
  if (!boat) {
    throw new Error("Boat not found or unauthorized");
  }
  
  await db.delete(boats).where(eq(boats.id, id));
}

export async function addBoatCost(boatId: number, data: any, userId: string) {
  const [boat] = await db
    .select()
    .from(boats)
    .where(eq(boats.id, boatId))
    .where(eq(boats.userId, userId));
  
  if (!boat) {
    throw new Error("Boat not found or unauthorized");
  }
  
  const [cost] = await db
    .insert(boatCosts)
    .values({ ...data, boatId })
    .returning();
  
  return cost;
}

export async function deleteBoatCost(costId: number, userId: string) {
  const [cost] = await db
    .select({
      cost: boatCosts,
      boat: boats
    })
    .from(boatCosts)
    .innerJoin(boats, eq(boats.id, boatCosts.boatId))
    .where(eq(boatCosts.id, costId))
    .where(eq(boats.userId, userId));
  
  if (!cost) {
    throw new Error("Cost not found or unauthorized");
  }
  
  await db.delete(boatCosts).where(eq(boatCosts.id, costId));
}