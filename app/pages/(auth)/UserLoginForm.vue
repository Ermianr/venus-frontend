<script setup lang="ts">
import type { NuxtError } from "#app";
import { UserLoginSchema } from "#shared/schemas/user";
import type { FormSubmitEvent } from "@nuxt/ui";
import type * as z from "zod";

type UserLoginType = z.output<typeof UserLoginSchema>;

const state = reactive<Partial<UserLoginType>>({
    email: undefined,
    password: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<UserLoginType>) {
    const result = UserLoginSchema.safeParse(event.data);

    if (!result.success) {
        toast.add({
            title: "Error de validación",
            description: "Por favor revisa los datos ingresados",
            color: "error",
        });
        return;
    }

    try {
        const response = await $fetch("/api/login", {
            method: "POST",
            body: result.data,
        });

        if (response.success) {
            await useUserSession().fetch();
            toast.add({
                title: "Inicio de sesión exitoso",
                description: "Bienvenido de vuelta!",
                color: "success",
            });
            await navigateTo("/chat");
        }
    } catch (err: unknown) {
        const error = err as NuxtError;
        console.log("Error:", error);

        if (error.statusCode === 404 || error.statusCode === 401) {
            toast.add({
                title: "Credenciales inválidas",
                description: "Email o contraseña incorrectos",
                color: "error",
            });
        } else if (error.statusCode === 400) {
            toast.add({
                title: "Datos inválidos",
                description: "Por favor revisa los datos ingresados",
                color: "error",
            });
        } else {
            toast.add({
                title: "Error del servidor",
                description: "Error interno del servidor",
                color: "error",
            });
        }
    }
}
</script>

<template>
    <UForm :schema="UserLoginSchema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
        <UFormField label="Correo Electrónico" name="name">
            <UInput v-model="state.email" class="w-full" type="email" />
        </UFormField>
        <UFormField label="Contraseña" name="password">
            <UInput v-model="state.password" class="w-full" type="password" />
        </UFormField>

        <UButton label="Iniciar Sesión" type="submit" variant="soft" class="self-end" />
    </UForm>
</template>
