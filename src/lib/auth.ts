import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000/api/auth",
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
    es: "El correo electrónico ingresado es invalido.",
  },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, lang: "es") => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }
  return "";
};
