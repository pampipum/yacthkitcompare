import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { TURSO_DB_URL, TURSO_DB_AUTH_TOKEN } from "$env/static/private";
import * as authSchema from "./database/schema";
import * as boatSchema from "../db/schema/boats";

const client = createClient({
  url: TURSO_DB_URL ?? "file:local.db",
  authToken: TURSO_DB_AUTH_TOKEN
});

export const db = drizzle(client, { 
  schema: {
    ...authSchema,
    ...boatSchema
  }
});