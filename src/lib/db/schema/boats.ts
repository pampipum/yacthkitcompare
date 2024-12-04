import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { userTable } from "../../server/database/schema";

export const boats = sqliteTable("boats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  name: text("name").notNull(),
  make: text("make"),
  model: text("model"),
  year: integer("year"),
  length: real("length"),
  imageUrl: text("image_url"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const boatCosts = sqliteTable("boat_costs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  boatId: integer("boat_id")
    .notNull()
    .references(() => boats.id, { onDelete: 'cascade' }),
  category: text("category").notNull(),
  item: text("item").notNull(),
  cost: real("cost").notNull(),
  notes: text("notes"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

// Zod schemas for validation
export const insertBoatSchema = createInsertSchema(boats, {
  name: z.string().min(1),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  length: z.number().min(0).optional(),
  imageUrl: z.string().url().optional()
});

export const insertBoatCostSchema = createInsertSchema(boatCosts, {
  category: z.enum(["COST_TO_SAIL", "UPGRADES", "ACQUISITION"]),
  item: z.string().min(1),
  cost: z.number().min(0),
  notes: z.string().optional()
});