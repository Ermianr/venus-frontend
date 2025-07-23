import { asc, eq, sql } from "drizzle-orm";
import { messagesTable, usersTable } from "./schema";

export const createUser = db
    .insert(usersTable)
    .values({
        username: sql.placeholder("username"),
        email: sql.placeholder("email"),
        password: sql.placeholder("password"),
        dateBirth: sql.placeholder("dateBirth"),
    })
    .returning({ id: usersTable.id, username: usersTable.username })
    .prepare("createUser");

export const getUserByEmail = db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, sql.placeholder("email")))
    .limit(1)
    .prepare("getUserByEmail");

export const createMessage = db
    .insert(messagesTable)
    .values({
        content: sql.placeholder("content"),
        userId: sql.placeholder("userId"),
        room: sql.placeholder("room"),
    })
    .prepare("createMessage");

export const getMessagesByChannel = db.query.messagesTable
    .findMany({
        where: (fields, { eq }) => eq(fields.room, sql.placeholder("room")),
        with: {
            user: {
                columns: {
                    username: true,
                },
            },
        },
        orderBy: [asc(messagesTable.createdAt)],
        limit: 50,
    })
    .prepare("getMessagesByChannel");
