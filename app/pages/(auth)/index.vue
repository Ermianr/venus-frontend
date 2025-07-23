<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import UserLoginForm from "./UserLoginForm.vue";
import UserRegisterForm from "./UserRegisterForm.vue";
definePageMeta({
    middleware: ["no-authenticated"],
});

const items = [
    {
        label: "Inicio de Sesión",
        description: "¡Por favor, iniciar sesión para charlar un rato!",
        slot: "login" as const,
    },
    {
        label: "Registro",
        description: "¡Únete a nosotros!",
        slot: "register" as const,
    },
] satisfies TabsItem[];
</script>

<template>
    <UContainer as="section" class="min-h-screen flex items-center justify-center w-full">
        <UTabs :items="items" :ui="{ trigger: 'grow' }" class="w-full max-w-xl">
            <template #login="{ item }">
                <p class="text-muted mb-4">{{ item.description }}</p>
                <UserLoginForm />
            </template>

            <template #register="{ item }">
                <p class="text-muted mb-4">{{ item.description }}</p>
                <UserRegisterForm />
            </template>
        </UTabs>
    </UContainer>
</template>
