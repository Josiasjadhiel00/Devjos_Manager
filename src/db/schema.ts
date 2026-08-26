import { pgTable, text, serial, integer, doublePrecision, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table (synced with Firebase Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('Administrador'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Clients table
export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company').default(''),
  phone: text('phone').default(''),
  whatsapp: text('whatsapp').default(''),
  email: text('email').default(''),
  address: text('address').default(''),
  instagram: text('instagram').default(''),
  facebook: text('facebook').default(''),
  website: text('website').default(''),
  registeredDate: text('registered_date').notNull(),
  status: text('status').notNull().default('Prospecto'),
  notes: text('notes').default(''),
  avatar: text('avatar').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  clientId: text('client_id').notNull(),
  category: text('category').notNull().default('Desarrollo'),
  description: text('description').default(''),
  price: doublePrecision('price').notNull().default(0),
  startDate: text('start_date').notNull(),
  deliveryDate: text('delivery_date').notNull(),
  status: text('status').notNull().default('Lead'),
  priority: text('priority').notNull().default('Media'),
  progress: integer('progress').notNull().default(0),
  responsibleId: text('responsible_id').default(''),
  notes: text('notes').default(''),
  paidAmount: doublePrecision('paid_amount').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  projectId: text('project_id').notNull(),
  responsibleId: text('responsible_id').default(''),
  priority: text('priority').notNull().default('Media'),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull().default('Pendiente'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Services table
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().default('Desarrollo'),
  description: text('description').default(''),
  basePrice: doublePrecision('base_price').notNull().default(0),
  minPrice: doublePrecision('min_price').notNull().default(0),
  status: text('status').notNull().default('Activo'),
  unit: text('unit').default('Servicio'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Quotes table
export const quotes = pgTable('quotes', {
  id: text('id').primaryKey(),
  quoteNumber: text('quote_number').notNull().unique(),
  clientId: text('client_id').notNull(),
  issueDate: text('issue_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  status: text('status').notNull().default('Borrador'),
  itemsJson: text('items_json').notNull().default('[]'),
  subtotal: doublePrecision('subtotal').notNull().default(0),
  discountTotal: doublePrecision('discount_total').notNull().default(0),
  taxRate: doublePrecision('tax_rate').notNull().default(0.18),
  taxAmount: doublePrecision('tax_amount').notNull().default(0),
  total: doublePrecision('total').notNull().default(0),
  notes: text('notes').default(''),
  terms: text('terms').default(''),
  associatedProjectId: text('associated_project_id').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Incomes table
export const incomes = pgTable('incomes', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(),
  projectId: text('project_id').default(''),
  amount: doublePrecision('amount').notNull().default(0),
  date: text('date').notNull(),
  method: text('method').notNull().default('Transferencia'),
  description: text('description').default(''),
  invoiceNumber: text('invoice_number').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Expenses table
export const expenses = pgTable('expenses', {
  id: text('id').primaryKey(),
  category: text('category').notNull().default('Otros'),
  description: text('description').default(''),
  amount: doublePrecision('amount').notNull().default(0),
  date: text('date').notNull(),
  method: text('method').notNull().default('Transferencia'),
  receiptUrl: text('receipt_url').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Project Payments table
export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  clientId: text('client_id').notNull(),
  totalContract: doublePrecision('total_contract').notNull().default(0),
  advancePayment: doublePrecision('advance_payment').notNull().default(0),
  secondPayment: doublePrecision('second_payment').notNull().default(0),
  additionalPaymentsJson: text('additional_payments_json').notNull().default('[]'),
  totalPaid: doublePrecision('total_paid').notNull().default(0),
  totalPending: doublePrecision('total_pending').notNull().default(0),
  status: text('status').notNull().default('Pendiente'),
  lastPaymentDate: text('last_payment_date').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Photography Sessions table
export const photoSessions = pgTable('photo_sessions', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(),
  projectId: text('project_id').default(''),
  title: text('title').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').default(''),
  sessionType: text('session_type').notNull().default('Sesiones'),
  photosTaken: integer('photos_taken').notNull().default(0),
  photosSelected: integer('photos_selected').notNull().default(0),
  photosEdited: integer('photos_edited').notNull().default(0),
  photosDelivered: integer('photos_delivered').notNull().default(0),
  status: text('status').notNull().default('Programada'),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Galleries table
export const galleries = pgTable('galleries', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  clientId: text('client_id').notNull(),
  sessionId: text('session_id').default(''),
  projectId: text('project_id').default(''),
  coverImage: text('cover_image').default(''),
  imagesJson: text('images_json').notNull().default('[]'),
  clientShared: boolean('client_shared').notNull().default(false),
  shareToken: text('share_token').notNull(),
  description: text('description').default(''),
  createdAt: text('created_at').notNull(),
});

// Media Projects table
export const mediaProjects = pgTable('media_projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  clientId: text('client_id').notNull(),
  projectId: text('project_id').default(''),
  format: text('format').notNull().default('Reel / Vertical (9:16)'),
  duration: text('duration').default('0:30'),
  script: text('script').default(''),
  versionsJson: text('versions_json').notNull().default('[]'),
  currentVersion: text('current_version').notNull().default('V1'),
  status: text('status').notNull().default('Grabación'),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Project Files table
export const projectFiles = pgTable('project_files', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(),
  projectId: text('project_id').notNull(),
  folder: text('folder').notNull().default('Cotización'),
  name: text('name').notNull(),
  size: text('size').default('0 KB'),
  type: text('type').default('Archivo'),
  uploadDate: text('upload_date').notNull(),
  url: text('url').notNull().default('#'),
  nasSynced: boolean('nas_synced').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Calendar Events table
export const calendarEvents = pgTable('calendar_events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull().default('Evento general'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  time: text('time').default(''),
  clientId: text('client_id').default(''),
  projectId: text('project_id').default(''),
  location: text('location').default(''),
  description: text('description').default(''),
  isCompleted: boolean('is_completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Team Members table
export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').default(''),
  role: text('role').notNull().default('Developer'),
  avatar: text('avatar').default(''),
  active: boolean('active').notNull().default(true),
  skillsJson: text('skills_json').notNull().default('[]'),
  bio: text('bio').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Studio Settings & Automation Configuration table
export const studioSettings = pgTable('studio_settings', {
  id: text('id').primaryKey(),
  settingsJson: text('settings_json').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
