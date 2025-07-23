import { UserSchema } from "#shared/schemas/user";
import { Algorithm, hash } from "@node-rs/argon2";
import { createUser } from "../db/prepared";

export default defineEventHandler(async (event) => {
    const rawBody = await readBody(event);
    const result = UserSchema.safeParse(rawBody);

    if (!result.success) {
        throw createError({
            status: 400,
            statusMessage: "Datos inválidos",
        });
    }

    result.data.password = await hash(result.data.password, {
        algorithm: Algorithm.Argon2id,
        memoryCost: 19 * 1024,
        timeCost: 3,
        parallelism: 1,
    });

    const { confirmPassword, dateBirth, ...userData } = result.data;
    try {
        const userWithDate = {
            ...userData,
            dateBirth: new Date(dateBirth),
        };
        const newUser = await createUser.execute(userWithDate);
        setResponseStatus(event, 201, "Usuario creado correctamente");
        return {
            user: newUser[0],
        };
    } catch (err: unknown) {
        const error = err as DrizzleError;
        const postgresErr = error.cause;

        if (postgresErr?.code === "23505") {
            if (postgresErr?.constraint_name === "users_email_unique") {
                throw createError({
                    status: 409,
                    statusMessage: "El email ya esta registrado",
                    data: { campo: "Email" },
                });
            }

            if (postgresErr?.constraint_name === "users_username_unique") {
                throw createError({
                    status: 409,
                    statusMessage: "El nombre de usuario ya esta registrado",
                    data: { campo: "Nombre de usuario" },
                });
            }

            throw createError({
                status: 409,
                statusMessage: "Ya existe un registro con estos datos",
            });
        }

        throw createError({
            status: 500,
            statusMessage: "Error interno en el servidor",
        });
    }
});
