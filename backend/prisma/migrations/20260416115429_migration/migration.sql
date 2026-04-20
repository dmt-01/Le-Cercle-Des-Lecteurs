/*
  Warnings:

  - The values [PUBLIC,PRIVATE,PROTECTED] on the enum `GroupeRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GroupeRole_new" AS ENUM ('member', 'moderator', 'admin');
ALTER TABLE "public"."GroupMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "GroupMember" ALTER COLUMN "role" TYPE "GroupeRole_new" USING ("role"::text::"GroupeRole_new");
ALTER TYPE "GroupeRole" RENAME TO "GroupeRole_old";
ALTER TYPE "GroupeRole_new" RENAME TO "GroupeRole";
DROP TYPE "public"."GroupeRole_old";
ALTER TABLE "GroupMember" ALTER COLUMN "role" SET DEFAULT 'member';
COMMIT;

-- AlterTable
ALTER TABLE "GroupMember" ALTER COLUMN "role" SET DEFAULT 'member';
