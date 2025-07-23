import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { date, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: text().primaryKey().$default(createId),
    username: text().notNull().unique(),
    email: text().notNull().unique(),
    password: text().notNull(),
    dateBirth: date("date_birth", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
    messages: many(messagesTable),
}));

export const messagesTable = pgTable("messages", {
    id: serial("id").primaryKey(),
    content: text().notNull(),
    userId: text().references(() => usersTable.id),
    room: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const messageRelations = relations(messagesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [messagesTable.userId],
        references: [usersTable.id],
    }),
}));
