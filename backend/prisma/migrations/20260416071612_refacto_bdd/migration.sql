/*
  Warnings:

  - The primary key for the `Blog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Blog` table. All the data in the column will be lost.
  - The primary key for the `Wishlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `statut` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the `Aimer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Authors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Book_recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categoriser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ecrire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group_member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recompenser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Suivre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Thematiser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `badges` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bookId,userId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.
  - The required column `id_blog` was added to the `Blog` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id_wishlist` was added to the `Wishlist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `status` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Aimer" DROP CONSTRAINT "Aimer_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Aimer" DROP CONSTRAINT "Aimer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Book_recommendations" DROP CONSTRAINT "Book_recommendations_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Book_recommendations" DROP CONSTRAINT "Book_recommendations_userId_fkey";

-- DropForeignKey
ALTER TABLE "Categoriser" DROP CONSTRAINT "Categoriser_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Categoriser" DROP CONSTRAINT "Categoriser_genreId_fkey";

-- DropForeignKey
ALTER TABLE "Ecrire" DROP CONSTRAINT "Ecrire_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Ecrire" DROP CONSTRAINT "Ecrire_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Group_member" DROP CONSTRAINT "Group_member_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Group_member" DROP CONSTRAINT "Group_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lire" DROP CONSTRAINT "Lire_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Lire" DROP CONSTRAINT "Lire_userId_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Messages_group" DROP CONSTRAINT "Messages_group_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Messages_group" DROP CONSTRAINT "Messages_group_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recompenser" DROP CONSTRAINT "Recompenser_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "Recompenser" DROP CONSTRAINT "Recompenser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "Suivre" DROP CONSTRAINT "Suivre_userFollowedId_fkey";

-- DropForeignKey
ALTER TABLE "Suivre" DROP CONSTRAINT "Suivre_userId_fkey";

-- DropForeignKey
ALTER TABLE "Thematiser" DROP CONSTRAINT "Thematiser_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Thematiser" DROP CONSTRAINT "Thematiser_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_blog" TEXT NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Blog_pkey" PRIMARY KEY ("id_blog");

-- AlterTable
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_pkey",
DROP COLUMN "id",
DROP COLUMN "statut",
ADD COLUMN     "id_wishlist" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "bookId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id_wishlist");

-- DropTable
DROP TABLE "Aimer";

-- DropTable
DROP TABLE "Authors";

-- DropTable
DROP TABLE "Book_recommendations";

-- DropTable
DROP TABLE "Books";

-- DropTable
DROP TABLE "Categoriser";

-- DropTable
DROP TABLE "Ecrire";

-- DropTable
DROP TABLE "Events";

-- DropTable
DROP TABLE "Genres";

-- DropTable
DROP TABLE "Group_member";

-- DropTable
DROP TABLE "Groups";

-- DropTable
DROP TABLE "Lire";

-- DropTable
DROP TABLE "Messages";

-- DropTable
DROP TABLE "Messages_group";

-- DropTable
DROP TABLE "Recompenser";

-- DropTable
DROP TABLE "Reviews";

-- DropTable
DROP TABLE "Suivre";

-- DropTable
DROP TABLE "Tags";

-- DropTable
DROP TABLE "Thematiser";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "badges";

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "profile_image" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Book" (
    "id_book" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "cover_image" VARCHAR(255),
    "description" VARCHAR(255),
    "publication_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id_book")
);

-- CreateTable
CREATE TABLE "Author" (
    "id_author" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "biography" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id_author")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id_genre" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id_genre")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id_badge" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id_badge")
);

-- CreateTable
CREATE TABLE "Group" (
    "id_group" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_club" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id_group")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id_tag" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id_tag")
);

-- CreateTable
CREATE TABLE "Review" (
    "id_review" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" INTEGER,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id_review")
);

-- CreateTable
CREATE TABLE "GroupMessage" (
    "id_group_message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GroupMessage_pkey" PRIMARY KEY ("id_group_message")
);

-- CreateTable
CREATE TABLE "BookRecommendation" (
    "id_book_recommendation" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BookRecommendation_pkey" PRIMARY KEY ("id_book_recommendation")
);

-- CreateTable
CREATE TABLE "Message" (
    "id_message" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id_message")
);

-- CreateTable
CREATE TABLE "Event" (
    "id_event" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id_event")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id_user_badge" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "badgeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id_user_badge")
);

-- CreateTable
CREATE TABLE "BookGenre" (
    "id_book_genre" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "BookGenre_pkey" PRIMARY KEY ("id_book_genre")
);

-- CreateTable
CREATE TABLE "BookTag" (
    "id_book_tag" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "BookTag_pkey" PRIMARY KEY ("id_book_tag")
);

-- CreateTable
CREATE TABLE "BookAuthor" (
    "id_book_author" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "BookAuthor_pkey" PRIMARY KEY ("id_book_author")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id_group_member" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id_group_member")
);

-- CreateTable
CREATE TABLE "Read" (
    "id_read" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Read_pkey" PRIMARY KEY ("id_read")
);

-- CreateTable
CREATE TABLE "Like" (
    "id_like" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id_like")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id_follow" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userFollowedId" TEXT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id_follow")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_name_key" ON "Badge"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookId_userId_key" ON "Review"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BookRecommendation_bookId_userId_key" ON "BookRecommendation"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_badgeId_userId_key" ON "UserBadge"("badgeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BookGenre_bookId_genreId_key" ON "BookGenre"("bookId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "BookTag_bookId_tagId_key" ON "BookTag"("bookId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "BookAuthor_bookId_authorId_key" ON "BookAuthor"("bookId", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Read_bookId_userId_key" ON "Read"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_bookId_userId_key" ON "Like"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_userId_userFollowedId_key" ON "Follow"("userId", "userFollowedId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_bookId_userId_key" ON "Wishlist"("bookId", "userId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id_group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecommendation" ADD CONSTRAINT "BookRecommendation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecommendation" ADD CONSTRAINT "BookRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id_group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id_badge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id_genre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id_tag") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id_author") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id_group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Read" ADD CONSTRAINT "Read_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Read" ADD CONSTRAINT "Read_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userFollowedId_fkey" FOREIGN KEY ("userFollowedId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
