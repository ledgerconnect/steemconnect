CREATE TABLE IF NOT EXISTS "apps"(
  "id" SERIAL PRIMARY KEY,
  "client_id" TEXT NOT NULL UNIQUE,
  "secret" TEXT NOT NULL,
  "redirect_uris" TEXT[],
  "admins" TEXT[]
);
