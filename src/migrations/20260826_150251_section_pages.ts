import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_dances_page_intro_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_dances_page_intro_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__dances_page_v_version_intro_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__dances_page_v_version_intro_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_faq_page_items_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_faq_page_items_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__faq_page_v_version_items_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__faq_page_v_version_items_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TABLE "dances_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_link_type" "enum_dances_page_intro_link_type" DEFAULT 'none' NOT NULL,
  	"intro_link_url" varchar,
  	"intro_link_page_id" integer,
  	"intro_link_section" "enum_dances_page_intro_link_section",
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "dances_page_locales" (
  	"kicker" varchar DEFAULT 'Танци',
  	"title" varchar DEFAULT 'Три езика на суинга' NOT NULL,
  	"lead" varchar,
  	"intro_link_label" varchar,
  	"link_label" varchar DEFAULT 'Виж повече',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dances_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "_dances_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_intro_link_type" "enum__dances_page_v_version_intro_link_type" DEFAULT 'none' NOT NULL,
  	"version_intro_link_url" varchar,
  	"version_intro_link_page_id" integer,
  	"version_intro_link_section" "enum__dances_page_v_version_intro_link_section",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_dances_page_v_locales" (
  	"version_kicker" varchar DEFAULT 'Танци',
  	"version_title" varchar DEFAULT 'Три езика на суинга' NOT NULL,
  	"version_lead" varchar,
  	"version_intro_link_label" varchar,
  	"version_link_label" varchar DEFAULT 'Виж повече',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_dances_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "faq_page_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_faq_page_items_link_type" DEFAULT 'none' NOT NULL,
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_section" "enum_faq_page_items_link_section"
  );
  
  CREATE TABLE "faq_page_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "faq_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "faq_page_locales" (
  	"kicker" varchar DEFAULT 'Въпроси',
  	"title" varchar DEFAULT 'Преди първия час' NOT NULL,
  	"lead" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_faq_page_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__faq_page_v_version_items_link_type" DEFAULT 'none' NOT NULL,
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_section" "enum__faq_page_v_version_items_link_section",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faq_page_v_version_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_faq_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_faq_page_v_locales" (
  	"version_kicker" varchar DEFAULT 'Въпроси',
  	"version_title" varchar DEFAULT 'Преди първия час' NOT NULL,
  	"version_lead" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "team_page_locales" (
  	"kicker" varchar DEFAULT 'Екип',
  	"title" varchar DEFAULT 'Хората, които водят' NOT NULL,
  	"lead" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_team_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_team_page_v_locales" (
  	"version_kicker" varchar DEFAULT 'Екип',
  	"version_title" varchar DEFAULT 'Хората, които водят' NOT NULL,
  	"version_lead" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "dances_page" ADD CONSTRAINT "dances_page_intro_link_page_id_pages_id_fk" FOREIGN KEY ("intro_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dances_page_locales" ADD CONSTRAINT "dances_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dances_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dances_page_rels" ADD CONSTRAINT "dances_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dances_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dances_page_rels" ADD CONSTRAINT "dances_page_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dances_page_v" ADD CONSTRAINT "_dances_page_v_version_intro_link_page_id_pages_id_fk" FOREIGN KEY ("version_intro_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dances_page_v_locales" ADD CONSTRAINT "_dances_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dances_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dances_page_v_rels" ADD CONSTRAINT "_dances_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_dances_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dances_page_v_rels" ADD CONSTRAINT "_dances_page_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page_items" ADD CONSTRAINT "faq_page_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_page_items" ADD CONSTRAINT "faq_page_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page_items_locales" ADD CONSTRAINT "faq_page_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_page_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page_locales" ADD CONSTRAINT "faq_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_page_v_version_items" ADD CONSTRAINT "_faq_page_v_version_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faq_page_v_version_items" ADD CONSTRAINT "_faq_page_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_page_v_version_items_locales" ADD CONSTRAINT "_faq_page_v_version_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_page_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_page_v_locales" ADD CONSTRAINT "_faq_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_locales" ADD CONSTRAINT "team_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_page_v_locales" ADD CONSTRAINT "_team_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "dances_page_intro_link_intro_link_page_idx" ON "dances_page" USING btree ("intro_link_page_id");
  CREATE UNIQUE INDEX "dances_page_locales_locale_parent_id_unique" ON "dances_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "dances_page_rels_order_idx" ON "dances_page_rels" USING btree ("order");
  CREATE INDEX "dances_page_rels_parent_idx" ON "dances_page_rels" USING btree ("parent_id");
  CREATE INDEX "dances_page_rels_path_idx" ON "dances_page_rels" USING btree ("path");
  CREATE INDEX "dances_page_rels_pages_id_idx" ON "dances_page_rels" USING btree ("pages_id");
  CREATE INDEX "_dances_page_v_version_intro_link_version_intro_link_pag_idx" ON "_dances_page_v" USING btree ("version_intro_link_page_id");
  CREATE INDEX "_dances_page_v_created_at_idx" ON "_dances_page_v" USING btree ("created_at");
  CREATE INDEX "_dances_page_v_updated_at_idx" ON "_dances_page_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_dances_page_v_locales_locale_parent_id_unique" ON "_dances_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_dances_page_v_rels_order_idx" ON "_dances_page_v_rels" USING btree ("order");
  CREATE INDEX "_dances_page_v_rels_parent_idx" ON "_dances_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_dances_page_v_rels_path_idx" ON "_dances_page_v_rels" USING btree ("path");
  CREATE INDEX "_dances_page_v_rels_pages_id_idx" ON "_dances_page_v_rels" USING btree ("pages_id");
  CREATE INDEX "faq_page_items_order_idx" ON "faq_page_items" USING btree ("_order");
  CREATE INDEX "faq_page_items_parent_id_idx" ON "faq_page_items" USING btree ("_parent_id");
  CREATE INDEX "faq_page_items_link_link_page_idx" ON "faq_page_items" USING btree ("link_page_id");
  CREATE UNIQUE INDEX "faq_page_items_locales_locale_parent_id_unique" ON "faq_page_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "faq_page_locales_locale_parent_id_unique" ON "faq_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faq_page_v_version_items_order_idx" ON "_faq_page_v_version_items" USING btree ("_order");
  CREATE INDEX "_faq_page_v_version_items_parent_id_idx" ON "_faq_page_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_faq_page_v_version_items_link_link_page_idx" ON "_faq_page_v_version_items" USING btree ("link_page_id");
  CREATE UNIQUE INDEX "_faq_page_v_version_items_locales_locale_parent_id_unique" ON "_faq_page_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faq_page_v_created_at_idx" ON "_faq_page_v" USING btree ("created_at");
  CREATE INDEX "_faq_page_v_updated_at_idx" ON "_faq_page_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_faq_page_v_locales_locale_parent_id_unique" ON "_faq_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "team_page_locales_locale_parent_id_unique" ON "team_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_team_page_v_created_at_idx" ON "_team_page_v" USING btree ("created_at");
  CREATE INDEX "_team_page_v_updated_at_idx" ON "_team_page_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_team_page_v_locales_locale_parent_id_unique" ON "_team_page_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "dances_page" CASCADE;
  DROP TABLE "dances_page_locales" CASCADE;
  DROP TABLE "dances_page_rels" CASCADE;
  DROP TABLE "_dances_page_v" CASCADE;
  DROP TABLE "_dances_page_v_locales" CASCADE;
  DROP TABLE "_dances_page_v_rels" CASCADE;
  DROP TABLE "faq_page_items" CASCADE;
  DROP TABLE "faq_page_items_locales" CASCADE;
  DROP TABLE "faq_page" CASCADE;
  DROP TABLE "faq_page_locales" CASCADE;
  DROP TABLE "_faq_page_v_version_items" CASCADE;
  DROP TABLE "_faq_page_v_version_items_locales" CASCADE;
  DROP TABLE "_faq_page_v" CASCADE;
  DROP TABLE "_faq_page_v_locales" CASCADE;
  DROP TABLE "team_page" CASCADE;
  DROP TABLE "team_page_locales" CASCADE;
  DROP TABLE "_team_page_v" CASCADE;
  DROP TABLE "_team_page_v_locales" CASCADE;
  DROP TYPE "public"."enum_dances_page_intro_link_type";
  DROP TYPE "public"."enum_dances_page_intro_link_section";
  DROP TYPE "public"."enum__dances_page_v_version_intro_link_type";
  DROP TYPE "public"."enum__dances_page_v_version_intro_link_section";
  DROP TYPE "public"."enum_faq_page_items_link_type";
  DROP TYPE "public"."enum_faq_page_items_link_section";
  DROP TYPE "public"."enum__faq_page_v_version_items_link_type";
  DROP TYPE "public"."enum__faq_page_v_version_items_link_section";`)
}
