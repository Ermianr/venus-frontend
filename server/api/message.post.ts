import type { MessageDB } from "~~/shared/types/message";
import { createMessage } from "../db/prepared";

export default defineEventHandler(async (event) => {
    const body = (await readBody(event)) as MessageDB;
    await createMessage.execute({
        content: body.content,
        userId: body.userId,
        room: body.room,
    });
});
