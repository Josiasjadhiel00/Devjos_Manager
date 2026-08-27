import { Pool } from 'pg';

export const INIT_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "uid" text NOT NULL UNIQUE,
  "email" text NOT NULL,
  "role" text DEFAULT 'Administrador',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "clients" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "company" text DEFAULT '',
  "phone" text DEFAULT '',
  "whatsapp" text DEFAULT '',
  "email" text DEFAULT '',
  "address" text DEFAULT '',
  "instagram" text DEFAULT '',
  "facebook" text DEFAULT '',
  "website" text DEFAULT '',
  "registered_date" text NOT NULL,
  "status" text DEFAULT 'Prospecto' NOT NULL,
  "notes" text DEFAULT '',
  "avatar" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "client_id" text NOT NULL,
  "category" text DEFAULT 'Desarrollo' NOT NULL,
  "description" text DEFAULT '',
  "price" double precision DEFAULT 0 NOT NULL,
  "start_date" text NOT NULL,
  "delivery_date" text NOT NULL,
  "status" text DEFAULT 'Lead' NOT NULL,
  "priority" text DEFAULT 'Media' NOT NULL,
  "progress" integer DEFAULT 0 NOT NULL,
  "responsible_id" text DEFAULT '',
  "notes" text DEFAULT '',
  "paid_amount" double precision DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "tasks" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text DEFAULT '',
  "project_id" text NOT NULL,
  "responsible_id" text DEFAULT '',
  "priority" text DEFAULT 'Media' NOT NULL,
  "due_date" text NOT NULL,
  "status" text DEFAULT 'Pendiente' NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "services" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "category" text DEFAULT 'Desarrollo' NOT NULL,
  "description" text DEFAULT '',
  "base_price" double precision DEFAULT 0 NOT NULL,
  "min_price" double precision DEFAULT 0 NOT NULL,
  "status" text DEFAULT 'Activo' NOT NULL,
  "unit" text DEFAULT 'Servicio',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "quotes" (
  "id" text PRIMARY KEY NOT NULL,
  "quote_number" text NOT NULL UNIQUE,
  "client_id" text NOT NULL,
  "issue_date" text NOT NULL,
  "expiry_date" text NOT NULL,
  "status" text DEFAULT 'Borrador' NOT NULL,
  "items_json" text DEFAULT '[]' NOT NULL,
  "subtotal" double precision DEFAULT 0 NOT NULL,
  "discount_total" double precision DEFAULT 0 NOT NULL,
  "tax_rate" double precision DEFAULT 0.18 NOT NULL,
  "tax_amount" double precision DEFAULT 0 NOT NULL,
  "total" double precision DEFAULT 0 NOT NULL,
  "notes" text DEFAULT '',
  "terms" text DEFAULT '',
  "associated_project_id" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "incomes" (
  "id" text PRIMARY KEY NOT NULL,
  "client_id" text NOT NULL,
  "project_id" text DEFAULT '',
  "amount" double precision DEFAULT 0 NOT NULL,
  "date" text NOT NULL,
  "method" text DEFAULT 'Transferencia' NOT NULL,
  "description" text DEFAULT '',
  "invoice_number" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "expenses" (
  "id" text PRIMARY KEY NOT NULL,
  "category" text DEFAULT 'Otros' NOT NULL,
  "description" text DEFAULT '',
  "amount" double precision DEFAULT 0 NOT NULL,
  "date" text NOT NULL,
  "method" text DEFAULT 'Transferencia' NOT NULL,
  "receipt_url" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "payments" (
  "id" text PRIMARY KEY NOT NULL,
  "project_id" text NOT NULL,
  "client_id" text NOT NULL,
  "total_contract" double precision DEFAULT 0 NOT NULL,
  "advance_payment" double precision DEFAULT 0 NOT NULL,
  "second_payment" double precision DEFAULT 0 NOT NULL,
  "additional_payments_json" text DEFAULT '[]' NOT NULL,
  "total_paid" double precision DEFAULT 0 NOT NULL,
  "total_pending" double precision DEFAULT 0 NOT NULL,
  "status" text DEFAULT 'Pendiente' NOT NULL,
  "last_payment_date" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "photo_sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "client_id" text NOT NULL,
  "project_id" text DEFAULT '',
  "title" text NOT NULL,
  "date" text NOT NULL,
  "time" text NOT NULL,
  "location" text DEFAULT '',
  "session_type" text DEFAULT 'Sesiones' NOT NULL,
  "photos_taken" integer DEFAULT 0 NOT NULL,
  "photos_selected" integer DEFAULT 0 NOT NULL,
  "photos_edited" integer DEFAULT 0 NOT NULL,
  "photos_delivered" integer DEFAULT 0 NOT NULL,
  "status" text DEFAULT 'Programada' NOT NULL,
  "notes" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "galleries" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "client_id" text NOT NULL,
  "session_id" text DEFAULT '',
  "project_id" text DEFAULT '',
  "cover_image" text DEFAULT '',
  "images_json" text DEFAULT '[]' NOT NULL,
  "client_shared" boolean DEFAULT false NOT NULL,
  "share_token" text NOT NULL,
  "description" text DEFAULT '',
  "created_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "media_projects" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "client_id" text NOT NULL,
  "project_id" text DEFAULT '',
  "format" text DEFAULT 'Reel / Vertical (9:16)' NOT NULL,
  "duration" text DEFAULT '0:30',
  "script" text DEFAULT '',
  "versions_json" text DEFAULT '[]' NOT NULL,
  "current_version" text DEFAULT 'V1' NOT NULL,
  "status" text DEFAULT 'Grabación' NOT NULL,
  "notes" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "project_files" (
  "id" text PRIMARY KEY NOT NULL,
  "client_id" text NOT NULL,
  "project_id" text NOT NULL,
  "folder" text DEFAULT 'Cotización' NOT NULL,
  "name" text NOT NULL,
  "size" text DEFAULT '0 KB',
  "type" text DEFAULT 'Archivo',
  "upload_date" text NOT NULL,
  "url" text DEFAULT '#' NOT NULL,
  "nas_synced" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "calendar_events" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "type" text DEFAULT 'Evento general' NOT NULL,
  "start_date" text NOT NULL,
  "end_date" text NOT NULL,
  "time" text DEFAULT '',
  "client_id" text DEFAULT '',
  "project_id" text DEFAULT '',
  "location" text DEFAULT '',
  "description" text DEFAULT '',
  "is_completed" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "team_members" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text DEFAULT '',
  "role" text DEFAULT 'Developer' NOT NULL,
  "avatar" text DEFAULT '',
  "active" boolean DEFAULT true NOT NULL,
  "skills_json" text DEFAULT '[]' NOT NULL,
  "bio" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "studio_settings" (
  "id" text PRIMARY KEY NOT NULL,
  "settings_json" text NOT NULL,
  "updated_at" timestamp DEFAULT now()
);
`;

export async function ensurePostgresTablesExist(pool: Pool) {
  try {
    await pool.query(INIT_TABLES_SQL);
    console.log('✅ PostgreSQL / Vercel Postgres tables verified & initialized successfully.');
  } catch (err: any) {
    console.error('⚠️ Could not automatically execute INIT_TABLES_SQL:', err?.message || err);
  }
}
