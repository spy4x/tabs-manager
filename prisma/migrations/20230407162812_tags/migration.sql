-- CreateTable
CREATE TABLE
  "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "title" VARCHAR(100) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "tags_to_links" (
    "tag_id" UUID NOT NULL,
    "link_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tags_to_links_pkey" PRIMARY KEY ("tag_id", "link_id")
  );

-- AddForeignKey
ALTER TABLE
  "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "tags_to_links" ADD CONSTRAINT "tags_to_links_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "tags_to_links" ADD CONSTRAINT "tags_to_links_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
