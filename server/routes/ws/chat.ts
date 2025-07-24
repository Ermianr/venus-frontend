import type { User } from "#auth-utils";
import { MessageFrontSchema } from "#shared/schemas/message";

export default defineWebSocketHandler({
    async upgrade(request) {
        await requireUserSession(request);
    },
    async open(peer) {
        const { user: currentUser } = await getUserSession(peer);
        peer.context.user = currentUser;
        peer.subscribe("global");
    },
    async message(peer, msg) {
        const currentUser = peer.context.user as User;
        const messageReceived = MessageFrontSchema.safeParse(msg.json());

        if (!messageReceived.success) {
            return;
        } else if (messageReceived.data.type === "text") {
            await $fetch("/api/message", {
                method: "POST",
                body: {
                    content: messageReceived.data.content,
                    userId: currentUser.id,
                    room: "global",
                },
            });
            peer.send(`[${currentUser.username}]: ${messageReceived.data.content}`);
            peer.publish("global", `[${currentUser.username}]: ${messageReceived.data.content}`);
        }
    },
});
