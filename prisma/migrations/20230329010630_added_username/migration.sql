/*
  Warnings:

  - You are about to drop the column `email` on the `auth_user` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_auth_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT
);
INSERT INTO "new_auth_user" ("id") SELECT "id" FROM "auth_user";
DROP TABLE "auth_user";
ALTER TABLE "new_auth_user" RENAME TO "auth_user";
CREATE UNIQUE INDEX "auth_user_id_key" ON "auth_user"("id");
CREATE UNIQUE INDEX "auth_user_username_key" ON "auth_user"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
