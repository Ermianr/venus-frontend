CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"userId" text,
	"room" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;