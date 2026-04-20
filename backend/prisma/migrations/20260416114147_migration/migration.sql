/*
  Warnings:

  - You are about to drop the column `userId` on the `Blog` table. All the data in the column will be lost.
  - The primary key for the `BookAuthor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `BookAuthor` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `BookAuthor` table. All the data in the column will be lost.
  - You are about to drop the column `id_book_author` on the `BookAuthor` table. All the data in the column will be lost.
  - The primary key for the `BookGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `BookGenre` table. All the data in the column will be lost.
  - You are about to drop the column `genreId` on the `BookGenre` table. All the data in the column will be lost.
  - You are about to drop the column `id_book_genre` on the `BookGenre` table. All the data in the column will be lost.
  - The primary key for the `BookRecommendation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `BookRecommendation` table. All the data in the column will be lost.
  - You are about to drop the column `id_book_recommendation` on the `BookRecommendation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BookRecommendation` table. All the data in the column will be lost.
  - The primary key for the `BookTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `BookTag` table. All the data in the column will be lost.
  - You are about to drop the column `id_book_tag` on the `BookTag` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `BookTag` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_follow` on the `Follow` table. All the data in the column will be lost.
  - The primary key for the `GroupMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupId` on the `GroupMember` table. All the data in the column will be lost.
  - You are about to drop the column `id_group_member` on the `GroupMember` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GroupMember` table. All the data in the column will be lost.
  - The `role` column on the `GroupMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `groupId` on the `GroupMessage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GroupMessage` table. All the data in the column will be lost.
  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `id_like` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `Read` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `Read` table. All the data in the column will be lost.
  - You are about to drop the column `id_read` on the `Read` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Read` table. All the data in the column will be lost.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `id_review` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `UserBadge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `badgeId` on the `UserBadge` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_badge` on the `UserBadge` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserBadge` table. All the data in the column will be lost.
  - The primary key for the `Wishlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `id_wishlist` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Wishlist` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `BookAuthor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `BookAuthor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `BookGenre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre_id` to the `BookGenre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `BookRecommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `BookRecommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `BookTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `BookTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `GroupMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `GroupMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `GroupMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `GroupMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `Read` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Read` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badge_id` to the `UserBadge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserBadge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `Wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupeRole" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_userId_fkey";

-- DropForeignKey
ALTER TABLE "BookAuthor" DROP CONSTRAINT "BookAuthor_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BookAuthor" DROP CONSTRAINT "BookAuthor_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "BookRecommendation" DROP CONSTRAINT "BookRecommendation_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookRecommendation" DROP CONSTRAINT "BookRecommendation_userId_fkey";

-- DropForeignKey
ALTER TABLE "BookTag" DROP CONSTRAINT "BookTag_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookTag" DROP CONSTRAINT "BookTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Read" DROP CONSTRAINT "Read_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Read" DROP CONSTRAINT "Read_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";

-- DropIndex
DROP INDEX "BookAuthor_bookId_authorId_key";

-- DropIndex
DROP INDEX "BookGenre_bookId_genreId_key";

-- DropIndex
DROP INDEX "BookRecommendation_bookId_userId_key";

-- DropIndex
DROP INDEX "BookTag_bookId_tagId_key";

-- DropIndex
DROP INDEX "Follow_userId_userFollowedId_key";

-- DropIndex
DROP INDEX "GroupMember_groupId_userId_key";

-- DropIndex
DROP INDEX "Like_bookId_userId_key";

-- DropIndex
DROP INDEX "Read_bookId_userId_key";

-- DropIndex
DROP INDEX "Review_bookId_userId_key";

-- DropIndex
DROP INDEX "UserBadge_badgeId_userId_key";

-- DropIndex
DROP INDEX "Wishlist_bookId_userId_key";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BookAuthor" DROP CONSTRAINT "BookAuthor_pkey",
DROP COLUMN "authorId",
DROP COLUMN "bookId",
DROP COLUMN "id_book_author",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD CONSTRAINT "BookAuthor_pkey" PRIMARY KEY ("book_id", "author_id");

-- AlterTable
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_pkey",
DROP COLUMN "bookId",
DROP COLUMN "genreId",
DROP COLUMN "id_book_genre",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "genre_id" TEXT NOT NULL,
ADD CONSTRAINT "BookGenre_pkey" PRIMARY KEY ("book_id", "genre_id");

-- AlterTable
ALTER TABLE "BookRecommendation" DROP CONSTRAINT "BookRecommendation_pkey",
DROP COLUMN "bookId",
DROP COLUMN "id_book_recommendation",
DROP COLUMN "userId",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "BookRecommendation_pkey" PRIMARY KEY ("book_id", "user_id");

-- AlterTable
ALTER TABLE "BookTag" DROP CONSTRAINT "BookTag_pkey",
DROP COLUMN "bookId",
DROP COLUMN "id_book_tag",
DROP COLUMN "tagId",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "tag_id" TEXT NOT NULL,
ADD CONSTRAINT "BookTag_pkey" PRIMARY KEY ("book_id", "tag_id");

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "groupId",
ADD COLUMN     "group_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_pkey",
DROP COLUMN "id_follow",
ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("userId", "userFollowedId");

-- AlterTable
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_pkey",
DROP COLUMN "groupId",
DROP COLUMN "id_group_member",
DROP COLUMN "userId",
ADD COLUMN     "group_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "GroupeRole" NOT NULL DEFAULT 'PUBLIC',
ADD CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("group_id", "user_id");

-- AlterTable
ALTER TABLE "GroupMessage" DROP COLUMN "groupId",
DROP COLUMN "userId",
ADD COLUMN     "group_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "bookId",
DROP COLUMN "id_like",
DROP COLUMN "userId",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("book_id", "user_id");

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiver_id" TEXT NOT NULL,
ADD COLUMN     "sender_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Read" DROP CONSTRAINT "Read_pkey",
DROP COLUMN "bookId",
DROP COLUMN "id_read",
DROP COLUMN "userId",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Read_pkey" PRIMARY KEY ("book_id", "user_id");

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "bookId",
DROP COLUMN "id_review",
DROP COLUMN "userId",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("book_id", "user_id");

-- AlterTable
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_pkey",
DROP COLUMN "badgeId",
DROP COLUMN "id_user_badge",
DROP COLUMN "userId",
ADD COLUMN     "badge_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("badge_id", "user_id");

-- AlterTable
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_pkey",
DROP COLUMN "bookId",
DROP COLUMN "id_wishlist",
DROP COLUMN "userId",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("book_id", "user_id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id_group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecommendation" ADD CONSTRAINT "BookRecommendation_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecommendation" ADD CONSTRAINT "BookRecommendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id_group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "Badge"("id_badge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id_genre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id_tag") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id_author") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id_group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Read" ADD CONSTRAINT "Read_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Read" ADD CONSTRAINT "Read_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
