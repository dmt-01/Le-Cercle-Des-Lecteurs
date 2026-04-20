-- CreateTable
CREATE TABLE "Token" (
    "id_token" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id_token")
);

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
