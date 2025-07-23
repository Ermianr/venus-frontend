<script setup lang="ts">
import { useWebSocket } from "#imports";
import type { MessageDB } from "~~/shared/types/message";
definePageMeta({
    middleware: ["authenticated"],
});
const { user, clear, loggedIn } = useUserSession();
const messages = ref<string[]>([]);
const message = ref<string>("");

const { status, send } = useWebSocket(`ws://localhost:3000/ws/chat`, {
    onMessage(_, event) {
        messages.value.push(event.data);
    },
});

function sendMessage() {
    const msg = message.value.trim();
    send(JSON.stringify({ type: "text", content: msg }));
    message.value = "";
}
onMounted(async () => {
    const response = await $fetch<MessageDB[]>("/api/message", {
        method: "GET",
    });
    response.map((msg) => messages.value.push(`[${msg.user.username}]: ${msg.content}`));
});
</script>

<template>
    <div v-if="loggedIn">
        <h1>Hola {{ user?.username }}</h1>
        <button @click="clear()">Borrar</button>
        <br />
        <p>{{ status }}</p>
        <input
            v-model="message"
            placeholder="Escribe un mensaje"
            @keydown.enter.prevent="sendMessage"
        />
        <ul>
            <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
        </ul>
    </div>
</template>
