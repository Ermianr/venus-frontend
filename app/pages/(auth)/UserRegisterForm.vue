<script setup lang="ts">
import { UserSchema } from "#shared/schemas/user";
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import type * as z from "zod";

type UserType = z.output<typeof UserSchema>;

const state = reactive<Partial<UserType>>({
    username: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    dateBirth: undefined,
});

const validate = (state: Partial<UserType>): FormError[] => {
    const errors: FormError[] = [];
    if (state.confirmPassword !== state.password)
        errors.push({ name: "confirmPassword", message: "Las contraseñas deben coincidir" });
    return errors;
};

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<UserType>) {
    const result = UserSchema.safeParse(event.data);

    if (!result.success) {
        toast.add({
            title: "Error de validación",
            description: "Por favor revisa los datos ingresados",
            color: "error",
        });
        return;
    }

    await $fetch("/api/register", {
        method: "POST",
        body: result.data,
        onResponse({ response }) {
            if (response.status === 201) {
                toast.add({
                    title: "Datos correctos",
                    description: "Por favor ingrese a la plataforma :)",
                    color: "success",
                });
            }
        },
        onResponseError({ response }) {
            if (response?.status === 409) {
                toast.add({
                    title: "Error duplicidad de datos",
                    description: response.statusText,
                    color: "error",
                });
            } else {
                toast.add({
                    title: "Error en el servidor",
                    description: response.statusText,
                    color: "error",
                });
            }
        },
    });
}
</script>

<template>
    <UForm
        :validate="validate"
        :schema="UserSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
    >
        <UFormField label="Nombre de usuario" name="username">
            <UInput v-model="state.username" class="w-full" />
        </UFormField>
        <UFormField label="Correo Electrónico" name="email">
            <UInput v-model="state.email" class="w-full" type="email" />
        </UFormField>

        <UFormField label="Contraseña" name="password">
            <UInput v-model="state.password" class="w-full" type="password" />
        </UFormField>

        <UFormField label="Confirmar contraseña" name="confirmPassword">
            <UInput v-model="state.confirmPassword" class="w-full" type="password" />
        </UFormField>

        <UFormField label="Fecha de Nacimiento" name="dateBirth">
            <UInput v-model="state.dateBirth" class="w-full" type="date" />
        </UFormField>

        <UButton label="Registrarse" type="submit" variant="soft" class="self-end" />
    </UForm>
</template>
