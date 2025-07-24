import { UserSchema } from "#shared/schemas/user";
import { Algorithm, hash } from "@node-rs/argon2";
import { createUser } from "../db/prepared";

export default defineEventHandler(async (event) => {
    const rawBody = await readBody(event);
    const result = UserSchema.safeParse(rawBody);

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad request",
            message: "Datos inválidos",
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
        await createUser.execute(userWithDate);
        setResponseStatus(event, 201, "Usuario creado correctamente");
        return {
            success: true,
        };
    } catch (err: unknown) {
        const error = err as DrizzleError;
        const postgresErr = error.cause;

        if (postgresErr?.code === "23505") {
            if (postgresErr?.constraint_name === "users_email_unique") {
                throw createError({
                    statusCode: 409,
                    statusMessage: "Conflict",
                    data: { field: "Email" },
                });
            }

            if (postgresErr?.constraint_name === "users_username_unique") {
                throw createError({
                    statusCode: 409,
                    statusMessage: "Conflict",
                    data: { field: "Nombre de usuario" },
                });
            }

            throw createError({
                statusCode: 409,
                statusMessage: "Conflict",
            });
        }

        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        });
    }
});
