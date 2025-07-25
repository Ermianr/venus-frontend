import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const queryClient = postgres(process.env.DATABASE_URL || "");

export default drizzle(queryClient, { schema });
