var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/index.ts
import express from "express";

// src/apiRouter.ts
import { Router } from "express";

// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  calendarEvents: () => calendarEvents,
  clients: () => clients,
  expenses: () => expenses,
  galleries: () => galleries,
  incomes: () => incomes,
  mediaProjects: () => mediaProjects,
  payments: () => payments,
  photoSessions: () => photoSessions,
  projectFiles: () => projectFiles,
  projects: () => projects,
  quotes: () => quotes,
  services: () => services,
  studioSettings: () => studioSettings,
  tasks: () => tasks,
  teamMembers: () => teamMembers,
  users: () => users
});
import { pgTable, text, serial, integer, doublePrecision, boolean, timestamp } from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  role: text("role").default("Administrador"),
  createdAt: timestamp("created_at").defaultNow()
});
var clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").default(""),
  phone: text("phone").default(""),
  whatsapp: text("whatsapp").default(""),
  email: text("email").default(""),
  address: text("address").default(""),
  instagram: text("instagram").default(""),
  facebook: text("facebook").default(""),
  website: text("website").default(""),
  registeredDate: text("registered_date").notNull(),
  status: text("status").notNull().default("Prospecto"),
  notes: text("notes").default(""),
  avatar: text("avatar").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  clientId: text("client_id").notNull(),
  category: text("category").notNull().default("Desarrollo"),
  description: text("description").default(""),
  price: doublePrecision("price").notNull().default(0),
  startDate: text("start_date").notNull(),
  deliveryDate: text("delivery_date").notNull(),
  status: text("status").notNull().default("Lead"),
  priority: text("priority").notNull().default("Media"),
  progress: integer("progress").notNull().default(0),
  responsibleId: text("responsible_id").default(""),
  notes: text("notes").default(""),
  paidAmount: doublePrecision("paid_amount").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").default(""),
  projectId: text("project_id").notNull(),
  responsibleId: text("responsible_id").default(""),
  priority: text("priority").notNull().default("Media"),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull().default("Pendiente"),
  createdAt: timestamp("created_at").defaultNow()
});
var services = pgTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("Desarrollo"),
  description: text("description").default(""),
  basePrice: doublePrecision("base_price").notNull().default(0),
  minPrice: doublePrecision("min_price").notNull().default(0),
  status: text("status").notNull().default("Activo"),
  unit: text("unit").default("Servicio"),
  createdAt: timestamp("created_at").defaultNow()
});
var quotes = pgTable("quotes", {
  id: text("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  clientId: text("client_id").notNull(),
  issueDate: text("issue_date").notNull(),
  expiryDate: text("expiry_date").notNull(),
  status: text("status").notNull().default("Borrador"),
  itemsJson: text("items_json").notNull().default("[]"),
  subtotal: doublePrecision("subtotal").notNull().default(0),
  discountTotal: doublePrecision("discount_total").notNull().default(0),
  taxRate: doublePrecision("tax_rate").notNull().default(0.18),
  taxAmount: doublePrecision("tax_amount").notNull().default(0),
  total: doublePrecision("total").notNull().default(0),
  notes: text("notes").default(""),
  terms: text("terms").default(""),
  associatedProjectId: text("associated_project_id").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var incomes = pgTable("incomes", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  projectId: text("project_id").default(""),
  amount: doublePrecision("amount").notNull().default(0),
  date: text("date").notNull(),
  method: text("method").notNull().default("Transferencia"),
  description: text("description").default(""),
  invoiceNumber: text("invoice_number").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var expenses = pgTable("expenses", {
  id: text("id").primaryKey(),
  category: text("category").notNull().default("Otros"),
  description: text("description").default(""),
  amount: doublePrecision("amount").notNull().default(0),
  date: text("date").notNull(),
  method: text("method").notNull().default("Transferencia"),
  receiptUrl: text("receipt_url").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var payments = pgTable("payments", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  clientId: text("client_id").notNull(),
  totalContract: doublePrecision("total_contract").notNull().default(0),
  advancePayment: doublePrecision("advance_payment").notNull().default(0),
  secondPayment: doublePrecision("second_payment").notNull().default(0),
  additionalPaymentsJson: text("additional_payments_json").notNull().default("[]"),
  totalPaid: doublePrecision("total_paid").notNull().default(0),
  totalPending: doublePrecision("total_pending").notNull().default(0),
  status: text("status").notNull().default("Pendiente"),
  lastPaymentDate: text("last_payment_date").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var photoSessions = pgTable("photo_sessions", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  projectId: text("project_id").default(""),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").default(""),
  sessionType: text("session_type").notNull().default("Sesiones"),
  photosTaken: integer("photos_taken").notNull().default(0),
  photosSelected: integer("photos_selected").notNull().default(0),
  photosEdited: integer("photos_edited").notNull().default(0),
  photosDelivered: integer("photos_delivered").notNull().default(0),
  status: text("status").notNull().default("Programada"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var galleries = pgTable("galleries", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  clientId: text("client_id").notNull(),
  sessionId: text("session_id").default(""),
  projectId: text("project_id").default(""),
  coverImage: text("cover_image").default(""),
  imagesJson: text("images_json").notNull().default("[]"),
  clientShared: boolean("client_shared").notNull().default(false),
  shareToken: text("share_token").notNull(),
  description: text("description").default(""),
  createdAt: text("created_at").notNull()
});
var mediaProjects = pgTable("media_projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  clientId: text("client_id").notNull(),
  projectId: text("project_id").default(""),
  format: text("format").notNull().default("Reel / Vertical (9:16)"),
  duration: text("duration").default("0:30"),
  script: text("script").default(""),
  versionsJson: text("versions_json").notNull().default("[]"),
  currentVersion: text("current_version").notNull().default("V1"),
  status: text("status").notNull().default("Grabaci\xF3n"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var projectFiles = pgTable("project_files", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  projectId: text("project_id").notNull(),
  folder: text("folder").notNull().default("Cotizaci\xF3n"),
  name: text("name").notNull(),
  size: text("size").default("0 KB"),
  type: text("type").default("Archivo"),
  uploadDate: text("upload_date").notNull(),
  url: text("url").notNull().default("#"),
  nasSynced: boolean("nas_synced").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var calendarEvents = pgTable("calendar_events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("Evento general"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  time: text("time").default(""),
  clientId: text("client_id").default(""),
  projectId: text("project_id").default(""),
  location: text("location").default(""),
  description: text("description").default(""),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  role: text("role").notNull().default("Developer"),
  avatar: text("avatar").default(""),
  active: boolean("active").notNull().default(true),
  skillsJson: text("skills_json").notNull().default("[]"),
  bio: text("bio").default(""),
  createdAt: timestamp("created_at").defaultNow()
});
var studioSettings = pgTable("studio_settings", {
  id: text("id").primaryKey(),
  settingsJson: text("settings_json").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// src/db/index.ts
function getConnectionString() {
  return process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || process.env.VERCEL_POSTGRES_URL || process.env.NEON_DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.STORAGE_POSTGRES_URL;
}
var createPool = () => {
  if (!global._postgresPool) {
    const connectionString = getConnectionString();
    if (connectionString) {
      global._postgresPool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false
        },
        max: 10,
        connectionTimeoutMillis: 15e3
      });
    } else {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST || "127.0.0.1",
        user: process.env.SQL_USER || "postgres",
        password: process.env.SQL_PASSWORD || "",
        database: process.env.SQL_DB_NAME || "postgres",
        max: 10,
        connectionTimeoutMillis: 5e3
      });
    }
    global._postgresPool.on("error", (err) => {
      console.warn("Idle PostgreSQL pool client info/warning:", err?.message || err);
    });
  }
  return global._postgresPool;
};
var pool = createPool();
var db = drizzle(pool, { schema: schema_exports });

// src/db/initSchema.ts
var INIT_TABLES_SQL = `
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
  "status" text DEFAULT 'Grabaci\xF3n' NOT NULL,
  "notes" text DEFAULT '',
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "project_files" (
  "id" text PRIMARY KEY NOT NULL,
  "client_id" text NOT NULL,
  "project_id" text NOT NULL,
  "folder" text DEFAULT 'Cotizaci\xF3n' NOT NULL,
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
async function ensurePostgresTablesExist(pool2) {
  try {
    await pool2.query(INIT_TABLES_SQL);
    console.log("\u2705 PostgreSQL / Vercel Postgres tables verified & initialized successfully.");
  } catch (err) {
    console.error("\u26A0\uFE0F Could not automatically execute INIT_TABLES_SQL:", err?.message || err);
  }
}

// src/db/queries.ts
import { eq } from "drizzle-orm";

// src/data/initialData.ts
var initialSettings = {
  studioName: "DevJos Studio",
  tagline: "Desarrollo, Dise\xF1o, Fotograf\xEDa y Producci\xF3n Multimedia",
  email: "contacto@devjosstudio.com",
  phone: "+1 (829) 555-0199",
  whatsapp: "+1 (829) 555-0199",
  website: "https://devjosstudio.com",
  address: "Av. Tecnol\xF3gica 104, Suite 4B, Santo Domingo / Remote",
  taxId: "RNC 131-98765-2",
  currency: "DOP",
  currencySymbol: "RD$",
  taxRate: 18,
  nasStorageEnabled: true,
  nasStoragePath: "nas://devjos-vault/clients-data/2026/",
  automationRules: {
    autoCreateProjectOnQuoteAccept: true,
    autoCreateKickoffTasks: true,
    autoRecordAdvanceDeposit: true,
    autoFolderStructure: true,
    notifyOnDueDates: true
  }
};
var initialTeam = [
  {
    id: "team-1",
    name: "Jos\xEDas Lachapelle",
    email: "josias@devjosstudio.com",
    phone: "+1 829-555-0100",
    role: "Administrador",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    active: true,
    skills: ["Fullstack Dev", "Fotograf\xEDa", "Direcci\xF3n Creativa", "Estrategia"],
    bio: "Fundador y Director Ejecutivo en DevJos Studio.",
    lastLogin: "2026-08-26 10:30"
  },
  {
    id: "team-2",
    name: "Carlos Mendoza",
    email: "carlos.dev@devjosstudio.com",
    phone: "+1 829-555-0102",
    role: "Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    active: true,
    skills: ["React", "Node.js", "PostgreSQL", "APIs"],
    bio: "Senior Frontend & Backend Engineer.",
    lastLogin: "2026-08-26 09:15"
  },
  {
    id: "team-3",
    name: "Valeria Rivas",
    email: "valeria.design@devjosstudio.com",
    phone: "+1 829-555-0103",
    role: "Dise\xF1ador",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    active: true,
    skills: ["Branding", "UI/UX", "Figma", "Identidad Visual"],
    bio: "Lead Brand & Visual Designer.",
    lastLogin: "2026-08-25 18:40"
  },
  {
    id: "team-4",
    name: "David Ortiz",
    email: "david.photo@devjosstudio.com",
    phone: "+1 829-555-0104",
    role: "Fot\xF3grafo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    active: true,
    skills: ["Lightroom", "Fotograf\xEDa Corporativa", "Retratos", "Color Grading"],
    bio: "Especialista en fotograf\xEDa de producto y retratos corporativos.",
    lastLogin: "2026-08-26 08:20"
  },
  {
    id: "team-5",
    name: "Andrea Morales",
    email: "andrea.media@devjosstudio.com",
    phone: "+1 829-555-0105",
    role: "Vide\xF3grafo",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    active: true,
    skills: ["Premiere Pro", "After Effects", "Reels", "Producci\xF3n"],
    bio: "Productora audiovisual y editora de formatos verticales y comerciales.",
    lastLogin: "2026-08-25 16:50"
  },
  {
    id: "team-6",
    name: "Marcos Peralta",
    email: "marcos.finanzas@devjosstudio.com",
    phone: "+1 829-555-0106",
    role: "Finanzas",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    active: true,
    skills: ["Contabilidad", "Facturaci\xF3n", "Presupuestos", "Flujo de Caja"],
    bio: "Administrador Financiero & Auditor\xEDa de Cobros.",
    lastLogin: "2026-08-26 08:00"
  },
  {
    id: "team-7",
    name: "Camila Pe\xF1a",
    email: "camila.social@devjosstudio.com",
    phone: "+1 829-555-0107",
    role: "Contenido",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    active: true,
    skills: ["Copywriting", "Estrategia Social", "TikTok", "Instagram"],
    bio: "Community Manager & Creadora de Contenido Estrat\xE9gico.",
    lastLogin: "2026-08-26 09:45"
  }
];
var initialServices = [
  // Desarrollo
  {
    id: "srv-1",
    name: "Landing Page de Alta Conversi\xF3n",
    category: "Desarrollo",
    description: "P\xE1gina de aterrizaje optimizada para captaci\xF3n de leads, r\xE1pida y responsive con SEO base.",
    basePrice: 650,
    minPrice: 500,
    status: "Activo",
    unit: "proyecto"
  },
  {
    id: "srv-2",
    name: "Sitio Web Corporativo Completo",
    category: "Desarrollo",
    description: "Hasta 6 secciones din\xE1micas, blog, formularios de contacto, animaciones e integraci\xF3n de Analytics.",
    basePrice: 1400,
    minPrice: 1100,
    status: "Activo",
    unit: "proyecto"
  },
  {
    id: "srv-3",
    name: "Tienda Online / E-Commerce",
    category: "Desarrollo",
    description: "Cat\xE1logo de productos, pasarela de pagos integrada, gesti\xF3n de inventario y panel de control.",
    basePrice: 2200,
    minPrice: 1800,
    status: "Activo",
    unit: "proyecto"
  },
  {
    id: "srv-4",
    name: "Sistema Web a Medida / SaaS",
    category: "Desarrollo",
    description: "Desarrollo de plataforma web personalizada con base de datos, roles y paneles administrativos.",
    basePrice: 3500,
    minPrice: 2800,
    status: "Activo",
    unit: "proyecto"
  },
  {
    id: "srv-5",
    name: "Mantenimiento y Soporte Web Mensual",
    category: "Desarrollo",
    description: "Copias de seguridad, actualizaciones de seguridad, optimizaci\xF3n de velocidad y ajustes de contenido.",
    basePrice: 250,
    minPrice: 180,
    status: "Activo",
    unit: "mes"
  },
  // Diseño & Branding
  {
    id: "srv-6",
    name: "Identidad Visual & Branding Completo",
    category: "Branding",
    description: "Logo principal y variantes, paleta de color, tipograf\xEDas, manual de marca y aplicaciones.",
    basePrice: 850,
    minPrice: 650,
    status: "Activo",
    unit: "marca"
  },
  {
    id: "srv-7",
    name: "Pack de Dise\xF1os para Redes Sociales (12 piezas)",
    category: "Dise\xF1o",
    description: "12 posts/carruseles adaptados a la l\xEDnea gr\xE1fica de la marca en alta resoluci\xF3n.",
    basePrice: 380,
    minPrice: 300,
    status: "Activo",
    unit: "pack"
  },
  {
    id: "srv-8",
    name: "Dise\xF1o de Men\xFA / Cat\xE1logo Digital",
    category: "Dise\xF1o",
    description: "Dise\xF1o editorial digital interactivo o imprimible con est\xE9tica premium.",
    basePrice: 320,
    minPrice: 240,
    status: "Activo",
    unit: "proyecto"
  },
  // Fotografía
  {
    id: "srv-9",
    name: "Sesi\xF3n de Retratos Profesionales / Personal Branding",
    category: "Fotograf\xEDa",
    description: "Sesi\xF3n de 2 horas en estudio o locaci\xF3n, 15 fotos editadas en alta resoluci\xF3n.",
    basePrice: 350,
    minPrice: 280,
    status: "Activo",
    unit: "sesi\xF3n"
  },
  {
    id: "srv-10",
    name: "Fotograf\xEDa Corporativa de Equipo e Instalaciones",
    category: "Fotograf\xEDa",
    description: "Cobertura de equipo de trabajo, instalaciones y fotos de ambiente (hasta 35 fotos editadas).",
    basePrice: 600,
    minPrice: 480,
    status: "Activo",
    unit: "sesi\xF3n"
  },
  {
    id: "srv-11",
    name: "Fotograf\xEDa de Producto E-commerce / Gastronom\xEDa",
    category: "Fotograf\xEDa",
    description: "Fondo neutro o estilismo de producto, iluminaci\xF3n profesional y retoque fino.",
    basePrice: 450,
    minPrice: 350,
    status: "Activo",
    unit: "sesi\xF3n"
  },
  // Multimedia
  {
    id: "srv-12",
    name: "Pack de Reels / Videos Verticales (4 videos)",
    category: "Multimedia",
    description: "Grabaci\xF3n, gui\xF3n base, edici\xF3n din\xE1mica con subt\xEDtulos animados y m\xFAsica en tendencia.",
    basePrice: 500,
    minPrice: 400,
    status: "Activo",
    unit: "pack"
  },
  {
    id: "srv-13",
    name: "Video Promocional Corporativo / Comercial (60-90s)",
    category: "Multimedia",
    description: "Producci\xF3n audiovisual completa, tomas 4K, locuci\xF3n profesional, color grading y motion graphics.",
    basePrice: 1200,
    minPrice: 950,
    status: "Activo",
    unit: "video"
  }
];
var initialClients = [
  {
    id: "cli-1",
    name: "Ing. Marcos Valenzuela",
    company: "Solaria Energy Tech",
    phone: "+1 (809) 555-0121",
    whatsapp: "+18095550121",
    email: "marcos@solariaenergy.com",
    address: "Torre Empresarial Sigma, Nivel 8, Sto Dgo",
    instagram: "@solariaenergy",
    facebook: "SolariaEnergyOfficial",
    website: "https://solariaenergy.com",
    registeredDate: "2026-01-15",
    status: "Cliente",
    notes: "Cliente corporativo de paneles solares. Valora la puntualidad y el soporte continuo.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "cli-2",
    name: "Dra. Sof\xEDa Almonte",
    company: "Cl\xEDnica Dental Est\xE9tica Almonte",
    phone: "+1 (829) 555-0344",
    whatsapp: "+18295550344",
    email: "contacto@dentalalmonte.com",
    address: "Av. Winston Churchill #45, Plaza M\xE9dica",
    instagram: "@dental.almonte",
    facebook: "DentalAlmonteRD",
    website: "https://dentalalmonte.com",
    registeredDate: "2026-02-02",
    status: "Cliente",
    notes: "Enfoque en fotograf\xEDa de antes/despu\xE9s y sitio web con agenda de citas.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "cli-3",
    name: "Chef Alejandro Pe\xF1a",
    company: "Restaurante Fuego Santo",
    phone: "+1 (849) 555-0789",
    whatsapp: "+18495550789",
    email: "gerencia@fuegosanto.do",
    address: "Zona Colonial, Calle Las Damas #12",
    instagram: "@fuegosantord",
    facebook: "FuegoSantoRestaurante",
    website: "https://fuegosanto.do",
    registeredDate: "2026-03-10",
    status: "Cliente",
    notes: "Requiere fotograf\xEDa gastron\xF3mica peri\xF3dica, reels de platillos y men\xFA digital.",
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "cli-4",
    name: "Lic. Patricia Guzm\xE1n",
    company: "Guzm\xE1n & Asociados Legal",
    phone: "+1 (809) 555-0912",
    whatsapp: "+18095550912",
    email: "pguzman@guzmanlegal.com",
    address: "Bella Vista Mall Piso 4, Oficina 402",
    instagram: "@guzmanlegalrd",
    facebook: "GuzmanAsociadosLegal",
    website: "https://guzmanlegal.com",
    registeredDate: "2026-04-05",
    status: "Prospecto",
    notes: "Cotizaci\xF3n enviada para rebranding corporativo y sitio web institucional.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "cli-5",
    name: "H\xE9ctor Rosario",
    company: "UrbanFit Gym & Apparel",
    phone: "+1 (829) 555-0450",
    whatsapp: "+18295550450",
    email: "hector@urbanfit.com.do",
    address: "Av. Sarasota #89, Los Cacicazgos",
    instagram: "@urbanfitrd",
    facebook: "UrbanFitGymRD",
    website: "https://urbanfit.do",
    registeredDate: "2026-05-18",
    status: "Contactado",
    notes: "Interesado en producci\xF3n de 8 reels de entrenamiento y tienda en l\xEDnea de suplementos.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  }
];
var initialProjects = [
  {
    id: "proj-1",
    name: "Portal Web & Calculadora Solar",
    clientId: "cli-1",
    category: "Desarrollo",
    description: "Desarrollo de plataforma web interactiva con cotizador autom\xE1tico de consumo energ\xE9tico para Solaria Energy.",
    price: 2600,
    startDate: "2026-07-01",
    deliveryDate: "2026-09-10",
    status: "En progreso",
    priority: "Alta",
    progress: 70,
    responsibleId: "team-2",
    notes: "Fase de integraci\xF3n de la calculadora en desarrollo. Pr\xF3xima entrega de versi\xF3n beta el 30 de agosto.",
    paidAmount: 1800
  },
  {
    id: "proj-2",
    name: "Sitio Web & Fotograf\xEDa Dental",
    clientId: "cli-2",
    category: "Desarrollo",
    description: "Renovaci\xF3n de portal web con sistema de reservas y sesi\xF3n fotogr\xE1fica corporativa del consultorio dental.",
    price: 1850,
    startDate: "2026-07-15",
    deliveryDate: "2026-08-30",
    status: "En revisi\xF3n",
    priority: "Urgente",
    progress: 90,
    responsibleId: "team-1",
    notes: "Fotograf\xEDas integradas. Esperando visto bueno final de la Dra. Sof\xEDa para lanzamiento oficial.",
    paidAmount: 1400
  },
  {
    id: "proj-3",
    name: "Fotograf\xEDa Gastron\xF3mica & Men\xFA QR",
    clientId: "cli-3",
    category: "Fotograf\xEDa",
    description: "Sesi\xF3n de 25 platillos gourmet, dise\xF1o de men\xFA interactivo QR y 4 reels promocionales para Fuego Santo.",
    price: 1250,
    startDate: "2026-08-01",
    deliveryDate: "2026-09-05",
    status: "En progreso",
    priority: "Media",
    progress: 45,
    responsibleId: "team-4",
    notes: "Sesi\xF3n fotogr\xE1fica completada. En proceso de retoque y dise\xF1o del men\xFA digital.",
    paidAmount: 650
  },
  {
    id: "proj-4",
    name: "Identidad Visual & Rebranding Legal",
    clientId: "cli-4",
    category: "Branding",
    description: "Dise\xF1o de logotipo, papeler\xEDa institucional, templates de presentaci\xF3n y manual de marca para Guzm\xE1n Legal.",
    price: 950,
    startDate: "2026-08-10",
    deliveryDate: "2026-09-20",
    status: "Cotizaci\xF3n",
    priority: "Media",
    progress: 15,
    responsibleId: "team-3",
    notes: "Propuesta enviada. Pendiente de firma de contrato y pago de anticipo.",
    paidAmount: 0
  },
  {
    id: "proj-5",
    name: "Campa\xF1a Multimedia Lanzamiento Gym",
    clientId: "cli-5",
    category: "Multimedia",
    description: "Producci\xF3n de 6 reels din\xE1micos de entrenamiento, tomas con drone y fotograf\xEDa de atletas.",
    price: 1400,
    startDate: "2026-08-15",
    deliveryDate: "2026-09-28",
    status: "Aprobado",
    priority: "Alta",
    progress: 25,
    responsibleId: "team-5",
    notes: "Guiones aprobados. Grabaci\xF3n programada para el pr\xF3ximo s\xE1bado.",
    paidAmount: 700
  },
  {
    id: "proj-6",
    name: "E-Commerce Cat\xE1logo Joyer\xEDa Maya",
    clientId: "cli-1",
    category: "Desarrollo",
    description: "Tienda en l\xEDnea desarrollada en Next.js con pasarela Stripe y dise\xF1o minimalista para marca asociada.",
    price: 2100,
    startDate: "2026-05-10",
    deliveryDate: "2026-06-25",
    status: "Completado",
    priority: "Baja",
    progress: 100,
    responsibleId: "team-2",
    notes: "Proyecto entregado y funcionando al 100%. Pagado en su totalidad.",
    paidAmount: 2100
  }
];
var initialTasks = [
  {
    id: "task-1",
    name: "Integrar API de cotizaciones en tiempo real",
    description: "Conectar el formulario de c\xE1lculo con el motor de f\xF3rmulas solares de Solaria.",
    projectId: "proj-1",
    responsibleId: "team-2",
    priority: "Alta",
    dueDate: "2026-08-28",
    status: "En progreso"
  },
  {
    id: "task-2",
    name: "Optimizar im\xE1genes web en formato WebP",
    description: "Comprimir todas las fotograf\xEDas de alta resoluci\xF3n para maximizar score PageSpeed.",
    projectId: "proj-2",
    responsibleId: "team-1",
    priority: "Media",
    dueDate: "2026-08-29",
    status: "Completada"
  },
  {
    id: "task-3",
    name: "Color grading de fotograf\xEDas de platillos",
    description: "Ajustar contraste c\xE1lido y balance de blancos en las 25 fotos de Fuego Santo.",
    projectId: "proj-3",
    responsibleId: "team-4",
    priority: "Alta",
    dueDate: "2026-08-31",
    status: "En progreso"
  },
  {
    id: "task-4",
    name: "Preparar 3 propuestas conceptuales de logo",
    description: "Generar conceptos tipogr\xE1ficos y monogramas para Guzm\xE1n & Asociados.",
    projectId: "proj-4",
    responsibleId: "team-3",
    priority: "Media",
    dueDate: "2026-09-02",
    status: "Pendiente"
  },
  {
    id: "task-5",
    name: "Storyboards y gui\xF3n t\xE9cnico de los 6 reels",
    description: "Definir secuencias de tomas, textos en pantalla y audio de UrbanFit.",
    projectId: "proj-5",
    responsibleId: "team-5",
    priority: "Urgente",
    dueDate: "2026-08-27",
    status: "En revisi\xF3n"
  },
  {
    id: "task-6",
    name: "Revisi\xF3n de responsividad m\xF3vil en Safari iOS",
    description: "Probar el flujo del men\xFA desplegable y formulario en dispositivos iPhone.",
    projectId: "proj-1",
    responsibleId: "team-2",
    priority: "Media",
    dueDate: "2026-09-03",
    status: "Pendiente"
  },
  {
    id: "task-7",
    name: "Configuraci\xF3n de certificado SSL y dominio final",
    description: "Apuntar DNS hacia servidor de producci\xF3n y verificar candado de seguridad.",
    projectId: "proj-2",
    responsibleId: "team-1",
    priority: "Alta",
    dueDate: "2026-08-30",
    status: "Pendiente"
  }
];
var initialQuotes = [
  {
    id: "qt-101",
    quoteNumber: "DEVJOS-COT-2026-042",
    clientId: "cli-1",
    issueDate: "2026-06-25",
    expiryDate: "2026-07-25",
    status: "Aceptada",
    items: [
      {
        id: "item-1",
        serviceId: "srv-4",
        description: "Desarrollo de Portal Web & Calculadora de Ahorro Solar a Medida",
        quantity: 1,
        unitPrice: 2400,
        discount: 0,
        total: 2400
      },
      {
        id: "item-2",
        serviceId: "srv-1",
        description: "M\xF3dulo de Captaci\xF3n de Leads y Notificaciones WhatsApp Autom\xE1ticas",
        quantity: 1,
        unitPrice: 200,
        discount: 0,
        total: 200
      }
    ],
    subtotal: 2600,
    discountTotal: 0,
    taxRate: 18,
    taxAmount: 468,
    total: 3068,
    notes: "Forma de pago: 50% anticipo al iniciar, 25% entrega beta, 25% lanzamiento final.",
    terms: "Garant\xEDa t\xE9cnica de 60 d\xEDas tras el lanzamiento. No incluye costos de hosting del cliente.",
    associatedProjectId: "proj-1"
  },
  {
    id: "qt-102",
    quoteNumber: "DEVJOS-COT-2026-043",
    clientId: "cli-2",
    issueDate: "2026-07-10",
    expiryDate: "2026-08-10",
    status: "Aceptada",
    items: [
      {
        id: "item-3",
        serviceId: "srv-2",
        description: "Sitio Web Corporativo Cl\xEDnica Dental con Sistema de Citas Online",
        quantity: 1,
        unitPrice: 1350,
        discount: 0,
        total: 1350
      },
      {
        id: "item-4",
        serviceId: "srv-10",
        description: "Sesi\xF3n de Fotograf\xEDa Corporativa de Instalaciones y Equipo M\xE9dico",
        quantity: 1,
        unitPrice: 500,
        discount: 0,
        total: 500
      }
    ],
    subtotal: 1850,
    discountTotal: 0,
    taxRate: 18,
    taxAmount: 333,
    total: 2183,
    notes: "Entrega en 30 d\xEDas h\xE1biles. Incluye capacitaci\xF3n para el personal de recepci\xF3n.",
    terms: "Los cambios mayores en la estructura tras aprobaci\xF3n de prototipo tienen costo adicional.",
    associatedProjectId: "proj-2"
  },
  {
    id: "qt-103",
    quoteNumber: "DEVJOS-COT-2026-044",
    clientId: "cli-3",
    issueDate: "2026-07-28",
    expiryDate: "2026-08-28",
    status: "Aceptada",
    items: [
      {
        id: "item-5",
        serviceId: "srv-11",
        description: "Fotograf\xEDa Gastron\xF3mica de 25 Platillos Gourmet con Estilismo",
        quantity: 1,
        unitPrice: 550,
        discount: 50,
        total: 500
      },
      {
        id: "item-6",
        serviceId: "srv-8",
        description: "Dise\xF1o de Men\xFA Interactivo Digital con C\xF3digo QR Din\xE1mico",
        quantity: 1,
        unitPrice: 350,
        discount: 0,
        total: 350
      },
      {
        id: "item-7",
        serviceId: "srv-12",
        description: "Pack de 4 Reels de Platillos Estrella para Instagram y TikTok",
        quantity: 1,
        unitPrice: 400,
        discount: 0,
        total: 400
      }
    ],
    subtotal: 1300,
    discountTotal: 50,
    taxRate: 18,
    taxAmount: 225,
    total: 1475,
    notes: "Sesi\xF3n presencial en Zona Colonial. La comida para fotos corre por cuenta del restaurante.",
    terms: "Derechos de uso comercial completos en medios digitales y f\xEDsicos.",
    associatedProjectId: "proj-3"
  },
  {
    id: "qt-104",
    quoteNumber: "DEVJOS-COT-2026-045",
    clientId: "cli-4",
    issueDate: "2026-08-08",
    expiryDate: "2026-09-08",
    status: "Enviada",
    items: [
      {
        id: "item-8",
        serviceId: "srv-6",
        description: "Identidad Visual & Branding Corporativo para Firma Legal Guzm\xE1n & Asoc.",
        quantity: 1,
        unitPrice: 850,
        discount: 0,
        total: 850
      },
      {
        id: "item-9",
        serviceId: "srv-7",
        description: "Plantillas Institucionales para Presentaciones y Tarjetas Digitales",
        quantity: 1,
        unitPrice: 100,
        discount: 0,
        total: 100
      }
    ],
    subtotal: 950,
    discountTotal: 0,
    taxRate: 18,
    taxAmount: 171,
    total: 1121,
    notes: "Validez de 30 d\xEDas. Incluye 3 rondas de revisiones sobre el concepto seleccionado.",
    terms: "Entrega de archivos vectoriales editables AI, SVG, PDF y PNG transparente.",
    associatedProjectId: "proj-4"
  },
  {
    id: "qt-105",
    quoteNumber: "DEVJOS-COT-2026-046",
    clientId: "cli-5",
    issueDate: "2026-08-12",
    expiryDate: "2026-09-12",
    status: "Aceptada",
    items: [
      {
        id: "item-10",
        serviceId: "srv-12",
        description: "Producci\xF3n Audiovisual de 6 Reels de Alta Intensidad y Fitness",
        quantity: 1,
        unitPrice: 750,
        discount: 50,
        total: 700
      },
      {
        id: "item-11",
        serviceId: "srv-9",
        description: "Sesi\xF3n de Retratos y Fotograf\xEDas de Atletas en Gimnasio",
        quantity: 1,
        unitPrice: 400,
        discount: 0,
        total: 400
      },
      {
        id: "item-12",
        serviceId: "srv-13",
        description: "Video Teaser de Apertura 30s en Formato Cine 4K",
        quantity: 1,
        unitPrice: 300,
        discount: 0,
        total: 300
      }
    ],
    subtotal: 1450,
    discountTotal: 50,
    taxRate: 18,
    taxAmount: 252,
    total: 1652,
    notes: "Grabaci\xF3n a 2 c\xE1maras + iluminaci\xF3n RGB en instalaciones de UrbanFit.",
    terms: "50% anticipo recibido el 15 de agosto. Saldo contra entrega de piezas finales.",
    associatedProjectId: "proj-5"
  }
];
var initialIncomes = [
  {
    id: "inc-1",
    clientId: "cli-1",
    projectId: "proj-1",
    amount: 1300,
    date: "2026-07-02",
    method: "Transferencia",
    description: "Anticipo 50% Proyecto Portal Web & Calculadora Solar",
    invoiceNumber: "FAC-2026-081"
  },
  {
    id: "inc-2",
    clientId: "cli-1",
    projectId: "proj-1",
    amount: 500,
    date: "2026-08-05",
    method: "Transferencia",
    description: "Segundo pago por entrega de avance de frontend",
    invoiceNumber: "FAC-2026-089"
  },
  {
    id: "inc-3",
    clientId: "cli-2",
    projectId: "proj-2",
    amount: 1e3,
    date: "2026-07-16",
    method: "Transferencia",
    description: "Anticipo inicial dise\xF1o web y sesi\xF3n dental",
    invoiceNumber: "FAC-2026-084"
  },
  {
    id: "inc-4",
    clientId: "cli-2",
    projectId: "proj-2",
    amount: 400,
    date: "2026-08-10",
    method: "Tarjeta",
    description: "Abono por entrega de fotograf\xEDas seleccionadas",
    invoiceNumber: "FAC-2026-092"
  },
  {
    id: "inc-5",
    clientId: "cli-3",
    projectId: "proj-3",
    amount: 650,
    date: "2026-08-02",
    method: "Efectivo",
    description: "Anticipo 50% men\xFA digital y sesi\xF3n gastron\xF3mica",
    invoiceNumber: "FAC-2026-088"
  },
  {
    id: "inc-6",
    clientId: "cli-5",
    projectId: "proj-5",
    amount: 700,
    date: "2026-08-15",
    method: "Transferencia",
    description: "Anticipo 50% Campa\xF1a Audiovisual UrbanFit",
    invoiceNumber: "FAC-2026-095"
  },
  {
    id: "inc-7",
    clientId: "cli-1",
    projectId: "proj-6",
    amount: 2100,
    date: "2026-06-25",
    method: "Stripe",
    description: "Liquidaci\xF3n total E-Commerce Joyer\xEDa Maya",
    invoiceNumber: "FAC-2026-077"
  }
];
var initialExpenses = [
  {
    id: "exp-1",
    category: "Software",
    description: "Suscripci\xF3n Adobe Creative Cloud (Fotograf\xEDa + Video + Dise\xF1o)",
    amount: 85,
    date: "2026-08-01",
    method: "Tarjeta"
  },
  {
    id: "exp-2",
    category: "Software",
    description: "Servidor VPS Cloud Run y Hosting Base de Datos",
    amount: 45,
    date: "2026-08-03",
    method: "Tarjeta"
  },
  {
    id: "exp-3",
    category: "Equipos",
    description: "Luz LED port\xE1til Nanlite y Difusor para sesiones fotogr\xE1ficas",
    amount: 190,
    date: "2026-08-07",
    method: "Transferencia"
  },
  {
    id: "exp-4",
    category: "Transporte",
    description: "Combustible y peajes cobertura en locaci\xF3n Zona Colonial y Sarasota",
    amount: 60,
    date: "2026-08-11",
    method: "Efectivo"
  },
  {
    id: "exp-5",
    category: "Internet",
    description: "Fibra \xD3ptica Sim\xE9trica Alta Velocidad para Estudio",
    amount: 75,
    date: "2026-08-15",
    method: "Transferencia"
  },
  {
    id: "exp-6",
    category: "Publicidad",
    description: "Campa\xF1a Meta Ads para captaci\xF3n de clientes de desarrollo web",
    amount: 150,
    date: "2026-08-18",
    method: "Tarjeta"
  }
];
var initialPayments = [
  {
    id: "pay-1",
    projectId: "proj-1",
    clientId: "cli-1",
    totalContract: 2600,
    advancePayment: 1300,
    secondPayment: 500,
    additionalPayments: [],
    totalPaid: 1800,
    totalPending: 800,
    status: "Parcial",
    lastPaymentDate: "2026-08-05"
  },
  {
    id: "pay-2",
    projectId: "proj-2",
    clientId: "cli-2",
    totalContract: 1850,
    advancePayment: 1e3,
    secondPayment: 400,
    additionalPayments: [],
    totalPaid: 1400,
    totalPending: 450,
    status: "Parcial",
    lastPaymentDate: "2026-08-10"
  },
  {
    id: "pay-3",
    projectId: "proj-3",
    clientId: "cli-3",
    totalContract: 1250,
    advancePayment: 650,
    secondPayment: 0,
    additionalPayments: [],
    totalPaid: 650,
    totalPending: 600,
    status: "Parcial",
    lastPaymentDate: "2026-08-02"
  },
  {
    id: "pay-4",
    projectId: "proj-4",
    clientId: "cli-4",
    totalContract: 950,
    advancePayment: 0,
    secondPayment: 0,
    additionalPayments: [],
    totalPaid: 0,
    totalPending: 950,
    status: "Pendiente"
  },
  {
    id: "pay-5",
    projectId: "proj-5",
    clientId: "cli-5",
    totalContract: 1400,
    advancePayment: 700,
    secondPayment: 0,
    additionalPayments: [],
    totalPaid: 700,
    totalPending: 700,
    status: "Parcial",
    lastPaymentDate: "2026-08-15"
  },
  {
    id: "pay-6",
    projectId: "proj-6",
    clientId: "cli-1",
    totalContract: 2100,
    advancePayment: 1050,
    secondPayment: 1050,
    additionalPayments: [],
    totalPaid: 2100,
    totalPending: 0,
    status: "Pagado",
    lastPaymentDate: "2026-06-25"
  }
];
var initialPhotoSessions = [
  {
    id: "ses-1",
    clientId: "cli-2",
    projectId: "proj-2",
    title: "Sesi\xF3n Corporativa Cl\xEDnica Dental Almonte",
    date: "2026-08-12",
    time: "10:00 AM",
    location: "Av. Winston Churchill #45, Consultorio 301",
    sessionType: "Fotograf\xEDa corporativa",
    photosTaken: 180,
    photosSelected: 35,
    photosEdited: 35,
    photosDelivered: 35,
    status: "Completada",
    notes: "Fotos con bata cl\xEDnica y tomas de procedimientos est\xE9ticos. Muy buena iluminaci\xF3n natural."
  },
  {
    id: "ses-2",
    clientId: "cli-3",
    projectId: "proj-3",
    title: "Fotograf\xEDa Gastron\xF3mica Men\xFA de Verano",
    date: "2026-08-20",
    time: "03:30 PM",
    location: "Restaurante Fuego Santo, Terraza Principal",
    sessionType: "Productos",
    photosTaken: 220,
    photosSelected: 25,
    photosEdited: 18,
    photosDelivered: 0,
    status: "Edici\xF3n",
    notes: "Falta retocar los platillos de corte a la parrilla y c\xF3cteles de autor."
  },
  {
    id: "ses-3",
    clientId: "cli-5",
    projectId: "proj-5",
    title: "Sesi\xF3n de Retratos & Acci\xF3n UrbanFit",
    date: "2026-08-29",
    time: "08:00 AM",
    location: "UrbanFit Gym & Zona Outdoor",
    sessionType: "Retratos",
    photosTaken: 0,
    photosSelected: 0,
    photosEdited: 0,
    photosDelivered: 0,
    status: "Programada",
    notes: "Llevar lentes 24-70mm f2.8 y 70-200mm para tomas de acci\xF3n din\xE1mica."
  }
];
var initialGalleries = [
  {
    id: "gal-1",
    title: "Galer\xEDa Corporativa Dental Almonte",
    clientId: "cli-2",
    sessionId: "ses-1",
    projectId: "proj-2",
    coverImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-08-13",
    clientShared: true,
    shareToken: "devjos-gal-almonte-982",
    description: "Fotograf\xEDas seleccionadas para el sitio web y perfiles de LinkedIn.",
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
        title: "Equipo Dental en Consultorio",
        selected: true,
        edited: true,
        tags: ["Equipo", "Instalaciones"]
      },
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
        title: "Retrato Dra. Sof\xEDa Almonte",
        selected: true,
        edited: true,
        tags: ["Retrato", "Doctora"]
      },
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80",
        title: "Instrumentos y Tecnolog\xEDa Odontol\xF3gica",
        selected: true,
        edited: true,
        tags: ["Detalle", "Tecnolog\xEDa"]
      }
    ]
  },
  {
    id: "gal-2",
    title: "Platillos de Autor Fuego Santo",
    clientId: "cli-3",
    sessionId: "ses-2",
    projectId: "proj-3",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-08-21",
    clientShared: true,
    shareToken: "devjos-gal-fuegosanto-331",
    description: "Cat\xE1logo de im\xE1genes gourmet en alta resoluci\xF3n para el men\xFA QR.",
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        title: "Corte Ribeye a la Brasa",
        selected: true,
        edited: true,
        tags: ["Carnes", "Parrilla"]
      },
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
        title: "Tacos Gourmet de Pica\xF1a",
        selected: true,
        edited: true,
        tags: ["Entrada", "Especial"]
      },
      {
        id: "img-6",
        url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
        title: "C\xF3ctel Tropical Ahumado",
        selected: false,
        edited: false,
        tags: ["Bebidas", "Mixolog\xEDa"]
      }
    ]
  }
];
var initialMediaProjects = [
  {
    id: "med-1",
    title: "Pack de 6 Reels de Motivaci\xF3n & Fitness",
    clientId: "cli-5",
    projectId: "proj-5",
    format: "Reel / Vertical (9:16)",
    duration: "30s c/u",
    script: 'Gancho inicial en los primeros 2 segundos: "\xBFEst\xE1s cometiendo este error al entrenar piernas?". Transici\xF3n r\xE1pida con m\xFAsica hype y llamado a la acci\xF3n final.',
    status: "Edici\xF3n",
    currentVersion: "V2",
    notes: "Revisi\xF3n V1 lista con color y m\xFAsica. Falta afinar subt\xEDtulos din\xE1micos estilo Hormozi.",
    versions: [
      {
        version: "V1",
        fileUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        createdAt: "2026-08-18",
        notes: "Corte inicial de tomas sincronizadas al beat.",
        status: "Borrador"
      },
      {
        version: "V2",
        fileUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        createdAt: "2026-08-22",
        notes: "Color grading aplicado y efectos de sonido de impacto agregados.",
        status: "En revisi\xF3n"
      }
    ]
  },
  {
    id: "med-2",
    title: "Video Comercial Institucional Solaria Energy",
    clientId: "cli-1",
    projectId: "proj-1",
    format: "Video Promocional (16:9)",
    duration: "60s",
    script: "Tomas a\xE9reas con drone de parques solares. Locuci\xF3n corporativa resaltando ahorro de hasta 85% en factura el\xE9ctrica.",
    status: "Aprobado",
    currentVersion: "Final",
    notes: "Aprobado por el Ing. Marcos Valenzuela. Listo para incrustar en cabecera del sitio web.",
    versions: [
      {
        version: "V1",
        fileUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        createdAt: "2026-07-20",
        notes: "Primer ensamble con locuci\xF3n maqueta.",
        status: "Borrador"
      },
      {
        version: "Final",
        fileUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        createdAt: "2026-08-01",
        notes: "Master exportado en 4K ProRes y H.264 web.",
        status: "Aprobado"
      }
    ]
  }
];
var initialFiles = [
  {
    id: "file-1",
    clientId: "cli-1",
    projectId: "proj-1",
    folder: "Cotizaci\xF3n",
    name: "Cotizacion-DEVJOS-042-Solaria.pdf",
    size: "1.2 MB",
    type: "PDF",
    uploadDate: "2026-06-25",
    url: "#",
    nasSynced: true
  },
  {
    id: "file-2",
    clientId: "cli-1",
    projectId: "proj-1",
    folder: "Contrato",
    name: "Contrato-Servicios-Software-Firmado.pdf",
    size: "2.8 MB",
    type: "PDF",
    uploadDate: "2026-07-01",
    url: "#",
    nasSynced: true
  },
  {
    id: "file-3",
    clientId: "cli-1",
    projectId: "proj-1",
    folder: "Dise\xF1os",
    name: "Wireframes-Figma-Arquitectura-UI.fig",
    size: "14.5 MB",
    type: "Figma / Asset",
    uploadDate: "2026-07-08",
    url: "#",
    nasSynced: true
  },
  {
    id: "file-4",
    clientId: "cli-2",
    projectId: "proj-2",
    folder: "Fotograf\xEDas",
    name: "Master-Dental-Almonte-HiRes-35Pack.zip",
    size: "420 MB",
    type: "ZIP",
    uploadDate: "2026-08-14",
    url: "#",
    nasSynced: true
  },
  {
    id: "file-5",
    clientId: "cli-3",
    projectId: "proj-3",
    folder: "Dise\xF1os",
    name: "Menu-Digital-Impresion-FuegoSanto-Curvas.pdf",
    size: "8.4 MB",
    type: "PDF",
    uploadDate: "2026-08-22",
    url: "#",
    nasSynced: true
  }
];
var initialCalendarEvents = [
  {
    id: "evt-1",
    title: "Sesi\xF3n de Fotos y Video en UrbanFit Gym",
    type: "Sesi\xF3n fotogr\xE1fica",
    startDate: "2026-08-29",
    endDate: "2026-08-29",
    time: "08:00 AM - 12:00 PM",
    clientId: "cli-5",
    projectId: "proj-5",
    location: "Av. Sarasota #89, Los Cacicazgos",
    description: "Grabaci\xF3n de los 6 reels y fotograf\xEDa de acci\xF3n. Asisten David y Andrea."
  },
  {
    id: "evt-2",
    title: "Demo y Revisi\xF3n Beta Portal Solaria Energy",
    type: "Reuni\xF3n",
    startDate: "2026-08-30",
    endDate: "2026-08-30",
    time: "04:00 PM",
    clientId: "cli-1",
    projectId: "proj-1",
    location: "Google Meet / Online",
    description: "Presentar c\xE1lculo de paneles en vivo al Ing. Marcos."
  },
  {
    id: "evt-3",
    title: "Lanzamiento Sitio Web Cl\xEDnica Dental Almonte",
    type: "Entrega de proyecto",
    startDate: "2026-08-31",
    endDate: "2026-08-31",
    time: "11:00 AM",
    clientId: "cli-2",
    projectId: "proj-2",
    location: "Oficina DevJos",
    description: "Activaci\xF3n de DNS final y entrega de credenciales a la Dra. Sof\xEDa."
  },
  {
    id: "evt-4",
    title: "Vencimiento Cotizaci\xF3n Guzm\xE1n & Asociados",
    type: "Vencimiento cotizaci\xF3n",
    startDate: "2026-09-08",
    endDate: "2026-09-08",
    time: "06:00 PM",
    clientId: "cli-4",
    projectId: "proj-4",
    description: "Hacer seguimiento telef\xF3nico con la Lic. Patricia si no ha confirmado."
  }
];

// src/db/queries.ts
async function ensureDatabaseSeeded() {
  try {
    const pool2 = createPool();
    if (pool2) {
      await ensurePostgresTablesExist(pool2);
    }
    const existingClients = await db.select().from(clients).limit(1);
    if (existingClients.length === 0) {
      console.log("\u{1F331} Seeding initial DevJos Studio data to Cloud SQL PostgreSQL...");
      await db.insert(studioSettings).values({
        id: "default",
        settingsJson: JSON.stringify(initialSettings)
      }).onConflictDoNothing();
      if (initialClients.length > 0) {
        await db.insert(clients).values(initialClients.map((c) => ({
          id: c.id,
          name: c.name,
          company: c.company || "",
          phone: c.phone || "",
          whatsapp: c.whatsapp || "",
          email: c.email || "",
          address: c.address || "",
          instagram: c.instagram || "",
          facebook: c.facebook || "",
          website: c.website || "",
          registeredDate: c.registeredDate,
          status: c.status,
          notes: c.notes || "",
          avatar: c.avatar || ""
        }))).onConflictDoNothing();
      }
      if (initialProjects.length > 0) {
        await db.insert(projects).values(initialProjects.map((p) => ({
          id: p.id,
          name: p.name,
          clientId: p.clientId,
          category: p.category,
          description: p.description || "",
          price: p.price,
          startDate: p.startDate,
          deliveryDate: p.deliveryDate,
          status: p.status,
          priority: p.priority,
          progress: p.progress,
          responsibleId: p.responsibleId || "",
          notes: p.notes || "",
          paidAmount: p.paidAmount || 0
        }))).onConflictDoNothing();
      }
      if (initialTasks.length > 0) {
        await db.insert(tasks).values(initialTasks.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description || "",
          projectId: t.projectId,
          responsibleId: t.responsibleId || "",
          priority: t.priority,
          dueDate: t.dueDate,
          status: t.status
        }))).onConflictDoNothing();
      }
      if (initialServices.length > 0) {
        await db.insert(services).values(initialServices.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          description: s.description || "",
          basePrice: s.basePrice,
          minPrice: s.minPrice,
          status: s.status,
          unit: s.unit || "Servicio"
        }))).onConflictDoNothing();
      }
      if (initialQuotes.length > 0) {
        await db.insert(quotes).values(initialQuotes.map((q) => ({
          id: q.id,
          quoteNumber: q.quoteNumber,
          clientId: q.clientId,
          issueDate: q.issueDate,
          expiryDate: q.expiryDate,
          status: q.status,
          itemsJson: JSON.stringify(q.items),
          subtotal: q.subtotal,
          discountTotal: q.discountTotal,
          taxRate: q.taxRate,
          taxAmount: q.taxAmount,
          total: q.total,
          notes: q.notes || "",
          terms: q.terms || "",
          associatedProjectId: q.associatedProjectId || ""
        }))).onConflictDoNothing();
      }
      if (initialIncomes.length > 0) {
        await db.insert(incomes).values(initialIncomes.map((i) => ({
          id: i.id,
          clientId: i.clientId,
          projectId: i.projectId || "",
          amount: i.amount,
          date: i.date,
          method: i.method,
          description: i.description || "",
          invoiceNumber: i.invoiceNumber || ""
        }))).onConflictDoNothing();
      }
      if (initialExpenses.length > 0) {
        await db.insert(expenses).values(initialExpenses.map((e) => ({
          id: e.id,
          category: e.category,
          description: e.description || "",
          amount: e.amount,
          date: e.date,
          method: e.method,
          receiptUrl: e.receiptUrl || ""
        }))).onConflictDoNothing();
      }
      if (initialPayments.length > 0) {
        await db.insert(payments).values(initialPayments.map((pay) => ({
          id: pay.id,
          projectId: pay.projectId,
          clientId: pay.clientId,
          totalContract: pay.totalContract,
          advancePayment: pay.advancePayment,
          secondPayment: pay.secondPayment,
          additionalPaymentsJson: JSON.stringify(pay.additionalPayments),
          totalPaid: pay.totalPaid,
          totalPending: pay.totalPending,
          status: pay.status,
          lastPaymentDate: pay.lastPaymentDate || ""
        }))).onConflictDoNothing();
      }
      if (initialPhotoSessions.length > 0) {
        await db.insert(photoSessions).values(initialPhotoSessions.map((ps) => ({
          id: ps.id,
          clientId: ps.clientId,
          projectId: ps.projectId || "",
          title: ps.title,
          date: ps.date,
          time: ps.time,
          location: ps.location || "",
          sessionType: ps.sessionType,
          photosTaken: ps.photosTaken,
          photosSelected: ps.photosSelected,
          photosEdited: ps.photosEdited,
          photosDelivered: ps.photosDelivered,
          status: ps.status,
          notes: ps.notes || ""
        }))).onConflictDoNothing();
      }
      if (initialGalleries.length > 0) {
        await db.insert(galleries).values(initialGalleries.map((g) => ({
          id: g.id,
          title: g.title,
          clientId: g.clientId,
          sessionId: g.sessionId || "",
          projectId: g.projectId || "",
          coverImage: g.coverImage || "",
          imagesJson: JSON.stringify(g.images),
          clientShared: g.clientShared,
          shareToken: g.shareToken,
          description: g.description || "",
          createdAt: g.createdAt
        }))).onConflictDoNothing();
      }
      if (initialMediaProjects.length > 0) {
        await db.insert(mediaProjects).values(initialMediaProjects.map((m) => ({
          id: m.id,
          title: m.title,
          clientId: m.clientId,
          projectId: m.projectId || "",
          format: m.format,
          duration: m.duration || "0:30",
          script: m.script || "",
          versionsJson: JSON.stringify(m.versions),
          currentVersion: m.currentVersion,
          status: m.status,
          notes: m.notes || ""
        }))).onConflictDoNothing();
      }
      if (initialFiles.length > 0) {
        await db.insert(projectFiles).values(initialFiles.map((f) => ({
          id: f.id,
          clientId: f.clientId,
          projectId: f.projectId,
          folder: f.folder,
          name: f.name,
          size: f.size || "0 KB",
          type: f.type || "Archivo",
          uploadDate: f.uploadDate,
          url: f.url,
          nasSynced: f.nasSynced
        }))).onConflictDoNothing();
      }
      if (initialCalendarEvents.length > 0) {
        await db.insert(calendarEvents).values(initialCalendarEvents.map((evt) => ({
          id: evt.id,
          title: evt.title,
          type: evt.type,
          startDate: evt.startDate,
          endDate: evt.endDate,
          time: evt.time || "",
          clientId: evt.clientId || "",
          projectId: evt.projectId || "",
          location: evt.location || "",
          description: evt.description || "",
          isCompleted: evt.isCompleted || false
        }))).onConflictDoNothing();
      }
      if (initialTeam.length > 0) {
        await db.insert(teamMembers).values(initialTeam.map((tm) => ({
          id: tm.id,
          name: tm.name,
          email: tm.email,
          phone: tm.phone || "",
          role: tm.role,
          avatar: tm.avatar || "",
          active: tm.active,
          skillsJson: JSON.stringify(tm.skills),
          bio: tm.bio || ""
        }))).onConflictDoNothing();
      }
      console.log("\u2705 Cloud SQL Database successfully seeded with all initial data.");
    }
  } catch (error) {
    console.error("Warning during database seeding check:", error);
  }
}
async function getAllAppData() {
  try {
    await ensureDatabaseSeeded();
    const [
      settingsRows,
      clientsList,
      projectsList,
      tasksList,
      servicesList,
      quotesList,
      incomesList,
      expensesList,
      paymentsList,
      photoSessionsList,
      galleriesList,
      mediaProjectsList,
      filesList,
      calendarEventsList,
      teamList
    ] = await Promise.all([
      db.select().from(studioSettings).where(eq(studioSettings.id, "default")).catch(() => []),
      db.select().from(clients).catch(() => []),
      db.select().from(projects).catch(() => []),
      db.select().from(tasks).catch(() => []),
      db.select().from(services).catch(() => []),
      db.select().from(quotes).catch(() => []),
      db.select().from(incomes).catch(() => []),
      db.select().from(expenses).catch(() => []),
      db.select().from(payments).catch(() => []),
      db.select().from(photoSessions).catch(() => []),
      db.select().from(galleries).catch(() => []),
      db.select().from(mediaProjects).catch(() => []),
      db.select().from(projectFiles).catch(() => []),
      db.select().from(calendarEvents).catch(() => []),
      db.select().from(teamMembers).catch(() => [])
    ]);
    const settings = settingsRows && settingsRows[0] ? JSON.parse(settingsRows[0].settingsJson) : initialSettings;
    const quotes2 = (quotesList || []).map((q) => ({
      ...q,
      items: JSON.parse(q.itemsJson || "[]")
    }));
    const payments2 = (paymentsList || []).map((p) => ({
      ...p,
      additionalPayments: JSON.parse(p.additionalPaymentsJson || "[]")
    }));
    const galleries2 = (galleriesList || []).map((g) => ({
      ...g,
      images: JSON.parse(g.imagesJson || "[]")
    }));
    const mediaProjects2 = (mediaProjectsList || []).map((m) => ({
      ...m,
      versions: JSON.parse(m.versionsJson || "[]")
    }));
    const team = (teamList || []).map((tm) => ({
      ...tm,
      skills: JSON.parse(tm.skillsJson || "[]")
    }));
    return {
      settings,
      clients: clientsList || [],
      projects: projectsList || [],
      tasks: tasksList || [],
      services: servicesList || [],
      quotes: quotes2,
      incomes: incomesList || [],
      expenses: expensesList || [],
      payments: payments2,
      photoSessions: photoSessionsList || [],
      galleries: galleries2,
      mediaProjects: mediaProjects2,
      files: filesList || [],
      calendarEvents: calendarEventsList || [],
      team
    };
  } catch (error) {
    console.error("Database query failed in getAllAppData:", error);
    return null;
  }
}
async function insertClient(data) {
  try {
    const payload = {
      id: data.id || "cli-" + Date.now(),
      name: data.name || "",
      company: data.company || "",
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      email: data.email || "",
      address: data.address || "",
      instagram: data.instagram || "",
      facebook: data.facebook || "",
      website: data.website || "",
      registeredDate: data.registeredDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: data.status || "Prospecto",
      notes: data.notes || "",
      avatar: data.avatar || ""
    };
    const result = await db.insert(clients).values(payload).onConflictDoUpdate({
      target: clients.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert client:", error);
    throw new Error("Database error inserting client", { cause: error });
  }
}
async function updateClientInDb(id, data) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(clients).set(payload).where(eq(clients.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update client:", error);
    throw new Error("Database error updating client", { cause: error });
  }
}
async function deleteClientFromDb(id) {
  try {
    await db.delete(clients).where(eq(clients.id, id));
  } catch (error) {
    console.error("Failed to delete client:", error);
    throw new Error("Database error deleting client", { cause: error });
  }
}
async function insertProject(data) {
  try {
    const payload = {
      id: data.id || "proj-" + Date.now(),
      name: data.name || "",
      clientId: data.clientId || "",
      category: data.category || "Desarrollo",
      description: data.description || "",
      price: typeof data.price === "number" ? data.price : Number(data.price) || 0,
      startDate: data.startDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      deliveryDate: data.deliveryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: data.status || "Lead",
      priority: data.priority || "Media",
      progress: typeof data.progress === "number" ? data.progress : Number(data.progress) || 0,
      responsibleId: data.responsibleId || "",
      notes: data.notes || "",
      paidAmount: typeof data.paidAmount === "number" ? data.paidAmount : Number(data.paidAmount) || 0
    };
    const result = await db.insert(projects).values(payload).onConflictDoUpdate({
      target: projects.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert project:", error);
    throw new Error("Database error inserting project", { cause: error });
  }
}
async function updateProjectInDb(id, data) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(projects).set(payload).where(eq(projects.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update project:", error);
    throw new Error("Database error updating project", { cause: error });
  }
}
async function deleteProjectFromDb(id) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw new Error("Database error deleting project", { cause: error });
  }
}
async function insertTask(data) {
  try {
    const payload = {
      id: data.id || "task-" + Date.now(),
      name: data.name || "",
      description: data.description || "",
      projectId: data.projectId || "",
      responsibleId: data.responsibleId || "",
      priority: data.priority || "Media",
      dueDate: data.dueDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: data.status || "Pendiente"
    };
    const result = await db.insert(tasks).values(payload).onConflictDoUpdate({
      target: tasks.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert task:", error);
    throw new Error("Database error inserting task", { cause: error });
  }
}
async function updateTaskInDb(id, data) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(tasks).set(payload).where(eq(tasks.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error("Database error updating task", { cause: error });
  }
}
async function deleteTaskFromDb(id) {
  try {
    await db.delete(tasks).where(eq(tasks.id, id));
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error("Database error deleting task", { cause: error });
  }
}
async function insertQuote(data) {
  try {
    const payload = {
      id: data.id || "quo-" + Date.now(),
      quoteNumber: data.quoteNumber || "COT-" + Date.now(),
      clientId: data.clientId || "",
      issueDate: data.issueDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      expiryDate: data.expiryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: data.status || "Borrador",
      itemsJson: typeof data.itemsJson === "string" ? data.itemsJson : JSON.stringify(data.items || []),
      subtotal: typeof data.subtotal === "number" ? data.subtotal : Number(data.subtotal) || 0,
      discountTotal: typeof data.discountTotal === "number" ? data.discountTotal : Number(data.discountTotal) || 0,
      taxRate: typeof data.taxRate === "number" ? data.taxRate : Number(data.taxRate) || 0.18,
      taxAmount: typeof data.taxAmount === "number" ? data.taxAmount : Number(data.taxAmount) || 0,
      total: typeof data.total === "number" ? data.total : Number(data.total) || 0,
      notes: data.notes || "",
      terms: data.terms || "",
      associatedProjectId: data.associatedProjectId || ""
    };
    const result = await db.insert(quotes).values(payload).onConflictDoUpdate({
      target: quotes.id,
      set: payload
    }).returning();
    return {
      ...result[0],
      items: JSON.parse(result[0].itemsJson || "[]")
    };
  } catch (error) {
    console.error("Failed to insert quote:", error);
    throw new Error("Database error inserting quote", { cause: error });
  }
}
async function updateQuoteInDb(id, data) {
  try {
    const payload = { ...data };
    if (data.items) {
      payload.itemsJson = JSON.stringify(data.items);
      delete payload.items;
    }
    delete payload.createdAt;
    const result = await db.update(quotes).set(payload).where(eq(quotes.id, id)).returning();
    return {
      ...result[0],
      items: JSON.parse(result[0].itemsJson || "[]")
    };
  } catch (error) {
    console.error("Failed to update quote:", error);
    throw new Error("Database error updating quote", { cause: error });
  }
}
async function deleteQuoteFromDb(id) {
  try {
    await db.delete(quotes).where(eq(quotes.id, id));
  } catch (error) {
    console.error("Failed to delete quote:", error);
    throw new Error("Database error deleting quote", { cause: error });
  }
}
async function insertIncome(data) {
  try {
    const payload = {
      id: data.id || "inc-" + Date.now(),
      clientId: data.clientId || "",
      projectId: data.projectId || "",
      amount: typeof data.amount === "number" ? data.amount : Number(data.amount) || 0,
      date: data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      method: data.method || "Transferencia",
      description: data.description || "",
      invoiceNumber: data.invoiceNumber || ""
    };
    const result = await db.insert(incomes).values(payload).onConflictDoUpdate({
      target: incomes.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert income:", error);
    throw new Error("Database error inserting income", { cause: error });
  }
}
async function deleteIncomeFromDb(id) {
  try {
    await db.delete(incomes).where(eq(incomes.id, id));
  } catch (error) {
    console.error("Failed to delete income:", error);
    throw new Error("Database error deleting income", { cause: error });
  }
}
async function insertExpense(data) {
  try {
    const payload = {
      id: data.id || "exp-" + Date.now(),
      category: data.category || "Otros",
      description: data.description || "",
      amount: typeof data.amount === "number" ? data.amount : Number(data.amount) || 0,
      date: data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      method: data.method || "Transferencia",
      receiptUrl: data.receiptUrl || ""
    };
    const result = await db.insert(expenses).values(payload).onConflictDoUpdate({
      target: expenses.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert expense:", error);
    throw new Error("Database error inserting expense", { cause: error });
  }
}
async function deleteExpenseFromDb(id) {
  try {
    await db.delete(expenses).where(eq(expenses.id, id));
  } catch (error) {
    console.error("Failed to delete expense:", error);
    throw new Error("Database error deleting expense", { cause: error });
  }
}
async function insertService(data) {
  try {
    const payload = {
      id: data.id || "srv-" + Date.now(),
      name: data.name || "",
      category: data.category || "Desarrollo",
      description: data.description || "",
      basePrice: typeof data.basePrice === "number" ? data.basePrice : Number(data.basePrice) || 0,
      minPrice: typeof data.minPrice === "number" ? data.minPrice : Number(data.minPrice) || 0,
      status: data.status || "Activo",
      unit: data.unit || "Servicio"
    };
    const result = await db.insert(services).values(payload).onConflictDoUpdate({
      target: services.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert service:", error);
    throw new Error("Database error inserting service", { cause: error });
  }
}
async function updateServiceInDb(id, data) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(services).set(payload).where(eq(services.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update service:", error);
    throw new Error("Database error updating service", { cause: error });
  }
}
async function deleteServiceFromDb(id) {
  try {
    await db.delete(services).where(eq(services.id, id));
  } catch (error) {
    console.error("Failed to delete service:", error);
    throw new Error("Database error deleting service", { cause: error });
  }
}
async function insertPayment(data) {
  try {
    const payload = {
      id: data.id || "pay-" + Date.now(),
      projectId: data.projectId || "",
      clientId: data.clientId || "",
      totalContract: typeof data.totalContract === "number" ? data.totalContract : Number(data.totalContract) || 0,
      advancePayment: typeof data.advancePayment === "number" ? data.advancePayment : Number(data.advancePayment) || 0,
      secondPayment: typeof data.secondPayment === "number" ? data.secondPayment : Number(data.secondPayment) || 0,
      additionalPaymentsJson: typeof data.additionalPaymentsJson === "string" ? data.additionalPaymentsJson : JSON.stringify(data.additionalPayments || []),
      totalPaid: typeof data.totalPaid === "number" ? data.totalPaid : Number(data.totalPaid) || 0,
      totalPending: typeof data.totalPending === "number" ? data.totalPending : Number(data.totalPending) || 0,
      status: data.status || "Pendiente",
      lastPaymentDate: data.lastPaymentDate || ""
    };
    const result = await db.insert(payments).values(payload).onConflictDoUpdate({
      target: payments.id,
      set: payload
    }).returning();
    return {
      ...result[0],
      additionalPayments: JSON.parse(result[0].additionalPaymentsJson || "[]")
    };
  } catch (error) {
    console.error("Failed to insert payment:", error);
    throw new Error("Database error inserting payment", { cause: error });
  }
}
async function updatePaymentInDb(id, data) {
  try {
    const payload = { ...data };
    if (data.additionalPayments) {
      payload.additionalPaymentsJson = JSON.stringify(data.additionalPayments);
      delete payload.additionalPayments;
    }
    delete payload.createdAt;
    const result = await db.update(payments).set(payload).where(eq(payments.id, id)).returning();
    return {
      ...result[0],
      additionalPayments: JSON.parse(result[0].additionalPaymentsJson || "[]")
    };
  } catch (error) {
    console.error("Failed to update payment:", error);
    throw new Error("Database error updating payment", { cause: error });
  }
}
async function deletePaymentFromDb(id) {
  try {
    await db.delete(payments).where(eq(payments.id, id));
  } catch (error) {
    console.error("Failed to delete payment:", error);
    throw new Error("Database error deleting payment", { cause: error });
  }
}
async function syncAllAppData(data) {
  try {
    if (data.settings) {
      await updateSettingsInDb(data.settings);
    }
    if (Array.isArray(data.clients) && data.clients.length > 0) {
      for (const client of data.clients) {
        await insertClient(client);
      }
    }
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      for (const project of data.projects) {
        await insertProject(project);
      }
    }
    if (Array.isArray(data.tasks) && data.tasks.length > 0) {
      for (const task of data.tasks) {
        await insertTask(task);
      }
    }
    if (Array.isArray(data.services) && data.services.length > 0) {
      for (const service of data.services) {
        await insertService(service);
      }
    }
    if (Array.isArray(data.quotes) && data.quotes.length > 0) {
      for (const quote of data.quotes) {
        await insertQuote(quote);
      }
    }
    if (Array.isArray(data.payments) && data.payments.length > 0) {
      for (const pay of data.payments) {
        await insertPayment(pay);
      }
    }
    if (Array.isArray(data.incomes) && data.incomes.length > 0) {
      for (const inc of data.incomes) {
        await insertIncome(inc);
      }
    }
    if (Array.isArray(data.expenses) && data.expenses.length > 0) {
      for (const exp of data.expenses) {
        await insertExpense(exp);
      }
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to sync all app data:", error);
    throw new Error("Database sync all failed", { cause: error });
  }
}
async function updateSettingsInDb(settings) {
  try {
    await db.insert(studioSettings).values({
      id: "default",
      settingsJson: JSON.stringify(settings)
    }).onConflictDoUpdate({
      target: studioSettings.id,
      set: {
        settingsJson: JSON.stringify(settings),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
  } catch (error) {
    console.error("Failed to update settings:", error);
    throw new Error("Database error updating settings", { cause: error });
  }
}
async function insertTeamMember(data) {
  try {
    const payload = {
      id: data.id || "team-" + Date.now(),
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      role: data.role || "Developer",
      avatar: data.avatar || "",
      active: data.active !== false,
      skillsJson: JSON.stringify(data.skills || []),
      bio: data.bio || ""
    };
    const result = await db.insert(teamMembers).values(payload).onConflictDoUpdate({
      target: teamMembers.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert team member:", error);
    throw new Error("Database error inserting team member", { cause: error });
  }
}
async function updateTeamMemberInDb(id, updates) {
  try {
    const payload = {};
    if (updates.name !== void 0) payload.name = updates.name;
    if (updates.email !== void 0) payload.email = updates.email;
    if (updates.phone !== void 0) payload.phone = updates.phone;
    if (updates.role !== void 0) payload.role = updates.role;
    if (updates.avatar !== void 0) payload.avatar = updates.avatar;
    if (updates.active !== void 0) payload.active = updates.active;
    if (updates.skills !== void 0) payload.skillsJson = JSON.stringify(updates.skills);
    if (updates.bio !== void 0) payload.bio = updates.bio;
    const result = await db.update(teamMembers).set(payload).where(eq(teamMembers.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update team member:", error);
    throw new Error("Database error updating team member", { cause: error });
  }
}
async function deleteTeamMemberFromDb(id) {
  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team member:", error);
    throw new Error("Database error deleting team member", { cause: error });
  }
}
async function insertPhotoSession(data) {
  try {
    const payload = {
      id: data.id,
      clientId: data.clientId,
      projectId: data.projectId || "",
      title: data.title || "",
      date: data.date || "",
      time: data.time || "",
      location: data.location || "",
      sessionType: data.sessionType || "Sesiones",
      photosTaken: data.photosTaken || 0,
      photosSelected: data.photosSelected || 0,
      photosEdited: data.photosEdited || 0,
      photosDelivered: data.photosDelivered || 0,
      status: data.status || "Programada",
      notes: data.notes || ""
    };
    const result = await db.insert(photoSessions).values(payload).onConflictDoUpdate({
      target: photoSessions.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert photo session:", error);
    throw new Error("Database error inserting photo session", { cause: error });
  }
}
async function updatePhotoSessionInDb(id, updates) {
  try {
    const payload = { ...updates };
    delete payload.id;
    const result = await db.update(photoSessions).set(payload).where(eq(photoSessions.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update photo session:", error);
    throw new Error("Database error updating photo session", { cause: error });
  }
}
async function deletePhotoSessionFromDb(id) {
  try {
    await db.delete(photoSessions).where(eq(photoSessions.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete photo session:", error);
    throw new Error("Database error deleting photo session", { cause: error });
  }
}
async function insertGallery(data) {
  try {
    const payload = {
      id: data.id,
      title: data.title || "",
      clientId: data.clientId,
      sessionId: data.sessionId || "",
      projectId: data.projectId || "",
      coverImage: data.coverImage || "",
      imagesJson: JSON.stringify(data.images || []),
      clientShared: data.clientShared || false,
      shareToken: data.shareToken || "share-" + Date.now(),
      description: data.description || "",
      createdAt: data.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
    const result = await db.insert(galleries).values(payload).onConflictDoUpdate({
      target: galleries.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert gallery:", error);
    throw new Error("Database error inserting gallery", { cause: error });
  }
}
async function updateGalleryInDb(id, updates) {
  try {
    const payload = { ...updates };
    delete payload.id;
    if (payload.images !== void 0) {
      payload.imagesJson = JSON.stringify(payload.images);
      delete payload.images;
    }
    const result = await db.update(galleries).set(payload).where(eq(galleries.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update gallery:", error);
    throw new Error("Database error updating gallery", { cause: error });
  }
}
async function deleteGalleryFromDb(id) {
  try {
    await db.delete(galleries).where(eq(galleries.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete gallery:", error);
    throw new Error("Database error deleting gallery", { cause: error });
  }
}
async function insertMediaProject(data) {
  try {
    const payload = {
      id: data.id,
      title: data.title || "",
      clientId: data.clientId,
      projectId: data.projectId || "",
      format: data.format || "Reel / Vertical (9:16)",
      duration: data.duration || "0:30",
      script: data.script || "",
      versionsJson: JSON.stringify(data.versions || []),
      currentVersion: data.currentVersion || "V1",
      status: data.status || "Grabaci\xF3n",
      notes: data.notes || ""
    };
    const result = await db.insert(mediaProjects).values(payload).onConflictDoUpdate({
      target: mediaProjects.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert media project:", error);
    throw new Error("Database error inserting media project", { cause: error });
  }
}
async function updateMediaProjectInDb(id, updates) {
  try {
    const payload = { ...updates };
    delete payload.id;
    if (payload.versions !== void 0) {
      payload.versionsJson = JSON.stringify(payload.versions);
      delete payload.versions;
    }
    const result = await db.update(mediaProjects).set(payload).where(eq(mediaProjects.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update media project:", error);
    throw new Error("Database error updating media project", { cause: error });
  }
}
async function deleteMediaProjectFromDb(id) {
  try {
    await db.delete(mediaProjects).where(eq(mediaProjects.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media project:", error);
    throw new Error("Database error deleting media project", { cause: error });
  }
}
async function insertProjectFile(data) {
  try {
    const payload = {
      id: data.id,
      clientId: data.clientId,
      projectId: data.projectId,
      folder: data.folder || "Cotizaci\xF3n",
      name: data.name || "",
      size: data.size || "0 KB",
      type: data.type || "Archivo",
      uploadDate: data.uploadDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      url: data.url || "#",
      nasSynced: data.nasSynced !== false
    };
    const result = await db.insert(projectFiles).values(payload).onConflictDoUpdate({
      target: projectFiles.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert project file:", error);
    throw new Error("Database error inserting project file", { cause: error });
  }
}
async function deleteProjectFileFromDb(id) {
  try {
    await db.delete(projectFiles).where(eq(projectFiles.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project file:", error);
    throw new Error("Database error deleting project file", { cause: error });
  }
}
async function insertCalendarEvent(data) {
  try {
    const payload = {
      id: data.id,
      title: data.title || "",
      type: data.type || "Evento general",
      startDate: data.startDate || "",
      endDate: data.endDate || data.startDate || "",
      time: data.time || "",
      clientId: data.clientId || "",
      projectId: data.projectId || "",
      location: data.location || "",
      description: data.description || "",
      isCompleted: data.isCompleted || false
    };
    const result = await db.insert(calendarEvents).values(payload).onConflictDoUpdate({
      target: calendarEvents.id,
      set: payload
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert calendar event:", error);
    throw new Error("Database error inserting calendar event", { cause: error });
  }
}
async function updateCalendarEventInDb(id, updates) {
  try {
    const payload = { ...updates };
    delete payload.id;
    const result = await db.update(calendarEvents).set(payload).where(eq(calendarEvents.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update calendar event:", error);
    throw new Error("Database error updating calendar event", { cause: error });
  }
}
async function deleteCalendarEventFromDb(id) {
  try {
    await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete calendar event:", error);
    throw new Error("Database error deleting calendar event", { cause: error });
  }
}

// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "estudio-devjos",
  appId: "1:493881955821:web:0a4c14a7b5999974e4c3e4",
  apiKey: "AIzaSyCyKL6k9-sP1iaeEAbu6wa48P0k_zn7zDg",
  authDomain: "estudio-devjos.firebaseapp.com",
  storageBucket: "estudio-devjos.firebasestorage.app",
  messagingSenderId: "493881955821",
  measurementId: "",
  oAuthClientId: "",
  recaptchaSiteKey: ""
};

// src/lib/firebase-admin.ts
if (!getApps().length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({
      credential: cert(serviceAccount),
      projectId: firebase_applet_config_default.projectId
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      credential: applicationDefault(),
      projectId: firebase_applet_config_default.projectId
    });
  } else {
    console.warn(
      "FIREBASE_SERVICE_ACCOUNT_JSON not set \u2014 Firebase Admin running in limited mode (ID token verification only; admin actions like creating users will fail)."
    );
    initializeApp({
      projectId: firebase_applet_config_default.projectId
    });
  }
}
var adminAuth = getAuth();

// src/middleware/auth.ts
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
var requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        error: `Forbidden: requires one of [${allowedRoles.join(", ")}], got '${role || "none"}'`
      });
    }
    next();
  };
};

// src/apiRouter.ts
import { randomBytes } from "crypto";
var apiRouter = Router();
var VALID_ROLES = ["Administrador", "Developer", "Dise\xF1ador", "Fot\xF3grafo", "Vide\xF3grafo", "Finanzas", "Contenido", "Cliente"];
apiRouter.post("/team/provision-access", requireAuth, requireRole("Administrador"), async (req, res) => {
  try {
    const { email, name, role } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Falta el email." });
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `Rol inv\xE1lido. Debe ser uno de: ${VALID_ROLES.join(", ")}` });
    }
    const cleanEmail = email.trim().toLowerCase();
    let userRecord;
    let created = false;
    try {
      userRecord = await adminAuth.getUserByEmail(cleanEmail);
    } catch (e) {
      if (e?.code !== "auth/user-not-found") throw e;
      const tempPassword = randomBytes(9).toString("base64").replace(/[+/=]/g, "").slice(0, 12);
      userRecord = await adminAuth.createUser({
        email: cleanEmail,
        password: tempPassword,
        displayName: name || cleanEmail,
        emailVerified: false
      });
      created = true;
    }
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });
    res.json({ success: true, uid: userRecord.uid, created });
  } catch (err) {
    console.error("Error provisioning Firebase access:", err);
    res.status(500).json({ error: err?.message || "No se pudo crear/actualizar la cuenta de acceso." });
  }
});
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "postgresql",
    hasPostgresUrl: Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.get("/db-status", requireAuth, requireRole("Administrador"), async (req, res) => {
  try {
    const pool2 = createPool();
    const result = await pool2.query("SELECT current_database(), current_user, NOW() as current_time;");
    const clientCountRes = await pool2.query("SELECT COUNT(*) FROM clients;");
    const clientCount = parseInt(clientCountRes.rows[0]?.count || "0", 10);
    res.json({
      success: true,
      connected: true,
      database: result.rows[0]?.current_database,
      user: result.rows[0]?.current_user,
      serverTime: result.rows[0]?.current_time,
      totalClientsInPostgres: clientCount,
      message: `Conectado exitosamente a PostgreSQL en Vercel (${clientCount} clientes registrados).`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      connected: false,
      error: err?.message || String(err),
      hasEnvVar: Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL),
      message: "No se pudo conectar a la base de datos PostgreSQL en Vercel."
    });
  }
});
apiRouter.get("/init-db", requireAuth, requireRole("Administrador"), async (req, res) => {
  try {
    await ensureDatabaseSeeded();
    res.json({
      success: true,
      message: "Tablas y datos inicializados correctamente en PostgreSQL / Vercel Postgres"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});
apiRouter.get("/bootstrap", requireAuth, async (req, res) => {
  try {
    const data = await getAllAppData();
    if (data) {
      res.json(data);
    } else {
      res.json({
        isConnected: false,
        message: "PostgreSQL a\xFAn no est\xE1 inicializado o no hay cadena de conexi\xF3n activa."
      });
    }
  } catch (error) {
    console.warn("PostgreSQL bootstrap info:", error?.message || error);
    res.json({
      isConnected: false,
      error: error?.message || "Database not ready"
    });
  }
});
apiRouter.post("/clients", requireAuth, async (req, res) => {
  try {
    const newClient = await insertClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error creating client in DB:", error);
    res.status(500).json({ error: error.message || "Failed to create client" });
  }
});
apiRouter.put("/clients/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateClientInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating client in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update client" });
  }
});
apiRouter.delete("/clients/:id", requireAuth, async (req, res) => {
  try {
    await deleteClientFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting client from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete client" });
  }
});
apiRouter.post("/projects", requireAuth, async (req, res) => {
  try {
    const newProj = await insertProject(req.body);
    res.status(201).json(newProj);
  } catch (error) {
    console.error("Error creating project in DB:", error);
    res.status(500).json({ error: error.message || "Failed to create project" });
  }
});
apiRouter.put("/projects/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateProjectInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating project in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update project" });
  }
});
apiRouter.delete("/projects/:id", requireAuth, async (req, res) => {
  try {
    await deleteProjectFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting project from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete project" });
  }
});
apiRouter.post("/tasks", requireAuth, async (req, res) => {
  try {
    const newTask = await insertTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task in DB:", error);
    res.status(500).json({ error: error.message || "Failed to create task" });
  }
});
apiRouter.put("/tasks/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateTaskInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating task in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update task" });
  }
});
apiRouter.delete("/tasks/:id", requireAuth, async (req, res) => {
  try {
    await deleteTaskFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting task from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete task" });
  }
});
apiRouter.post("/quotes", requireAuth, async (req, res) => {
  try {
    const newQuote = await insertQuote(req.body);
    res.status(201).json(newQuote);
  } catch (error) {
    console.error("Error creating quote in DB:", error);
    res.status(500).json({ error: error.message || "Failed to create quote" });
  }
});
apiRouter.put("/quotes/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateQuoteInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating quote in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update quote" });
  }
});
apiRouter.delete("/quotes/:id", requireAuth, async (req, res) => {
  try {
    await deleteQuoteFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting quote from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete quote" });
  }
});
apiRouter.post("/incomes", requireAuth, async (req, res) => {
  try {
    const newInc = await insertIncome(req.body);
    res.status(201).json(newInc);
  } catch (error) {
    console.error("Error recording income in DB:", error);
    res.status(500).json({ error: error.message || "Failed to record income" });
  }
});
apiRouter.delete("/incomes/:id", requireAuth, async (req, res) => {
  try {
    await deleteIncomeFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting income from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete income" });
  }
});
apiRouter.post("/expenses", requireAuth, async (req, res) => {
  try {
    const newExp = await insertExpense(req.body);
    res.status(201).json(newExp);
  } catch (error) {
    console.error("Error recording expense in DB:", error);
    res.status(500).json({ error: error.message || "Failed to record expense" });
  }
});
apiRouter.delete("/expenses/:id", requireAuth, async (req, res) => {
  try {
    await deleteExpenseFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting expense from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete expense" });
  }
});
apiRouter.post("/services", requireAuth, async (req, res) => {
  try {
    const newSrv = await insertService(req.body);
    res.status(201).json(newSrv);
  } catch (error) {
    console.error("Error saving service in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save service" });
  }
});
apiRouter.put("/services/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateServiceInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating service in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update service" });
  }
});
apiRouter.delete("/services/:id", requireAuth, async (req, res) => {
  try {
    await deleteServiceFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting service from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete service" });
  }
});
apiRouter.post("/payments", requireAuth, async (req, res) => {
  try {
    const newPay = await insertPayment(req.body);
    res.status(201).json(newPay);
  } catch (error) {
    console.error("Error saving payment in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save payment" });
  }
});
apiRouter.put("/payments/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updatePaymentInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating payment in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update payment" });
  }
});
apiRouter.delete("/payments/:id", requireAuth, async (req, res) => {
  try {
    await deletePaymentFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting payment from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete payment" });
  }
});
apiRouter.post("/team", requireAuth, requireRole("Administrador"), async (req, res) => {
  try {
    const newMember = await insertTeamMember(req.body);
    res.status(201).json(newMember);
  } catch (error) {
    console.error("Error saving team member in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save team member" });
  }
});
apiRouter.put("/team/:id", requireAuth, requireRole("Administrador"), async (req, res) => {
  try {
    const updated = await updateTeamMemberInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating team member in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update team member" });
  }
});
apiRouter.delete("/team/:id", requireAuth, requireRole("Administrador"), async (req, res) => {
  try {
    await deleteTeamMemberFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting team member from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete team member" });
  }
});
apiRouter.post("/photo-sessions", requireAuth, async (req, res) => {
  try {
    const newSession = await insertPhotoSession(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error saving photo session in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save photo session" });
  }
});
apiRouter.put("/photo-sessions/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updatePhotoSessionInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating photo session in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update photo session" });
  }
});
apiRouter.delete("/photo-sessions/:id", requireAuth, async (req, res) => {
  try {
    await deletePhotoSessionFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting photo session from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete photo session" });
  }
});
apiRouter.post("/galleries", requireAuth, async (req, res) => {
  try {
    const newGallery = await insertGallery(req.body);
    res.status(201).json(newGallery);
  } catch (error) {
    console.error("Error saving gallery in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save gallery" });
  }
});
apiRouter.put("/galleries/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateGalleryInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating gallery in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update gallery" });
  }
});
apiRouter.delete("/galleries/:id", requireAuth, async (req, res) => {
  try {
    await deleteGalleryFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting gallery from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete gallery" });
  }
});
apiRouter.post("/media-projects", requireAuth, async (req, res) => {
  try {
    const newMedia = await insertMediaProject(req.body);
    res.status(201).json(newMedia);
  } catch (error) {
    console.error("Error saving media project in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save media project" });
  }
});
apiRouter.put("/media-projects/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateMediaProjectInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating media project in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update media project" });
  }
});
apiRouter.delete("/media-projects/:id", requireAuth, async (req, res) => {
  try {
    await deleteMediaProjectFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting media project from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete media project" });
  }
});
apiRouter.post("/files", requireAuth, async (req, res) => {
  try {
    const newFile = await insertProjectFile(req.body);
    res.status(201).json(newFile);
  } catch (error) {
    console.error("Error saving file in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save file" });
  }
});
apiRouter.delete("/files/:id", requireAuth, async (req, res) => {
  try {
    await deleteProjectFileFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting file from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete file" });
  }
});
apiRouter.post("/calendar-events", requireAuth, async (req, res) => {
  try {
    const newEvent = await insertCalendarEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error saving calendar event in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save calendar event" });
  }
});
apiRouter.put("/calendar-events/:id", requireAuth, async (req, res) => {
  try {
    const updated = await updateCalendarEventInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating calendar event in DB:", error);
    res.status(500).json({ error: error.message || "Failed to update calendar event" });
  }
});
apiRouter.delete("/calendar-events/:id", requireAuth, async (req, res) => {
  try {
    await deleteCalendarEventFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting calendar event from DB:", error);
    res.status(500).json({ error: error.message || "Failed to delete calendar event" });
  }
});
apiRouter.post("/sync-all", requireAuth, async (req, res) => {
  try {
    const result = await syncAllAppData(req.body);
    res.json(result);
  } catch (error) {
    console.warn("Bulk sync to PostgreSQL info:", error?.message || error);
    res.status(200).json({
      success: false,
      error: error?.message || "Database not ready for bulk sync"
    });
  }
});
apiRouter.post("/settings", requireAuth, async (req, res) => {
  try {
    await updateSettingsInDb(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving settings in DB:", error);
    res.status(500).json({ error: error.message || "Failed to save settings" });
  }
});

// api/index.ts
var app = express();
app.use(express.json());
var isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    try {
      await ensureDatabaseSeeded();
      isInitialized = true;
    } catch (e) {
      console.error("Vercel cold-start db initialization check:", e);
    }
  }
  next();
});
app.use("/api", apiRouter);
app.use("/", apiRouter);
var index_default = app;
export {
  index_default as default
};
