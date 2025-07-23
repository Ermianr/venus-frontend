import * as z from "zod";

export const UserSchema = z.object({
    username: z.string({ error: "El nombre de usuario es obligatorio" }),
    email: z.email({ error: "Debe ser un email valido" }),
    password: z
        .string({ error: "Campo obligatorio" })
        .min(8, { error: "La contraseña debe ser de mínimo 8 caracteres" }),
    confirmPassword: z.string({ error: "Campo obligatorio" }),
    dateBirth: z.iso.date({ error: "Campo obligatorio" }),
});

export const UserLoginSchema = z.object({
    email: z.email({ error: "Debe ser un email valido" }),
    password: z
        .string({ error: "Campo obligatorio" })
        .min(8, { error: "La contraseña debe ser de mínimo 8 caracteres" }),
});
