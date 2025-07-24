<script setup lang="ts">
import { useWebSocket } from "#imports";
import type { MessageDB } from "~~/shared/types/message";
definePageMeta({
    middleware: ["authenticated"],
});
const { user, clear, loggedIn } = useUserSession();
const messagesState = ref<string[]>([]);
const messageState = ref<string>("");
const url = useRequestURL();

const { status, send } = useWebSocket(`ws://${url.hostname}:${url.port}/ws/chat`, {
    onMessage(_, event) {
        messagesState.value.push(event.data);
    },
});

function sendMessage() {
    if (messageState.value.trim()) {
        const messageSended = messageState.value.trim();
        send(JSON.stringify({ type: "text", content: messageSended }));
        messageState.value = "";
    }
}
onMounted(async () => {
    const response = await $fetch<MessageDB[]>("/api/message", {
        method: "GET",
    });
    response.map((msg) => messagesState.value.push(`[${msg.user.username}]: ${msg.content}`));
});
</script>

<template>
    <div v-if="loggedIn">
        <h1>Hola {{ user?.username }}</h1>
        <button @click="clear()">Borrar</button>
        <br />
        <p>{{ status }}</p>
        <input
            v-model="messageState"
            placeholder="Escribe un mensaje"
            @keydown.enter.prevent="sendMessage"
        />
        <ul>
            <li v-for="(msg, i) in messagesState" :key="i">{{ msg }}</li>
        </ul>
    </div>
</template>
