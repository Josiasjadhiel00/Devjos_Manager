export type RoleType = 
  | 'Administrador' 
  | 'Developer' 
  | 'Diseñador' 
  | 'Fotógrafo' 
  | 'Videógrafo' 
  | 'Finanzas' 
  | 'Contenido'
  | 'Cliente';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  phone?: string;
  clientId?: string;
  customPermissions?: string[];
}

export type ClientStatus = 'Prospecto' | 'Contactado' | 'Cliente' | 'Inactivo';

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  website: string;
  registeredDate: string;
  status: ClientStatus;
  notes: string;
  avatar?: string;
}

export type ProjectCategory = 
  | 'Desarrollo' 
  | 'Diseño' 
  | 'Branding' 
  | 'Fotografía' 
  | 'Video' 
  | 'Multimedia' 
  | 'Redes sociales' 
  | 'Otro';

export type ProjectStatus = 
  | 'Lead' 
  | 'Cotización' 
  | 'Aprobado' 
  | 'En progreso' 
  | 'En revisión' 
  | 'Pausado' 
  | 'Entregado' 
  | 'Completado' 
  | 'Cancelado';

export type Priority = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  category: ProjectCategory;
  description: string;
  price: number;
  startDate: string;
  deliveryDate: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  responsibleId: string;
  notes: string;
  paidAmount: number;
}

export type TaskStatus = 'Pendiente' | 'En progreso' | 'En revisión' | 'Completada';

export interface Task {
  id: string;
  name: string;
  description: string;
  projectId: string;
  responsibleId: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
}

export type ServiceCategory = 
  | 'Desarrollo' 
  | 'Diseño' 
  | 'Branding' 
  | 'Fotografía' 
  | 'Multimedia' 
  | 'Redes sociales';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  basePrice: number;
  minPrice: number;
  status: 'Activo' | 'Inactivo';
  unit?: string;
}

export type QuoteStatus = 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Vencida';

export interface QuoteItem {
  id: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  issueDate: string;
  expiryDate: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  discountTotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  associatedProjectId?: string;
}

export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Stripe' | 'PayPal' | 'Otro';

export interface Income {
  id: string;
  clientId: string;
  projectId?: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  description: string;
  invoiceNumber?: string;
}

export type ExpenseCategory = 
  | 'Transporte' 
  | 'Equipos' 
  | 'Software' 
  | 'Internet' 
  | 'Publicidad' 
  | 'Servicios' 
  | 'Otros';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  receiptUrl?: string;
}

export type PaymentStatus = 'Pagado' | 'Parcial' | 'Pendiente';

export interface ProjectPayment {
  id: string;
  projectId: string;
  clientId: string;
  totalContract: number;
  advancePayment: number;
  secondPayment: number;
  additionalPayments: {
    id: string;
    amount: number;
    date: string;
    note: string;
    method: PaymentMethod;
  }[];
  totalPaid: number;
  totalPending: number;
  status: PaymentStatus;
  lastPaymentDate?: string;
}

export type PhotoSessionType = 
  | 'Retratos' 
  | 'Fotografía corporativa' 
  | 'Productos' 
  | 'Sesiones' 
  | 'Eventos';

export type PhotoSessionStatus = 
  | 'Programada' 
  | 'Realizada' 
  | 'Selección' 
  | 'Edición' 
  | 'Entrega' 
  | 'Completada';

export interface PhotographySession {
  id: string;
  clientId: string;
  projectId?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  sessionType: PhotoSessionType;
  photosTaken: number;
  photosSelected: number;
  photosEdited: number;
  photosDelivered: number;
  status: PhotoSessionStatus;
  notes: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  selected: boolean;
  edited: boolean;
  tags: string[];
}

export interface Gallery {
  id: string;
  title: string;
  clientId: string;
  sessionId?: string;
  projectId?: string;
  coverImage: string;
  createdAt: string;
  images: GalleryImage[];
  clientShared: boolean;
  shareToken: string;
  description?: string;
}

export type MediaFormat = 
  | 'Reel / Vertical (9:16)' 
  | 'Video Promocional (16:9)' 
  | 'Edición Corta' 
  | 'Streaming / Cobertura' 
  | 'YouTube Long-form';

export type MediaVersionNumber = 'V1' | 'V2' | 'V3' | 'Final';

export interface MediaVersion {
  version: MediaVersionNumber;
  fileUrl: string;
  createdAt: string;
  notes: string;
  status: 'Borrador' | 'En revisión' | 'Aprobado';
}

export type MediaProjectStatus = 'Grabación' | 'Edición' | 'Revisión' | 'Aprobado' | 'Entregado';

export interface MediaProject {
  id: string;
  title: string;
  clientId: string;
  projectId?: string;
  format: MediaFormat;
  duration: string;
  script: string;
  versions: MediaVersion[];
  currentVersion: MediaVersionNumber;
  status: MediaProjectStatus;
  notes: string;
}

export type FileFolder = 
  | 'Cotización' 
  | 'Contrato' 
  | 'Diseños' 
  | 'Fotografías' 
  | 'Videos' 
  | 'Entrega';

export type NasBrandType = 'Synology' | 'TrueNAS' | 'QNAP' | 'WebDAV' | 'SMB' | 'Personalizado' | 'synology' | 'qnap' | 'truenas' | 'smb' | 'local';

export interface ProjectFile {
  id: string;
  clientId: string;
  projectId: string;
  folder: FileFolder;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  url: string;
  nasSynced: boolean;
  fileDataUrl?: string;
  nasPath?: string;
}

export type CalendarEventType = 
  | 'Sesión fotográfica' 
  | 'Grabación' 
  | 'Reunión' 
  | 'Entrega de proyecto' 
  | 'Vencimiento cotización' 
  | 'Evento general';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  startDate: string;
  endDate: string;
  time?: string;
  clientId?: string;
  projectId?: string;
  location?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  avatar: string;
  active: boolean;
  skills: string[];
  bio?: string;
  lastLogin?: string;
  allowedViews?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'project' | 'task' | 'quote' | 'payment' | 'session' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: string;
  targetTitle: string;
  timestamp: string;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  address: string;
  taxId: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  nasStorageEnabled: boolean;
  nasStoragePath: string;
  automationRules: {
    autoCreateProjectOnQuoteAccept: boolean;
    autoCreateKickoffTasks: boolean;
    autoRecordAdvanceDeposit: boolean;
    autoFolderStructure: boolean;
    notifyOnDueDates: boolean;
  };
}
