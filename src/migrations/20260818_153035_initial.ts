import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('bg', 'en');
  CREATE TYPE "public"."enum_pages_blocks_video_source" AS ENUM('embed', 'file', 'placeholder');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('image', 'video', 'none');
  CREATE TYPE "public"."enum_pages_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_pages_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_video_source" AS ENUM('embed', 'file', 'placeholder');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('image', 'video', 'none');
  CREATE TYPE "public"."enum__pages_v_version_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__pages_v_version_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('bg', 'en');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('open', 'soon', 'full');
  CREATE TYPE "public"."enum_courses_registration_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_courses_registration_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_events_type" AS ENUM('festival', 'party', 'course', 'workshop');
  CREATE TYPE "public"."enum_events_ticket_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_events_ticket_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_subscribers_locale" AS ENUM('bg', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_home_page_faq_items_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_faq_items_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_hero_primary_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_hero_primary_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_hero_secondary_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_hero_secondary_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_festival_card_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_festival_card_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_reviews_all_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_reviews_all_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_video_strip_handle_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_video_strip_handle_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_dances_intro_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_dances_intro_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_events_all_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_events_all_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_home_page_footer_cta_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_home_page_footer_cta_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_faq_items_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_faq_items_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_hero_primary_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_hero_primary_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_hero_secondary_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_hero_secondary_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_festival_card_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_festival_card_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_reviews_all_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_reviews_all_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_video_strip_handle_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_video_strip_handle_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_dances_intro_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_dances_intro_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_events_all_link_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_events_all_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum__home_page_v_version_footer_cta_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum__home_page_v_version_footer_cta_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_schedule_page_primary_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_schedule_page_primary_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_schedule_page_secondary_cta_type" AS ENUM('none', 'external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_schedule_page_secondary_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('instagram', 'facebook', 'youtube', 'website');
  CREATE TYPE "public"."enum_site_settings_nav_link_type" AS ENUM('external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_site_settings_nav_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_site_settings_footer_links_link_type" AS ENUM('external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_site_settings_footer_links_link_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TYPE "public"."enum_site_settings_cta_type" AS ENUM('external', 'page', 'section', 'schedule', 'home');
  CREATE TYPE "public"."enum_site_settings_cta_section" AS ENUM('beginners', 'reviews', 'dances', 'faq', 'events', 'team', 'about', 'contact');
  CREATE TABLE "pages_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_heading_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_list_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ordered" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quote_locales" (
  	"text" varchar,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_video_source" DEFAULT 'embed',
  	"url" varchar,
  	"file_id" integer,
  	"poster_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'image',
  	"hero_image_id" integer,
  	"hero_video_url" varchar,
  	"hero_poster_id" integer,
  	"cta_type" "enum_pages_cta_type" DEFAULT 'none',
  	"cta_url" varchar,
  	"cta_page_id" integer,
  	"cta_section" "enum_pages_cta_section",
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"kicker" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"cta_label" varchar DEFAULT 'Запиши се',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_heading" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_heading_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_list_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ordered" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote_locales" (
  	"text" varchar,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_video_source" DEFAULT 'embed',
  	"url" varchar,
  	"file_id" integer,
  	"poster_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'image',
  	"version_hero_image_id" integer,
  	"version_hero_video_url" varchar,
  	"version_hero_poster_id" integer,
  	"version_cta_type" "enum__pages_v_version_cta_type" DEFAULT 'none',
  	"version_cta_url" varchar,
  	"version_cta_page_id" integer,
  	"version_cta_section" "enum__pages_v_version_cta_section",
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_kicker" varchar,
  	"version_title" varchar,
  	"version_lead" varchar,
  	"version_cta_label" varchar DEFAULT 'Запиши се',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "courses_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "courses_tags_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"map_url" varchar,
  	"status" "enum_courses_status" DEFAULT 'open' NOT NULL,
  	"registration_type" "enum_courses_registration_type" DEFAULT 'none' NOT NULL,
  	"registration_url" varchar,
  	"registration_page_id" integer,
  	"registration_section" "enum_courses_registration_section",
  	"page_id" integer,
  	"show_on_schedule" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"summary" varchar,
  	"level" varchar,
  	"duration" varchar,
  	"start_note" varchar DEFAULT 'уточнява се',
  	"day" varchar DEFAULT 'уточнява се',
  	"time" varchar DEFAULT 'уточнява се',
  	"price" varchar DEFAULT 'уточнява се',
  	"venue" varchar,
  	"registration_label" varchar DEFAULT 'Запиши се',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_events_type" DEFAULT 'party' NOT NULL,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"map_url" varchar,
  	"ticket_type" "enum_events_ticket_type" DEFAULT 'none' NOT NULL,
  	"ticket_url" varchar,
  	"ticket_page_id" integer,
  	"ticket_section" "enum_events_ticket_section",
  	"featured" boolean DEFAULT true,
  	"show_on_schedule" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar NOT NULL,
  	"date_note" varchar DEFAULT 'датата се уточнява',
  	"date_label" varchar,
  	"time_note" varchar,
  	"venue" varchar,
  	"ticket_label" varchar DEFAULT 'Записване',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "teachers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teachers_locales" (
  	"name" varchar NOT NULL,
  	"disciplines" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"source_url" varchar,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews_locales" (
  	"quote" varchar NOT NULL,
  	"source" varchar DEFAULT 'Google отзив',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"prefix" varchar DEFAULT '',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_portrait_url" varchar,
  	"sizes_portrait_width" numeric,
  	"sizes_portrait_height" numeric,
  	"sizes_portrait_mime_type" varchar,
  	"sizes_portrait_filesize" numeric,
  	"sizes_portrait_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"locale" "enum_subscribers_locale",
  	"source" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"courses_id" integer,
  	"events_id" integer,
  	"teachers_id" integer,
  	"reviews_id" integer,
  	"media_id" integer,
  	"subscribers_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_beginners_reassurances" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_beginners_reassurances_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_video_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "home_page_video_strip_items_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_home_page_faq_items_link_type" DEFAULT 'none' NOT NULL,
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_section" "enum_home_page_faq_items_link_section"
  );
  
  CREATE TABLE "home_page_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_about_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_photo_id" integer,
  	"hero_primary_cta_type" "enum_home_page_hero_primary_cta_type" DEFAULT 'none' NOT NULL,
  	"hero_primary_cta_url" varchar,
  	"hero_primary_cta_page_id" integer,
  	"hero_primary_cta_section" "enum_home_page_hero_primary_cta_section",
  	"hero_secondary_cta_type" "enum_home_page_hero_secondary_cta_type" DEFAULT 'none' NOT NULL,
  	"hero_secondary_cta_url" varchar,
  	"hero_secondary_cta_page_id" integer,
  	"hero_secondary_cta_section" "enum_home_page_hero_secondary_cta_section",
  	"course_card_enabled" boolean DEFAULT true,
  	"course_card_course_id" integer,
  	"festival_card_enabled" boolean DEFAULT true,
  	"festival_card_logo_id" integer,
  	"festival_card_link_type" "enum_home_page_festival_card_link_type" DEFAULT 'none' NOT NULL,
  	"festival_card_link_url" varchar,
  	"festival_card_link_page_id" integer,
  	"festival_card_link_section" "enum_home_page_festival_card_link_section",
  	"beginners_enabled" boolean DEFAULT true,
  	"beginners_course_id" integer,
  	"beginners_signup_enabled" boolean DEFAULT true,
  	"reviews_enabled" boolean DEFAULT true,
  	"reviews_all_link_type" "enum_home_page_reviews_all_link_type" DEFAULT 'none' NOT NULL,
  	"reviews_all_link_url" varchar,
  	"reviews_all_link_page_id" integer,
  	"reviews_all_link_section" "enum_home_page_reviews_all_link_section",
  	"video_strip_enabled" boolean DEFAULT true,
  	"video_strip_handle_link_type" "enum_home_page_video_strip_handle_link_type" DEFAULT 'none' NOT NULL,
  	"video_strip_handle_link_url" varchar,
  	"video_strip_handle_link_page_id" integer,
  	"video_strip_handle_link_section" "enum_home_page_video_strip_handle_link_section",
  	"dances_enabled" boolean DEFAULT true,
  	"dances_intro_link_type" "enum_home_page_dances_intro_link_type" DEFAULT 'none' NOT NULL,
  	"dances_intro_link_url" varchar,
  	"dances_intro_link_page_id" integer,
  	"dances_intro_link_section" "enum_home_page_dances_intro_link_section",
  	"faq_enabled" boolean DEFAULT true,
  	"events_enabled" boolean DEFAULT true,
  	"events_all_link_type" "enum_home_page_events_all_link_type" DEFAULT 'none' NOT NULL,
  	"events_all_link_url" varchar,
  	"events_all_link_page_id" integer,
  	"events_all_link_section" "enum_home_page_events_all_link_section",
  	"events_limit" numeric DEFAULT 3,
  	"team_enabled" boolean DEFAULT true,
  	"about_enabled" boolean DEFAULT true,
  	"about_image_id" integer,
  	"contact_enabled" boolean DEFAULT true,
  	"footer_cta_cta_type" "enum_home_page_footer_cta_cta_type" DEFAULT 'none' NOT NULL,
  	"footer_cta_cta_url" varchar,
  	"footer_cta_cta_page_id" integer,
  	"footer_cta_cta_section" "enum_home_page_footer_cta_cta_section",
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_heading" varchar DEFAULT 'Танцувай
като през
30-те.' NOT NULL,
  	"hero_intro" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_secondary_cta_label" varchar,
  	"course_card_badge" varchar DEFAULT 'Следваща група',
  	"course_card_link_label" varchar DEFAULT 'Виж курса',
  	"festival_card_badge" varchar DEFAULT 'Фестивал',
  	"festival_card_dates" varchar,
  	"festival_card_heading" varchar,
  	"festival_card_body" varchar,
  	"festival_card_link_label" varchar,
  	"beginners_kicker" varchar DEFAULT 'Начинаещи',
  	"beginners_heading" varchar DEFAULT 'Влез в група за начинаещи',
  	"beginners_intro" varchar,
  	"beginners_course_link_label" varchar DEFAULT 'Виж курса',
  	"beginners_reassurance_heading" varchar DEFAULT 'Без притеснения',
  	"beginners_signup_heading" varchar DEFAULT 'Още не е моментът?',
  	"beginners_signup_body" varchar,
  	"beginners_signup_placeholder" varchar DEFAULT 'твоят имейл',
  	"beginners_signup_button_label" varchar DEFAULT 'Кажи ми кога започва',
  	"beginners_signup_success_message" varchar DEFAULT 'Готово — ще ти пишем.',
  	"reviews_kicker" varchar DEFAULT 'Отзиви',
  	"reviews_heading" varchar DEFAULT 'Какво казват танцуващите',
  	"reviews_all_link_label" varchar,
  	"reviews_placeholder_note" varchar DEFAULT 'Място за отзив.',
  	"video_strip_kicker" varchar DEFAULT 'Видео',
  	"video_strip_heading" varchar DEFAULT 'Как изглежда отвътре',
  	"video_strip_handle_link_label" varchar,
  	"video_strip_note" varchar,
  	"dances_kicker" varchar DEFAULT 'Танци',
  	"dances_heading" varchar DEFAULT 'Три езика на суинга',
  	"dances_intro" varchar,
  	"dances_intro_link_label" varchar,
  	"dances_link_label" varchar DEFAULT 'Виж повече',
  	"faq_kicker" varchar DEFAULT 'Въпроси',
  	"faq_heading" varchar DEFAULT 'Преди първия час',
  	"events_kicker" varchar DEFAULT 'За текущите ученици',
  	"events_heading" varchar DEFAULT 'Предстоящи събития',
  	"events_intro" varchar,
  	"events_all_link_label" varchar,
  	"team_kicker" varchar DEFAULT 'Екип',
  	"team_heading" varchar DEFAULT 'Хората, които водят',
  	"team_intro" varchar,
  	"about_kicker" varchar DEFAULT 'За нас',
  	"about_heading" varchar DEFAULT 'Няколко неща в едно',
  	"contact_kicker" varchar DEFAULT 'Контакти',
  	"contact_heading" varchar DEFAULT 'Пиши ни',
  	"contact_intro" varchar,
  	"footer_cta_heading" varchar DEFAULT 'Първият час е най-трудният. После е само танц.',
  	"footer_cta_cta_label" varchar DEFAULT 'Запиши се за начинаещи',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "_home_page_v_version_beginners_reassurances" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_beginners_reassurances_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_video_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_video_strip_items_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__home_page_v_version_faq_items_link_type" DEFAULT 'none' NOT NULL,
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_section" "enum__home_page_v_version_faq_items_link_section",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_about_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_photo_id" integer,
  	"version_hero_primary_cta_type" "enum__home_page_v_version_hero_primary_cta_type" DEFAULT 'none' NOT NULL,
  	"version_hero_primary_cta_url" varchar,
  	"version_hero_primary_cta_page_id" integer,
  	"version_hero_primary_cta_section" "enum__home_page_v_version_hero_primary_cta_section",
  	"version_hero_secondary_cta_type" "enum__home_page_v_version_hero_secondary_cta_type" DEFAULT 'none' NOT NULL,
  	"version_hero_secondary_cta_url" varchar,
  	"version_hero_secondary_cta_page_id" integer,
  	"version_hero_secondary_cta_section" "enum__home_page_v_version_hero_secondary_cta_section",
  	"version_course_card_enabled" boolean DEFAULT true,
  	"version_course_card_course_id" integer,
  	"version_festival_card_enabled" boolean DEFAULT true,
  	"version_festival_card_logo_id" integer,
  	"version_festival_card_link_type" "enum__home_page_v_version_festival_card_link_type" DEFAULT 'none' NOT NULL,
  	"version_festival_card_link_url" varchar,
  	"version_festival_card_link_page_id" integer,
  	"version_festival_card_link_section" "enum__home_page_v_version_festival_card_link_section",
  	"version_beginners_enabled" boolean DEFAULT true,
  	"version_beginners_course_id" integer,
  	"version_beginners_signup_enabled" boolean DEFAULT true,
  	"version_reviews_enabled" boolean DEFAULT true,
  	"version_reviews_all_link_type" "enum__home_page_v_version_reviews_all_link_type" DEFAULT 'none' NOT NULL,
  	"version_reviews_all_link_url" varchar,
  	"version_reviews_all_link_page_id" integer,
  	"version_reviews_all_link_section" "enum__home_page_v_version_reviews_all_link_section",
  	"version_video_strip_enabled" boolean DEFAULT true,
  	"version_video_strip_handle_link_type" "enum__home_page_v_version_video_strip_handle_link_type" DEFAULT 'none' NOT NULL,
  	"version_video_strip_handle_link_url" varchar,
  	"version_video_strip_handle_link_page_id" integer,
  	"version_video_strip_handle_link_section" "enum__home_page_v_version_video_strip_handle_link_section",
  	"version_dances_enabled" boolean DEFAULT true,
  	"version_dances_intro_link_type" "enum__home_page_v_version_dances_intro_link_type" DEFAULT 'none' NOT NULL,
  	"version_dances_intro_link_url" varchar,
  	"version_dances_intro_link_page_id" integer,
  	"version_dances_intro_link_section" "enum__home_page_v_version_dances_intro_link_section",
  	"version_faq_enabled" boolean DEFAULT true,
  	"version_events_enabled" boolean DEFAULT true,
  	"version_events_all_link_type" "enum__home_page_v_version_events_all_link_type" DEFAULT 'none' NOT NULL,
  	"version_events_all_link_url" varchar,
  	"version_events_all_link_page_id" integer,
  	"version_events_all_link_section" "enum__home_page_v_version_events_all_link_section",
  	"version_events_limit" numeric DEFAULT 3,
  	"version_team_enabled" boolean DEFAULT true,
  	"version_about_enabled" boolean DEFAULT true,
  	"version_about_image_id" integer,
  	"version_contact_enabled" boolean DEFAULT true,
  	"version_footer_cta_cta_type" "enum__home_page_v_version_footer_cta_cta_type" DEFAULT 'none' NOT NULL,
  	"version_footer_cta_cta_url" varchar,
  	"version_footer_cta_cta_page_id" integer,
  	"version_footer_cta_cta_section" "enum__home_page_v_version_footer_cta_cta_section",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_home_page_v_locales" (
  	"version_hero_heading" varchar DEFAULT 'Танцувай
като през
30-те.' NOT NULL,
  	"version_hero_intro" varchar,
  	"version_hero_primary_cta_label" varchar,
  	"version_hero_secondary_cta_label" varchar,
  	"version_course_card_badge" varchar DEFAULT 'Следваща група',
  	"version_course_card_link_label" varchar DEFAULT 'Виж курса',
  	"version_festival_card_badge" varchar DEFAULT 'Фестивал',
  	"version_festival_card_dates" varchar,
  	"version_festival_card_heading" varchar,
  	"version_festival_card_body" varchar,
  	"version_festival_card_link_label" varchar,
  	"version_beginners_kicker" varchar DEFAULT 'Начинаещи',
  	"version_beginners_heading" varchar DEFAULT 'Влез в група за начинаещи',
  	"version_beginners_intro" varchar,
  	"version_beginners_course_link_label" varchar DEFAULT 'Виж курса',
  	"version_beginners_reassurance_heading" varchar DEFAULT 'Без притеснения',
  	"version_beginners_signup_heading" varchar DEFAULT 'Още не е моментът?',
  	"version_beginners_signup_body" varchar,
  	"version_beginners_signup_placeholder" varchar DEFAULT 'твоят имейл',
  	"version_beginners_signup_button_label" varchar DEFAULT 'Кажи ми кога започва',
  	"version_beginners_signup_success_message" varchar DEFAULT 'Готово — ще ти пишем.',
  	"version_reviews_kicker" varchar DEFAULT 'Отзиви',
  	"version_reviews_heading" varchar DEFAULT 'Какво казват танцуващите',
  	"version_reviews_all_link_label" varchar,
  	"version_reviews_placeholder_note" varchar DEFAULT 'Място за отзив.',
  	"version_video_strip_kicker" varchar DEFAULT 'Видео',
  	"version_video_strip_heading" varchar DEFAULT 'Как изглежда отвътре',
  	"version_video_strip_handle_link_label" varchar,
  	"version_video_strip_note" varchar,
  	"version_dances_kicker" varchar DEFAULT 'Танци',
  	"version_dances_heading" varchar DEFAULT 'Три езика на суинга',
  	"version_dances_intro" varchar,
  	"version_dances_intro_link_label" varchar,
  	"version_dances_link_label" varchar DEFAULT 'Виж повече',
  	"version_faq_kicker" varchar DEFAULT 'Въпроси',
  	"version_faq_heading" varchar DEFAULT 'Преди първия час',
  	"version_events_kicker" varchar DEFAULT 'За текущите ученици',
  	"version_events_heading" varchar DEFAULT 'Предстоящи събития',
  	"version_events_intro" varchar,
  	"version_events_all_link_label" varchar,
  	"version_team_kicker" varchar DEFAULT 'Екип',
  	"version_team_heading" varchar DEFAULT 'Хората, които водят',
  	"version_team_intro" varchar,
  	"version_about_kicker" varchar DEFAULT 'За нас',
  	"version_about_heading" varchar DEFAULT 'Няколко неща в едно',
  	"version_contact_kicker" varchar DEFAULT 'Контакти',
  	"version_contact_heading" varchar DEFAULT 'Пиши ни',
  	"version_contact_intro" varchar,
  	"version_footer_cta_heading" varchar DEFAULT 'Първият час е най-трудният. После е само танц.',
  	"version_footer_cta_cta_label" varchar DEFAULT 'Запиши се за начинаещи',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "schedule_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_cta_type" "enum_schedule_page_primary_cta_type" DEFAULT 'none' NOT NULL,
  	"primary_cta_url" varchar,
  	"primary_cta_page_id" integer,
  	"primary_cta_section" "enum_schedule_page_primary_cta_section",
  	"secondary_cta_type" "enum_schedule_page_secondary_cta_type" DEFAULT 'none' NOT NULL,
  	"secondary_cta_url" varchar,
  	"secondary_cta_page_id" integer,
  	"secondary_cta_section" "enum_schedule_page_secondary_cta_section",
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "schedule_page_locales" (
  	"kicker" varchar DEFAULT 'График',
  	"title" varchar DEFAULT 'Класове, партита, фестивали' NOT NULL,
  	"lead" varchar,
  	"groups_heading" varchar DEFAULT 'Групи',
  	"groups_note" jsonb,
  	"events_heading" varchar DEFAULT 'Партита и фестивали',
  	"empty_note" varchar DEFAULT 'Скоро обявяваме следващите дати.',
  	"primary_cta_label" varchar DEFAULT 'Запиши се за начинаещи',
  	"secondary_cta_label" varchar DEFAULT 'Контакти',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_site_settings_nav_link_type" DEFAULT 'external' NOT NULL,
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_section" "enum_site_settings_nav_link_section"
  );
  
  CREATE TABLE "site_settings_nav_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_site_settings_footer_links_link_type" DEFAULT 'external' NOT NULL,
  	"link_url" varchar,
  	"link_page_id" integer,
  	"link_section" "enum_site_settings_footer_links_link_section"
  );
  
  CREATE TABLE "site_settings_footer_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'Swing Society' NOT NULL,
  	"logo_id" integer,
  	"cta_type" "enum_site_settings_cta_type" DEFAULT 'external' NOT NULL,
  	"cta_url" varchar,
  	"cta_page_id" integer,
  	"cta_section" "enum_site_settings_cta_section",
  	"registration_open" boolean DEFAULT true,
  	"phone" varchar,
  	"email" varchar,
  	"venue_map_url" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"hero_badge" varchar DEFAULT 'Swing Society · София',
  	"cta_label" varchar DEFAULT 'Запиши се' NOT NULL,
  	"address_line" varchar DEFAULT 'София, България',
  	"venue" varchar,
  	"footer_note" varchar DEFAULT 'Всеки е добре дошъл — независимо от възраст, пол и опит.',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_heading_locales" ADD CONSTRAINT "pages_blocks_heading_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_locales" ADD CONSTRAINT "pages_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_list_items" ADD CONSTRAINT "pages_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_list_items_locales" ADD CONSTRAINT "pages_blocks_list_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_list_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_list" ADD CONSTRAINT "pages_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_locales" ADD CONSTRAINT "pages_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_locales" ADD CONSTRAINT "pages_blocks_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_locales" ADD CONSTRAINT "pages_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_heading_locales" ADD CONSTRAINT "_pages_v_blocks_heading_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_heading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_locales" ADD CONSTRAINT "_pages_v_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_list_items" ADD CONSTRAINT "_pages_v_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_list_items_locales" ADD CONSTRAINT "_pages_v_blocks_list_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_list_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_list" ADD CONSTRAINT "_pages_v_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_locales" ADD CONSTRAINT "_pages_v_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_locales" ADD CONSTRAINT "_pages_v_blocks_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_locales" ADD CONSTRAINT "_pages_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_poster_id_media_id_fk" FOREIGN KEY ("version_hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_cta_page_id_pages_id_fk" FOREIGN KEY ("version_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_tags" ADD CONSTRAINT "courses_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_tags_locales" ADD CONSTRAINT "courses_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_registration_page_id_pages_id_fk" FOREIGN KEY ("registration_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_locales" ADD CONSTRAINT "courses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_ticket_page_id_pages_id_fk" FOREIGN KEY ("ticket_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers" ADD CONSTRAINT "teachers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teachers_locales" ADD CONSTRAINT "teachers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews_locales" ADD CONSTRAINT "reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teachers_fk" FOREIGN KEY ("teachers_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_beginners_reassurances" ADD CONSTRAINT "home_page_beginners_reassurances_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_beginners_reassurances_locales" ADD CONSTRAINT "home_page_beginners_reassurances_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_beginners_reassurances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_video_strip_items" ADD CONSTRAINT "home_page_video_strip_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_video_strip_items" ADD CONSTRAINT "home_page_video_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_video_strip_items" ADD CONSTRAINT "home_page_video_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_video_strip_items_locales" ADD CONSTRAINT "home_page_video_strip_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_video_strip_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_faq_items" ADD CONSTRAINT "home_page_faq_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_faq_items" ADD CONSTRAINT "home_page_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_faq_items_locales" ADD CONSTRAINT "home_page_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_about_paragraphs" ADD CONSTRAINT "home_page_about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_about_paragraphs_locales" ADD CONSTRAINT "home_page_about_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_about_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_photo_id_media_id_fk" FOREIGN KEY ("hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_primary_cta_page_id_pages_id_fk" FOREIGN KEY ("hero_primary_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_secondary_cta_page_id_pages_id_fk" FOREIGN KEY ("hero_secondary_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_course_card_course_id_courses_id_fk" FOREIGN KEY ("course_card_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_festival_card_logo_id_media_id_fk" FOREIGN KEY ("festival_card_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_festival_card_link_page_id_pages_id_fk" FOREIGN KEY ("festival_card_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_beginners_course_id_courses_id_fk" FOREIGN KEY ("beginners_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_reviews_all_link_page_id_pages_id_fk" FOREIGN KEY ("reviews_all_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_video_strip_handle_link_page_id_pages_id_fk" FOREIGN KEY ("video_strip_handle_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_dances_intro_link_page_id_pages_id_fk" FOREIGN KEY ("dances_intro_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_events_all_link_page_id_pages_id_fk" FOREIGN KEY ("events_all_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_footer_cta_cta_page_id_pages_id_fk" FOREIGN KEY ("footer_cta_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_beginners_reassurances" ADD CONSTRAINT "_home_page_v_version_beginners_reassurances_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_beginners_reassurances_locales" ADD CONSTRAINT "_home_page_v_version_beginners_reassurances_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_beginners_reassurances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_video_strip_items" ADD CONSTRAINT "_home_page_v_version_video_strip_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_video_strip_items" ADD CONSTRAINT "_home_page_v_version_video_strip_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_video_strip_items" ADD CONSTRAINT "_home_page_v_version_video_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_video_strip_items_locales" ADD CONSTRAINT "_home_page_v_version_video_strip_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_video_strip_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_faq_items" ADD CONSTRAINT "_home_page_v_version_faq_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_faq_items" ADD CONSTRAINT "_home_page_v_version_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_faq_items_locales" ADD CONSTRAINT "_home_page_v_version_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_about_paragraphs" ADD CONSTRAINT "_home_page_v_version_about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_about_paragraphs_locales" ADD CONSTRAINT "_home_page_v_version_about_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_about_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_photo_id_media_id_fk" FOREIGN KEY ("version_hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_primary_cta_page_id_pages_id_fk" FOREIGN KEY ("version_hero_primary_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_secondary_cta_page_id_pages_id_fk" FOREIGN KEY ("version_hero_secondary_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_course_card_course_id_courses_id_fk" FOREIGN KEY ("version_course_card_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_festival_card_logo_id_media_id_fk" FOREIGN KEY ("version_festival_card_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_festival_card_link_page_id_pages_id_fk" FOREIGN KEY ("version_festival_card_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_beginners_course_id_courses_id_fk" FOREIGN KEY ("version_beginners_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_reviews_all_link_page_id_pages_id_fk" FOREIGN KEY ("version_reviews_all_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_video_strip_handle_link_page_id_pages_id_fk" FOREIGN KEY ("version_video_strip_handle_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_dances_intro_link_page_id_pages_id_fk" FOREIGN KEY ("version_dances_intro_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_events_all_link_page_id_pages_id_fk" FOREIGN KEY ("version_events_all_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_about_image_id_media_id_fk" FOREIGN KEY ("version_about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_footer_cta_cta_page_id_pages_id_fk" FOREIGN KEY ("version_footer_cta_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_locales" ADD CONSTRAINT "_home_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schedule_page" ADD CONSTRAINT "schedule_page_primary_cta_page_id_pages_id_fk" FOREIGN KEY ("primary_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedule_page" ADD CONSTRAINT "schedule_page_secondary_cta_page_id_pages_id_fk" FOREIGN KEY ("secondary_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedule_page_locales" ADD CONSTRAINT "schedule_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schedule_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav" ADD CONSTRAINT "site_settings_nav_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_nav" ADD CONSTRAINT "site_settings_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav_locales" ADD CONSTRAINT "site_settings_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links_locales" ADD CONSTRAINT "site_settings_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_heading_order_idx" ON "pages_blocks_heading" USING btree ("_order");
  CREATE INDEX "pages_blocks_heading_parent_id_idx" ON "pages_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_heading_path_idx" ON "pages_blocks_heading" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_heading_locales_locale_parent_id_unique" ON "pages_blocks_heading_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_text_locales_locale_parent_id_unique" ON "pages_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_list_items_order_idx" ON "pages_blocks_list_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_list_items_parent_id_idx" ON "pages_blocks_list_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_list_items_locales_locale_parent_id_unique" ON "pages_blocks_list_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_list_order_idx" ON "pages_blocks_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_list_parent_id_idx" ON "pages_blocks_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_list_path_idx" ON "pages_blocks_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_quote_order_idx" ON "pages_blocks_quote" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_parent_id_idx" ON "pages_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_path_idx" ON "pages_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_quote_locales_locale_parent_id_unique" ON "pages_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_image_locales_locale_parent_id_unique" ON "pages_blocks_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_file_idx" ON "pages_blocks_video" USING btree ("file_id");
  CREATE INDEX "pages_blocks_video_poster_idx" ON "pages_blocks_video" USING btree ("poster_id");
  CREATE UNIQUE INDEX "pages_blocks_video_locales_locale_parent_id_unique" ON "pages_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_hero_hero_poster_idx" ON "pages" USING btree ("hero_poster_id");
  CREATE INDEX "pages_cta_cta_page_idx" ON "pages" USING btree ("cta_page_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_heading_order_idx" ON "_pages_v_blocks_heading" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_heading_parent_id_idx" ON "_pages_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_heading_path_idx" ON "_pages_v_blocks_heading" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_heading_locales_locale_parent_id_unique" ON "_pages_v_blocks_heading_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_text_order_idx" ON "_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_parent_id_idx" ON "_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_path_idx" ON "_pages_v_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_list_items_order_idx" ON "_pages_v_blocks_list_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_list_items_parent_id_idx" ON "_pages_v_blocks_list_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_list_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_list_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_list_order_idx" ON "_pages_v_blocks_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_list_parent_id_idx" ON "_pages_v_blocks_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_list_path_idx" ON "_pages_v_blocks_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quote_order_idx" ON "_pages_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_parent_id_idx" ON "_pages_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_path_idx" ON "_pages_v_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_quote_locales_locale_parent_id_unique" ON "_pages_v_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_image_locales_locale_parent_id_unique" ON "_pages_v_blocks_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_file_idx" ON "_pages_v_blocks_video" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_video_poster_idx" ON "_pages_v_blocks_video" USING btree ("poster_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_video_locales_locale_parent_id_unique" ON "_pages_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_poster_idx" ON "_pages_v" USING btree ("version_hero_poster_id");
  CREATE INDEX "_pages_v_version_cta_version_cta_page_idx" ON "_pages_v" USING btree ("version_cta_page_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "courses_tags_order_idx" ON "courses_tags" USING btree ("_order");
  CREATE INDEX "courses_tags_parent_id_idx" ON "courses_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_tags_locales_locale_parent_id_unique" ON "courses_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "courses_registration_registration_page_idx" ON "courses" USING btree ("registration_page_id");
  CREATE INDEX "courses_page_idx" ON "courses" USING btree ("page_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE UNIQUE INDEX "courses_locales_locale_parent_id_unique" ON "courses_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_ticket_ticket_page_idx" ON "events" USING btree ("ticket_page_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "teachers_photo_idx" ON "teachers" USING btree ("photo_id");
  CREATE INDEX "teachers_updated_at_idx" ON "teachers" USING btree ("updated_at");
  CREATE INDEX "teachers_created_at_idx" ON "teachers" USING btree ("created_at");
  CREATE UNIQUE INDEX "teachers_locales_locale_parent_id_unique" ON "teachers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "reviews_locales_locale_parent_id_unique" ON "reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_portrait_sizes_portrait_filename_idx" ON "media" USING btree ("sizes_portrait_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_teachers_id_idx" ON "payload_locked_documents_rels" USING btree ("teachers_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_beginners_reassurances_order_idx" ON "home_page_beginners_reassurances" USING btree ("_order");
  CREATE INDEX "home_page_beginners_reassurances_parent_id_idx" ON "home_page_beginners_reassurances" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_beginners_reassurances_locales_locale_parent_id_un" ON "home_page_beginners_reassurances_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_video_strip_items_order_idx" ON "home_page_video_strip_items" USING btree ("_order");
  CREATE INDEX "home_page_video_strip_items_parent_id_idx" ON "home_page_video_strip_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_video_strip_items_video_idx" ON "home_page_video_strip_items" USING btree ("video_id");
  CREATE INDEX "home_page_video_strip_items_image_idx" ON "home_page_video_strip_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_page_video_strip_items_locales_locale_parent_id_unique" ON "home_page_video_strip_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_faq_items_order_idx" ON "home_page_faq_items" USING btree ("_order");
  CREATE INDEX "home_page_faq_items_parent_id_idx" ON "home_page_faq_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_faq_items_link_link_page_idx" ON "home_page_faq_items" USING btree ("link_page_id");
  CREATE UNIQUE INDEX "home_page_faq_items_locales_locale_parent_id_unique" ON "home_page_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_about_paragraphs_order_idx" ON "home_page_about_paragraphs" USING btree ("_order");
  CREATE INDEX "home_page_about_paragraphs_parent_id_idx" ON "home_page_about_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_about_paragraphs_locales_locale_parent_id_unique" ON "home_page_about_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_hero_photo_idx" ON "home_page" USING btree ("hero_photo_id");
  CREATE INDEX "home_page_hero_primary_cta_hero_primary_cta_page_idx" ON "home_page" USING btree ("hero_primary_cta_page_id");
  CREATE INDEX "home_page_hero_secondary_cta_hero_secondary_cta_page_idx" ON "home_page" USING btree ("hero_secondary_cta_page_id");
  CREATE INDEX "home_page_course_card_course_card_course_idx" ON "home_page" USING btree ("course_card_course_id");
  CREATE INDEX "home_page_festival_card_festival_card_logo_idx" ON "home_page" USING btree ("festival_card_logo_id");
  CREATE INDEX "home_page_festival_card_link_festival_card_link_page_idx" ON "home_page" USING btree ("festival_card_link_page_id");
  CREATE INDEX "home_page_beginners_beginners_course_idx" ON "home_page" USING btree ("beginners_course_id");
  CREATE INDEX "home_page_reviews_all_link_reviews_all_link_page_idx" ON "home_page" USING btree ("reviews_all_link_page_id");
  CREATE INDEX "home_page_video_strip_handle_link_video_strip_handle_lin_idx" ON "home_page" USING btree ("video_strip_handle_link_page_id");
  CREATE INDEX "home_page_dances_intro_link_dances_intro_link_page_idx" ON "home_page" USING btree ("dances_intro_link_page_id");
  CREATE INDEX "home_page_events_all_link_events_all_link_page_idx" ON "home_page" USING btree ("events_all_link_page_id");
  CREATE INDEX "home_page_about_about_image_idx" ON "home_page" USING btree ("about_image_id");
  CREATE INDEX "home_page_footer_cta_cta_footer_cta_cta_page_idx" ON "home_page" USING btree ("footer_cta_cta_page_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_pages_id_idx" ON "home_page_rels" USING btree ("pages_id");
  CREATE INDEX "_home_page_v_version_beginners_reassurances_order_idx" ON "_home_page_v_version_beginners_reassurances" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_beginners_reassurances_parent_id_idx" ON "_home_page_v_version_beginners_reassurances" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_beginners_reassurances_locales_locale_p" ON "_home_page_v_version_beginners_reassurances_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_video_strip_items_order_idx" ON "_home_page_v_version_video_strip_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_video_strip_items_parent_id_idx" ON "_home_page_v_version_video_strip_items" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_video_strip_items_video_idx" ON "_home_page_v_version_video_strip_items" USING btree ("video_id");
  CREATE INDEX "_home_page_v_version_video_strip_items_image_idx" ON "_home_page_v_version_video_strip_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_page_v_version_video_strip_items_locales_locale_parent" ON "_home_page_v_version_video_strip_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_faq_items_order_idx" ON "_home_page_v_version_faq_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_faq_items_parent_id_idx" ON "_home_page_v_version_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_faq_items_link_link_page_idx" ON "_home_page_v_version_faq_items" USING btree ("link_page_id");
  CREATE UNIQUE INDEX "_home_page_v_version_faq_items_locales_locale_parent_id_uniq" ON "_home_page_v_version_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_about_paragraphs_order_idx" ON "_home_page_v_version_about_paragraphs" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_about_paragraphs_parent_id_idx" ON "_home_page_v_version_about_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_about_paragraphs_locales_locale_parent_" ON "_home_page_v_version_about_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_hero_version_hero_photo_idx" ON "_home_page_v" USING btree ("version_hero_photo_id");
  CREATE INDEX "_home_page_v_version_hero_primary_cta_version_hero_prima_idx" ON "_home_page_v" USING btree ("version_hero_primary_cta_page_id");
  CREATE INDEX "_home_page_v_version_hero_secondary_cta_version_hero_sec_idx" ON "_home_page_v" USING btree ("version_hero_secondary_cta_page_id");
  CREATE INDEX "_home_page_v_version_course_card_version_course_card_cou_idx" ON "_home_page_v" USING btree ("version_course_card_course_id");
  CREATE INDEX "_home_page_v_version_festival_card_version_festival_card_idx" ON "_home_page_v" USING btree ("version_festival_card_logo_id");
  CREATE INDEX "_home_page_v_version_festival_card_link_version_festival_idx" ON "_home_page_v" USING btree ("version_festival_card_link_page_id");
  CREATE INDEX "_home_page_v_version_beginners_version_beginners_course_idx" ON "_home_page_v" USING btree ("version_beginners_course_id");
  CREATE INDEX "_home_page_v_version_reviews_all_link_version_reviews_al_idx" ON "_home_page_v" USING btree ("version_reviews_all_link_page_id");
  CREATE INDEX "_home_page_v_version_video_strip_handle_link_version_vid_idx" ON "_home_page_v" USING btree ("version_video_strip_handle_link_page_id");
  CREATE INDEX "_home_page_v_version_dances_intro_link_version_dances_in_idx" ON "_home_page_v" USING btree ("version_dances_intro_link_page_id");
  CREATE INDEX "_home_page_v_version_events_all_link_version_events_all__idx" ON "_home_page_v" USING btree ("version_events_all_link_page_id");
  CREATE INDEX "_home_page_v_version_about_version_about_image_idx" ON "_home_page_v" USING btree ("version_about_image_id");
  CREATE INDEX "_home_page_v_version_footer_cta_cta_version_footer_cta_c_idx" ON "_home_page_v" USING btree ("version_footer_cta_cta_page_id");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_home_page_v_locales_locale_parent_id_unique" ON "_home_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_rels_order_idx" ON "_home_page_v_rels" USING btree ("order");
  CREATE INDEX "_home_page_v_rels_parent_idx" ON "_home_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_rels_path_idx" ON "_home_page_v_rels" USING btree ("path");
  CREATE INDEX "_home_page_v_rels_pages_id_idx" ON "_home_page_v_rels" USING btree ("pages_id");
  CREATE INDEX "schedule_page_primary_cta_primary_cta_page_idx" ON "schedule_page" USING btree ("primary_cta_page_id");
  CREATE INDEX "schedule_page_secondary_cta_secondary_cta_page_idx" ON "schedule_page" USING btree ("secondary_cta_page_id");
  CREATE UNIQUE INDEX "schedule_page_locales_locale_parent_id_unique" ON "schedule_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_nav_order_idx" ON "site_settings_nav" USING btree ("_order");
  CREATE INDEX "site_settings_nav_parent_id_idx" ON "site_settings_nav" USING btree ("_parent_id");
  CREATE INDEX "site_settings_nav_link_link_page_idx" ON "site_settings_nav" USING btree ("link_page_id");
  CREATE UNIQUE INDEX "site_settings_nav_locales_locale_parent_id_unique" ON "site_settings_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_footer_links_order_idx" ON "site_settings_footer_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_links_parent_id_idx" ON "site_settings_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_links_link_link_page_idx" ON "site_settings_footer_links" USING btree ("link_page_id");
  CREATE UNIQUE INDEX "site_settings_footer_links_locales_locale_parent_id_unique" ON "site_settings_footer_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_cta_cta_page_idx" ON "site_settings" USING btree ("cta_page_id");
  CREATE INDEX "site_settings_meta_meta_image_idx" ON "site_settings" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_heading" CASCADE;
  DROP TABLE "pages_blocks_heading_locales" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_text_locales" CASCADE;
  DROP TABLE "pages_blocks_list_items" CASCADE;
  DROP TABLE "pages_blocks_list_items_locales" CASCADE;
  DROP TABLE "pages_blocks_list" CASCADE;
  DROP TABLE "pages_blocks_quote" CASCADE;
  DROP TABLE "pages_blocks_quote_locales" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_image_locales" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_video_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_heading" CASCADE;
  DROP TABLE "_pages_v_blocks_heading_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_text" CASCADE;
  DROP TABLE "_pages_v_blocks_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_list_items" CASCADE;
  DROP TABLE "_pages_v_blocks_list_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_list" CASCADE;
  DROP TABLE "_pages_v_blocks_quote" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_image_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_video_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "courses_tags" CASCADE;
  DROP TABLE "courses_tags_locales" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "teachers" CASCADE;
  DROP TABLE "teachers_locales" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "reviews_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_beginners_reassurances" CASCADE;
  DROP TABLE "home_page_beginners_reassurances_locales" CASCADE;
  DROP TABLE "home_page_video_strip_items" CASCADE;
  DROP TABLE "home_page_video_strip_items_locales" CASCADE;
  DROP TABLE "home_page_faq_items" CASCADE;
  DROP TABLE "home_page_faq_items_locales" CASCADE;
  DROP TABLE "home_page_about_paragraphs" CASCADE;
  DROP TABLE "home_page_about_paragraphs_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "_home_page_v_version_beginners_reassurances" CASCADE;
  DROP TABLE "_home_page_v_version_beginners_reassurances_locales" CASCADE;
  DROP TABLE "_home_page_v_version_video_strip_items" CASCADE;
  DROP TABLE "_home_page_v_version_video_strip_items_locales" CASCADE;
  DROP TABLE "_home_page_v_version_faq_items" CASCADE;
  DROP TABLE "_home_page_v_version_faq_items_locales" CASCADE;
  DROP TABLE "_home_page_v_version_about_paragraphs" CASCADE;
  DROP TABLE "_home_page_v_version_about_paragraphs_locales" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_home_page_v_locales" CASCADE;
  DROP TABLE "_home_page_v_rels" CASCADE;
  DROP TABLE "schedule_page" CASCADE;
  DROP TABLE "schedule_page_locales" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings_nav" CASCADE;
  DROP TABLE "site_settings_nav_locales" CASCADE;
  DROP TABLE "site_settings_footer_links" CASCADE;
  DROP TABLE "site_settings_footer_links_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_video_source";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_cta_type";
  DROP TYPE "public"."enum_pages_cta_section";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_video_source";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_cta_type";
  DROP TYPE "public"."enum__pages_v_version_cta_section";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum_courses_registration_type";
  DROP TYPE "public"."enum_courses_registration_section";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_events_ticket_type";
  DROP TYPE "public"."enum_events_ticket_section";
  DROP TYPE "public"."enum_subscribers_locale";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_home_page_faq_items_link_type";
  DROP TYPE "public"."enum_home_page_faq_items_link_section";
  DROP TYPE "public"."enum_home_page_hero_primary_cta_type";
  DROP TYPE "public"."enum_home_page_hero_primary_cta_section";
  DROP TYPE "public"."enum_home_page_hero_secondary_cta_type";
  DROP TYPE "public"."enum_home_page_hero_secondary_cta_section";
  DROP TYPE "public"."enum_home_page_festival_card_link_type";
  DROP TYPE "public"."enum_home_page_festival_card_link_section";
  DROP TYPE "public"."enum_home_page_reviews_all_link_type";
  DROP TYPE "public"."enum_home_page_reviews_all_link_section";
  DROP TYPE "public"."enum_home_page_video_strip_handle_link_type";
  DROP TYPE "public"."enum_home_page_video_strip_handle_link_section";
  DROP TYPE "public"."enum_home_page_dances_intro_link_type";
  DROP TYPE "public"."enum_home_page_dances_intro_link_section";
  DROP TYPE "public"."enum_home_page_events_all_link_type";
  DROP TYPE "public"."enum_home_page_events_all_link_section";
  DROP TYPE "public"."enum_home_page_footer_cta_cta_type";
  DROP TYPE "public"."enum_home_page_footer_cta_cta_section";
  DROP TYPE "public"."enum__home_page_v_version_faq_items_link_type";
  DROP TYPE "public"."enum__home_page_v_version_faq_items_link_section";
  DROP TYPE "public"."enum__home_page_v_version_hero_primary_cta_type";
  DROP TYPE "public"."enum__home_page_v_version_hero_primary_cta_section";
  DROP TYPE "public"."enum__home_page_v_version_hero_secondary_cta_type";
  DROP TYPE "public"."enum__home_page_v_version_hero_secondary_cta_section";
  DROP TYPE "public"."enum__home_page_v_version_festival_card_link_type";
  DROP TYPE "public"."enum__home_page_v_version_festival_card_link_section";
  DROP TYPE "public"."enum__home_page_v_version_reviews_all_link_type";
  DROP TYPE "public"."enum__home_page_v_version_reviews_all_link_section";
  DROP TYPE "public"."enum__home_page_v_version_video_strip_handle_link_type";
  DROP TYPE "public"."enum__home_page_v_version_video_strip_handle_link_section";
  DROP TYPE "public"."enum__home_page_v_version_dances_intro_link_type";
  DROP TYPE "public"."enum__home_page_v_version_dances_intro_link_section";
  DROP TYPE "public"."enum__home_page_v_version_events_all_link_type";
  DROP TYPE "public"."enum__home_page_v_version_events_all_link_section";
  DROP TYPE "public"."enum__home_page_v_version_footer_cta_cta_type";
  DROP TYPE "public"."enum__home_page_v_version_footer_cta_cta_section";
  DROP TYPE "public"."enum_schedule_page_primary_cta_type";
  DROP TYPE "public"."enum_schedule_page_primary_cta_section";
  DROP TYPE "public"."enum_schedule_page_secondary_cta_type";
  DROP TYPE "public"."enum_schedule_page_secondary_cta_section";
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum_site_settings_nav_link_type";
  DROP TYPE "public"."enum_site_settings_nav_link_section";
  DROP TYPE "public"."enum_site_settings_footer_links_link_type";
  DROP TYPE "public"."enum_site_settings_footer_links_link_section";
  DROP TYPE "public"."enum_site_settings_cta_type";
  DROP TYPE "public"."enum_site_settings_cta_section";`)
}
