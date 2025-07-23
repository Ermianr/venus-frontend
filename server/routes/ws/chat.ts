import type { User } from "#auth-utils";
import type { MessageFront } from "~~/shared/types/message";

export default defineWebSocketHandler({
    async upgrade(request) {
        await requireUserSession(request);
    },
    async open(peer) {
        const { user } = await getUserSession(peer);
        peer.context.user = user;
        peer.subscribe("global");
    },
    async message(peer, msg) {
        const user = peer.context.user as User;
        const message: MessageFront = msg.json();
        await $fetch("/api/message", {
            method: "POST",
            body: {
                content: message.content,
                userId: user.id,
                room: "global",
            },
        });
        peer.send(`[${user.username}]: ${message.content}`);
        peer.publish("global", `[${user.username}]: ${message.content}`);
    },
});
