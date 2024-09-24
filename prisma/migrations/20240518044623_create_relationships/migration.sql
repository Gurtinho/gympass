/*
  Warnings:

  - You are about to drop the `checkins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "checkins";

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "gyms" TEXT NOT NULL,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_gyms_fkey" FOREIGN KEY ("gyms") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
