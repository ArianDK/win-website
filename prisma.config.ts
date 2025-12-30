import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // <-- IMPORTANT

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use a DIRECT postgres URL for migrations:
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  },
});
