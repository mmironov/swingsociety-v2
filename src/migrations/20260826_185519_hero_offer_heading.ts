import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_locales" ALTER COLUMN "hero_heading" SET DEFAULT 'Научи се да танцуваш';
  ALTER TABLE "_home_page_v_locales" ALTER COLUMN "version_hero_heading" SET DEFAULT 'Научи се да танцуваш';
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_offer_heading" varchar DEFAULT 'Суинг танци за начинаещи';
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_hero_offer_heading" varchar DEFAULT 'Суинг танци за начинаещи';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_locales" ALTER COLUMN "hero_heading" SET DEFAULT 'Танцувай
като през
30-те.';
  ALTER TABLE "_home_page_v_locales" ALTER COLUMN "version_hero_heading" SET DEFAULT 'Танцувай
като през
30-те.';
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_offer_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_hero_offer_heading";`)
}
