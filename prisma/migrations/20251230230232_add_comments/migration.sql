-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "page" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50),
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_comments_page" ON "comments"("page");

-- CreateIndex
CREATE INDEX "idx_comments_created_at" ON "comments"("created_at" DESC);
