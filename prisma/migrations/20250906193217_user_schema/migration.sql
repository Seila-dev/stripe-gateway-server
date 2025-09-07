-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stripeSubscriptionStatus" TEXT,
    "stripeCostumerId" TEXT,
    "stripeSubscriptionId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
