import { UserLoginSchema } from "#shared/schemas/user";
import { verify } from "@node-rs/argon2";
import { getUserByEmail } from "../db/prepared";

export default defineEventHandler(async (event) => {
    const rawBody = await readBody(event);
    const result = UserLoginSchema.safeParse(rawBody);

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Datos inválidos",
            message: "Datos inválidos",
        });
    }

    const userData = await getUserByEmail.execute({ email: result.data.email });

    if (!userData[0]) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "El usuario no existe",
        });
    } else {
        const ok = await verify(userData[0].password, result.data.password);
        if (ok) {
            await setUserSession(event, {
                user: {
                    id: userData[0].id,
                    email: userData[0].email,
                    username: userData[0].username,
                },
                loggedInAt: Date.now(),
            });
            setResponseStatus(event, 200, "Usuario ha ingresado correctamente");
            return {
                success: true,
            };
        } else {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Contraseña incorrecta",
            });
        }
    }
});
