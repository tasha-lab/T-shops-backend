/*
  Warnings:

  - The values [login] on the enum `OtpPurpose` will be removed. If these variants are still used in the database, this will fail.
  - The values [confirmed] on the enum `orderstatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [refunded] on the enum `paymentmodelstatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [paid,unpaid,refunded] on the enum `paymentstatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [processed] on the enum `vendorpayout` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `totalAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `unitprice` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalprice` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `percentage` on the `discount` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `paymentmodel` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `vendorpayoutmodel` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[cartId,productvariantId]` on the table `cartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,productId]` on the table `wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OtpPurpose_new" AS ENUM ('PasswordReset', 'EmailVerification', 'Login');
ALTER TABLE "OtpToken" ALTER COLUMN "purpose" TYPE "OtpPurpose_new" USING ("purpose"::text::"OtpPurpose_new");
ALTER TYPE "OtpPurpose" RENAME TO "OtpPurpose_old";
ALTER TYPE "OtpPurpose_new" RENAME TO "OtpPurpose";
DROP TYPE "public"."OtpPurpose_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "orderstatus_new" AS ENUM ('Pending', 'Confirmed', 'PartiallyShipped', 'Shipped', 'Delivered', 'Cancelled');
ALTER TABLE "public"."Order" ALTER COLUMN "orderstatus" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "orderstatus" TYPE "orderstatus_new" USING ("orderstatus"::text::"orderstatus_new");
-- ALTER TABLE "OrderItem" ALTER COLUMN "status" TYPE "orderstatus_new" USING ("status"::text::"orderstatus_new");
ALTER TYPE "orderstatus" RENAME TO "orderstatus_old";
ALTER TYPE "orderstatus_new" RENAME TO "orderstatus";
DROP TYPE "public"."orderstatus_old";
ALTER TABLE "Order" ALTER COLUMN "orderstatus" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "paymentmodelstatus_new" AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');
ALTER TABLE "public"."paymentmodel" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "paymentmodel" ALTER COLUMN "status" TYPE "paymentmodelstatus_new" USING ("status"::text::"paymentmodelstatus_new");
ALTER TYPE "paymentmodelstatus" RENAME TO "paymentmodelstatus_old";
ALTER TYPE "paymentmodelstatus_new" RENAME TO "paymentmodelstatus";
DROP TYPE "public"."paymentmodelstatus_old";
ALTER TABLE "paymentmodel" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "paymentstatus_new" AS ENUM ('Paid', 'Unpaid', 'Refunded');
ALTER TABLE "public"."Order" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" TYPE "paymentstatus_new" USING ("paymentStatus"::text::"paymentstatus_new");
ALTER TYPE "paymentstatus" RENAME TO "paymentstatus_old";
ALTER TYPE "paymentstatus_new" RENAME TO "paymentstatus";
DROP TYPE "public"."paymentstatus_old";
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" SET DEFAULT 'Unpaid';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "vendorpayout_new" AS ENUM ('Pending', 'Processed');
ALTER TABLE "public"."vendorpayoutmodel" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "vendorpayoutmodel" ALTER COLUMN "status" TYPE "vendorpayout_new" USING ("status"::text::"vendorpayout_new");
ALTER TYPE "vendorpayout" RENAME TO "vendorpayout_old";
ALTER TYPE "vendorpayout_new" RENAME TO "vendorpayout";
DROP TYPE "public"."vendorpayout_old";
ALTER TABLE "vendorpayoutmodel" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "paymentStatus" SET DEFAULT 'Unpaid';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "status" "orderstatus" NOT NULL DEFAULT 'Pending',
ALTER COLUMN "unitprice" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalprice" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "discount" ALTER COLUMN "percentage" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "paymentmodel" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "vendorpayoutmodel" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "cartItem_cartId_productvariantId_key" ON "cartItem"("cartId", "productvariantId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_userId_productId_key" ON "wishlist"("userId", "productId");
