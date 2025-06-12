-- CreateTable
CREATE TABLE "crudfullstack" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crudfullstack_pkey" PRIMARY KEY ("id")
);
