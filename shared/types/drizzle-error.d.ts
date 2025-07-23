import type { PostgresError } from "postgres";

export interface DrizzleError extends Error {
    message: string;
    cause?: PostgresError;
}
