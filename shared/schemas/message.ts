import * as z from "zod";

export const MessageFrontSchema = z.object({
    type: z.enum(["text", "ping"]),
    content: z.string().min(1).max(1000),
});
