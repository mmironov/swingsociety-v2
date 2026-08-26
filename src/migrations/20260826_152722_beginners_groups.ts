import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_rels" ADD COLUMN "courses_id" integer;
  ALTER TABLE "_home_page_v_rels" ADD COLUMN "courses_id" integer;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_rels_courses_id_idx" ON "home_page_rels" USING btree ("courses_id");
  CREATE INDEX "_home_page_v_rels_courses_id_idx" ON "_home_page_v_rels" USING btree ("courses_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_rels" DROP CONSTRAINT "home_page_rels_courses_fk";
  
  ALTER TABLE "_home_page_v_rels" DROP CONSTRAINT "_home_page_v_rels_courses_fk";
  
  DROP INDEX "home_page_rels_courses_id_idx";
  DROP INDEX "_home_page_v_rels_courses_id_idx";
  ALTER TABLE "home_page_rels" DROP COLUMN "courses_id";
  ALTER TABLE "_home_page_v_rels" DROP COLUMN "courses_id";`)
}
