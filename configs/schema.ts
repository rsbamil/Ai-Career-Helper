import { integer, pgTable, varchar, json } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const HistoryTable = pgTable("historyTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recordId: varchar({ length: 255 }).notNull(),
  content: json(),
  userEmail: varchar({ length: 255 }).references(() => usersTable.email),
  createdAt: varchar({ length: 255 }),
  aiAgentType: varchar({ length: 255 }),
  metaData: varchar(),
});
