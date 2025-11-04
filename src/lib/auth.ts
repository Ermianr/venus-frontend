import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    {
      id: "next-cookies-request",
      fetchPlugins: [
        {
          id: "next-cookies-request-plugin",
          name: "next-cookies-request-plugin",
          hooks: {
            async onRequest(ctx) {
              if (typeof window === "undefined") {
                const { cookies } = await import("next/headers");
                const headers = await cookies();
                ctx.headers.set("cookie", headers.toString());
              }
            },
          },
        },
      ],
    },
  ],
});

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      es: string;
    }
  >
>;

const errorCodes = {
  USER_ALREADY_EXISTS: {
    es: "El usuario ya se encuentra registrado.",
  },
  USER_NOT_FOUND: {
    es: "Este usuario no existe.",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    es: "El correo electrónico o la contraseña son incorrectos.",
  },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, lang: "es") => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }
  return "";
};
