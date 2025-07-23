CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
