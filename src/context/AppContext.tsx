import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Client,
  Project,
  Task,
  Service,
  Quote,
  Income,
  Expense,
  ProjectPayment,
  PhotographySession,
  Gallery,
  MediaProject,
  ProjectFile,
  CalendarEvent,
  TeamMember,
  NotificationItem,
  ActivityLog,
  StudioSettings,
  RoleType,
  ProjectStatus,
  TaskStatus,
  QuoteStatus,
  PhotoSessionStatus,
  PaymentMethod,
  FileFolder,
  AuthUser,
} from '../types';
import {
  initialSettings,
  initialTeam,
  initialServices,
  initialClients,
  initialProjects,
  initialTasks,
  initialQuotes,
  initialIncomes,
  initialExpenses,
  initialPayments,
  initialPhotoSessions,
  initialGalleries,
  initialMediaProjects,
  initialFiles,
  initialCalendarEvents,
  initialNotifications,
  initialActivityLogs,
} from '../data/initialData';
import { canAccessView } from '../utils/permissions';
import { 
  subscribeToStudioData, 
  saveStudioDataToFirestore, 
  directForceSaveToFirestore,
  getStudioDataOnce,
  testFirestoreConnection, 
  StudioSyncPayload 
} from '../lib/firestoreSync';
import { formatCurrency, getCurrencySymbol } from '../utils/formatCurrency';

export type ActiveView = 
  | 'dashboard'
  | 'clients'
  | 'projects'
  | 'tasks'
  | 'finance'
  | 'quotes'
  | 'payments'
  | 'files'
  | 'photography'
  | 'multimedia'
  | 'content'
  | 'calendar'
  | 'team'
  | 'reports'
  | 'settings'
  | 'client-portal';

interface AppContextType {
  // Auth & Session
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isUserProfileModalOpen: boolean;
  setIsUserProfileModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => { success: boolean; message?: string };
  loginAsMember: (memberId: string) => void;
  loginAsClient: (clientId: string) => void;
  logout: () => void;
  hasAccessToView: (view: ActiveView) => boolean;

  // State
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  currentUserRole: RoleType;
  setCurrentUserRole: (role: RoleType) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  
  // Database status
  isDatabaseConnected: boolean;
  syncStatus: 'idle' | 'syncing' | 'connected' | 'offline';
  refreshDataFromDb: () => Promise<any>;
  testFirestoreConnection: () => Promise<{ success: boolean; message: string }>;
  forceUploadToFirestore: () => Promise<{ success: boolean; message: string }>;
  forceDownloadFromFirestore: () => Promise<{ success: boolean; message: string }>;
  syncToPostgres: (customPayload?: any) => Promise<{ success: boolean; message: string }>;
  checkVercelDbStatus: () => Promise<{ success: boolean; message: string; connected?: boolean; totalClientsInPostgres?: number }>;

  // Selection States for deep-linking / modals
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedQuoteId: string | null;
  setSelectedQuoteId: (id: string | null) => void;
  selectedGalleryId: string | null;
  setSelectedGalleryId: (id: string | null) => void;
  selectedMediaId: string | null;
  setSelectedMediaId: (id: string | null) => void;
  portalClientId: string;
  setPortalClientId: (id: string) => void;

  // Search & Navigation
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  quickActionOpen: boolean;
  setQuickActionOpen: (open: boolean) => void;

  // Data Collections
  settings: StudioSettings;
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  services: Service[];
  quotes: Quote[];
  incomes: Income[];
  expenses: Expense[];
  payments: ProjectPayment[];
  photoSessions: PhotographySession[];
  galleries: Gallery[];
  mediaProjects: MediaProject[];
  files: ProjectFile[];
  calendarEvents: CalendarEvent[];
  team: TeamMember[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];

  // CRUD Actions
  addClient: (client: Omit<Client, 'id' | 'registeredDate'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addProject: (project: Omit<Project, 'id' | 'progress' | 'paidAmount'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;

  addTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addQuote: (quote: Omit<Quote, 'id' | 'quoteNumber'>) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  updateQuoteStatus: (id: string, status: QuoteStatus, autoTriggerProject?: boolean) => void;

  addIncome: (income: Omit<Income, 'id'>) => void;
  deleteIncome: (id: string) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  recordPayment: (projectId: string, amount: number, method: PaymentMethod, note: string) => void;

  addPhotoSession: (session: Omit<PhotographySession, 'id'>) => PhotographySession;
  updatePhotoSession: (id: string, updates: Partial<PhotographySession>) => void;
  deletePhotoSession: (id: string) => void;

  addGallery: (gallery: Omit<Gallery, 'id' | 'createdAt' | 'shareToken'>) => Gallery;
  updateGallery: (id: string, updates: Partial<Gallery>) => void;
  deleteGallery: (id: string) => void;
  toggleGalleryImageSelection: (galleryId: string, imageId: string) => void;

  addMediaProject: (media: Omit<MediaProject, 'id' | 'currentVersion'>) => MediaProject;
  updateMediaProject: (id: string, updates: Partial<MediaProject>) => void;
  deleteMediaProject: (id: string) => void;
  addMediaVersion: (mediaId: string, notes: string, fileUrl?: string) => void;

  addFile: (file: Omit<ProjectFile, 'id' | 'uploadDate' | 'nasSynced'>) => void;
  deleteFile: (id: string) => void;
  moveFileFolder: (fileId: string, newFolder: FileFolder) => void;

  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;

  updateSettings: (updates: Partial<StudioSettings>) => void;
  resetToDemoData: () => void;

  // Currency & Money Formatting Helpers
  formatMoney: (amount: number | string | undefined | null, options?: { hideDecimalsIfWhole?: boolean; includeCode?: boolean }) => string;
  currencySymbol: string;
  currencyCode: string;

  // Computed Metrics
  metrics: {
    totalClients: number;
    activeProjects: number;
    completedProjects: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyProfit: number;
    totalPendingReceivables: number;
    overdueProjectsCount: number;
    pendingTasksCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'devjos_manager_v1_store';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<RoleType>('Administrador');
  // Always initialize with null so every reload starts at the Login Screen
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'connected' | 'offline'>('connected');

  // Deep linking / active inspect states
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [portalClientId, setPortalClientId] = useState<string>('cli-1');

  // UI state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Entities
  const [settings, setSettings] = useState<StudioSettings>(initialSettings);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [payments, setPayments] = useState<ProjectPayment[]>(initialPayments);
  const [photoSessions, setPhotoSessions] = useState<PhotographySession[]>(initialPhotoSessions);
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const [mediaProjects, setMediaProjects] = useState<MediaProject[]>(initialMediaProjects);
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  // Wraps fetch for write operations: throws on non-2xx responses (fetch alone
  // does NOT reject on HTTP errors, only on network failures), so backend
  // failures no longer disappear silently and the UI can react to them.
  const syncToBackend = useCallback(async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body?.error) detail = body.error;
      } catch {
        // response had no JSON body; keep the status text
      }
      throw new Error(detail);
    }
    try {
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  // Fetch initial data from Cloud SQL backend
  const refreshDataFromDb = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        if (data.isConnected === false) {
          // Backend responded but the database itself isn't ready/connected
          console.warn('Backend API bootstrap: database not connected:', data.message || data.error);
          setIsDatabaseConnected(false);
          setSyncStatus('offline');
          return data;
        }
        if (data.settings) setSettings(data.settings);
        if (data.clients && data.clients.length > 0) setClients(data.clients);
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.tasks && data.tasks.length > 0) setTasks(data.tasks);
        if (data.services && data.services.length > 0) setServices(data.services);
        if (data.quotes && data.quotes.length > 0) setQuotes(data.quotes);
        if (data.incomes && data.incomes.length > 0) setIncomes(data.incomes);
        if (data.expenses && data.expenses.length > 0) setExpenses(data.expenses);
        if (data.payments && data.payments.length > 0) setPayments(data.payments);
        if (data.photoSessions && data.photoSessions.length > 0) setPhotoSessions(data.photoSessions);
        if (data.galleries && data.galleries.length > 0) setGalleries(data.galleries);
        if (data.mediaProjects && data.mediaProjects.length > 0) setMediaProjects(data.mediaProjects);
        if (data.files && data.files.length > 0) setFiles(data.files);
        if (data.calendarEvents && data.calendarEvents.length > 0) setCalendarEvents(data.calendarEvents);
        if (data.team && data.team.length > 0) setTeam(data.team);
        setIsDatabaseConnected(true);
        setSyncStatus('connected');
        return data;
      } else {
        console.warn('Backend API bootstrap query failed with status:', res.status);
        setIsDatabaseConnected(false);
        setSyncStatus('offline');
      }
    } catch (err) {
      console.warn('Backend API bootstrap query info:', err);
      setIsDatabaseConnected(false);
      setSyncStatus('offline');
    }
  }, []);

  // Force upload current local dataset to Firestore
  const forceUploadToFirestore = useCallback(async () => {
    const payload: StudioSyncPayload = {
      settings,
      clients,
      projects,
      tasks,
      services,
      quotes,
      incomes,
      expenses,
      payments,
      photoSessions,
      galleries,
      mediaProjects,
      files,
      calendarEvents,
      team,
      notifications,
      activityLogs,
      theme,
    };
    const result = await directForceSaveToFirestore(payload, currentUser?.name);
    if (result.success) {
      setIsDatabaseConnected(true);
      setSyncStatus('connected');
    }
    return result;
  }, [
    settings,
    clients,
    projects,
    tasks,
    services,
    quotes,
    incomes,
    expenses,
    payments,
    photoSessions,
    galleries,
    mediaProjects,
    files,
    calendarEvents,
    team,
    notifications,
    activityLogs,
    theme,
    currentUser?.name,
  ]);

  // Force download cloud dataset from Firestore
  const forceDownloadFromFirestore = useCallback(async () => {
    const cloudData = await getStudioDataOnce();
    if (cloudData) {
      if (cloudData.settings) setSettings(cloudData.settings);
      if (cloudData.clients) setClients(cloudData.clients);
      if (cloudData.projects) setProjects(cloudData.projects);
      if (cloudData.tasks) setTasks(cloudData.tasks);
      if (cloudData.services) setServices(cloudData.services);
      if (cloudData.quotes) setQuotes(cloudData.quotes);
      if (cloudData.incomes) setIncomes(cloudData.incomes);
      if (cloudData.expenses) setExpenses(cloudData.expenses);
      if (cloudData.payments) setPayments(cloudData.payments);
      if (cloudData.photoSessions) setPhotoSessions(cloudData.photoSessions);
      if (cloudData.galleries) setGalleries(cloudData.galleries);
      if (cloudData.mediaProjects) setMediaProjects(cloudData.mediaProjects);
      if (cloudData.files) setFiles(cloudData.files);
      if (cloudData.calendarEvents) setCalendarEvents(cloudData.calendarEvents);
      if (cloudData.team) setTeam(cloudData.team);
      if (cloudData.notifications) setNotifications(cloudData.notifications);
      if (cloudData.activityLogs) setActivityLogs(cloudData.activityLogs);
      setIsDatabaseConnected(true);
      setSyncStatus('connected');
      return { success: true, message: 'Datos descargados y actualizados correctamente desde Firestore.' };
    }
    return { success: false, message: 'No se encontraron datos en Firestore o la base de datos no está creada.' };
  }, []);
  const stateRef = useRef({
    settings,
    clients,
    projects,
    tasks,
    services,
    quotes,
    incomes,
    expenses,
    payments,
  });

  useEffect(() => {
    stateRef.current = {
      settings,
      clients,
      projects,
      tasks,
      services,
      quotes,
      incomes,
      expenses,
      payments,
    };
  }, [settings, clients, projects, tasks, services, quotes, incomes, expenses, payments]);

  // Check Vercel Postgres diagnostic status
  const checkVercelDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        connected: false,
        message: 'No se pudo contactar con el endpoint de base de datos (/api/db-status): ' + (e?.message || String(e)),
      };
    }
  }, []);

  // Sync current state to PostgreSQL / Vercel Postgres in bulk
  const syncToPostgres = useCallback(async (customPayload?: any) => {
    try {
      const payloadToSync = customPayload || stateRef.current;
      const res = await fetch('/api/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSync),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: '¡Datos sincronizados y subidos exitosamente a PostgreSQL en Vercel!',
        };
      }
      const errData = await res.json().catch(() => ({ error: 'Error desconocido del servidor' }));
      return {
        success: false,
        message: `Error al subir a PostgreSQL: ${errData.error || res.statusText}`,
      };
    } catch (e: any) {
      console.warn('Bulk sync to PostgreSQL info:', e);
      return {
        success: false,
        message: `Error de conexión con la API de Vercel/Postgres: ${e?.message || String(e)}`,
      };
    }
  }, []);

  // Initial load & Real-time Firestore + PostgreSQL Sync
  useEffect(() => {
    // 1. Load from local cache for instant initial render
    let parsedLocal: any = null;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        parsedLocal = JSON.parse(saved);
        if (parsedLocal.settings) setSettings(parsedLocal.settings);
        if (parsedLocal.clients) setClients(parsedLocal.clients);
        if (parsedLocal.projects) setProjects(parsedLocal.projects);
        if (parsedLocal.tasks) setTasks(parsedLocal.tasks);
        if (parsedLocal.services) setServices(parsedLocal.services);
        if (parsedLocal.quotes) setQuotes(parsedLocal.quotes);
        if (parsedLocal.incomes) setIncomes(parsedLocal.incomes);
        if (parsedLocal.expenses) setExpenses(parsedLocal.expenses);
        if (parsedLocal.payments) setPayments(parsedLocal.payments);
        if (parsedLocal.photoSessions) setPhotoSessions(parsedLocal.photoSessions);
        if (parsedLocal.galleries) setGalleries(parsedLocal.galleries);
        if (parsedLocal.mediaProjects) setMediaProjects(parsedLocal.mediaProjects);
        if (parsedLocal.files) setFiles(parsedLocal.files);
        if (parsedLocal.calendarEvents) setCalendarEvents(parsedLocal.calendarEvents);
        if (parsedLocal.team) setTeam(parsedLocal.team);
        if (parsedLocal.notifications) setNotifications(parsedLocal.notifications);
        if (parsedLocal.activityLogs) setActivityLogs(parsedLocal.activityLogs);
        if (parsedLocal.theme) setTheme(parsedLocal.theme);
      }
    } catch (e) {
      console.error('Error loading local state', e);
    }
    setDataLoaded(true);

    // 2. Fetch from PostgreSQL server database on mount
    refreshDataFromDb().then((dbData) => {
      // If local cache had clients that are not in the DB, push them to PostgreSQL
      if (parsedLocal && parsedLocal.clients && (!dbData?.clients || parsedLocal.clients.length > dbData.clients.length)) {
        syncToPostgres(parsedLocal);
      }
    });

    // 3. Subscribe to Firestore real-time cloud changes
    const unsubscribe = subscribeToStudioData(
      (cloudData: StudioSyncPayload) => {
        if (cloudData.settings) setSettings(cloudData.settings);
        if (cloudData.clients && cloudData.clients.length > 0) setClients(cloudData.clients);
        if (cloudData.projects && cloudData.projects.length > 0) setProjects(cloudData.projects);
        if (cloudData.tasks && cloudData.tasks.length > 0) setTasks(cloudData.tasks);
        if (cloudData.services && cloudData.services.length > 0) setServices(cloudData.services);
        if (cloudData.quotes && cloudData.quotes.length > 0) setQuotes(cloudData.quotes);
        if (cloudData.incomes && cloudData.incomes.length > 0) setIncomes(cloudData.incomes);
        if (cloudData.expenses && cloudData.expenses.length > 0) setExpenses(cloudData.expenses);
        if (cloudData.payments && cloudData.payments.length > 0) setPayments(cloudData.payments);
        if (cloudData.photoSessions && cloudData.photoSessions.length > 0) setPhotoSessions(cloudData.photoSessions);
        if (cloudData.galleries && cloudData.galleries.length > 0) setGalleries(cloudData.galleries);
        if (cloudData.mediaProjects && cloudData.mediaProjects.length > 0) setMediaProjects(cloudData.mediaProjects);
        if (cloudData.files && cloudData.files.length > 0) setFiles(cloudData.files);
        if (cloudData.calendarEvents && cloudData.calendarEvents.length > 0) setCalendarEvents(cloudData.calendarEvents);
        if (cloudData.team && cloudData.team.length > 0) setTeam(cloudData.team);
        if (cloudData.notifications && cloudData.notifications.length > 0) setNotifications(cloudData.notifications);
        if (cloudData.activityLogs && cloudData.activityLogs.length > 0) setActivityLogs(cloudData.activityLogs);
        setIsDatabaseConnected(true);
        setSyncStatus('connected');
      },
      (err) => {
        console.warn('Firestore offline / local fallback mode active:', err);
        refreshDataFromDb();
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save to local storage & Firestore on changes
  useEffect(() => {
    if (!dataLoaded) return;
    const payload = {
      settings,
      clients,
      projects,
      tasks,
      services,
      quotes,
      incomes,
      expenses,
      payments,
      photoSessions,
      galleries,
      mediaProjects,
      files,
      calendarEvents,
      team,
      notifications,
      activityLogs,
      theme,
    };

    // Save local cache
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error persisting local state', e);
    }

    // Save to Firestore Cloud Database
    saveStudioDataToFirestore(payload, currentUser?.name);
  }, [
    dataLoaded,
    settings,
    clients,
    projects,
    tasks,
    services,
    quotes,
    incomes,
    expenses,
    payments,
    photoSessions,
    galleries,
    mediaProjects,
    files,
    calendarEvents,
    team,
    notifications,
    activityLogs,
    theme,
    currentUser?.name,
  ]);

  // Sync theme attribute with document body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
    }
  }, [theme]);

  // Auth Methods
  const login = (emailInput: string, passInput: string): { success: boolean; message?: string } => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    // Check team members
    const member = team.find(m => m.email.toLowerCase() === cleanEmail);
    if (member) {
      if (member.password && member.password !== cleanPass) {
        return { success: false, message: 'Contraseña incorrecta para este usuario.' };
      }
      const authUser: AuthUser = {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        phone: member.phone,
      };
      setCurrentUser(authUser);
      setCurrentUserRole(member.role);
      setIsAuthModalOpen(false);
      addActivity('Inició sesión en el sistema', 'Sesión', member.name);
      addNotification('Sesión Iniciada', `Bienvenido de vuelta, ${member.name} (${member.role})`, 'system');
      return { success: true };
    }

    // Check clients
    const client = clients.find(c => c.email.toLowerCase() === cleanEmail);
    if (client) {
      const clientUser: AuthUser = {
        id: client.id,
        name: client.name,
        email: client.email,
        role: 'Cliente',
        avatar: client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        clientId: client.id,
      };
      setCurrentUser(clientUser);
      setCurrentUserRole('Cliente');
      setPortalClientId(client.id);
      setCurrentView('client-portal');
      setIsAuthModalOpen(false);
      addActivity('Cliente accedió al portal', 'Portal', client.name);
      return { success: true };
    }

    return { success: false, message: 'No se encontró ninguna cuenta registrada con este correo.' };
  };

  const loginAsMember = (memberId: string) => {
    const member = team.find(m => m.id === memberId) || team[0];
    if (member) {
      const authUser: AuthUser = {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        phone: member.phone,
      };
      setCurrentUser(authUser);
      setCurrentUserRole(member.role);
      setIsAuthModalOpen(false);
      addActivity('Cambió de usuario activo', 'Sesión', member.name);
      addNotification('Perfil Activo', `Sesión cambiada a ${member.name} (${member.role})`, 'system');
    }
  };

  const loginAsClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId) || clients[0];
    if (client) {
      const clientUser: AuthUser = {
        id: client.id,
        name: client.name,
        email: client.email,
        role: 'Cliente',
        avatar: client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        clientId: client.id,
      };
      setCurrentUser(clientUser);
      setCurrentUserRole('Cliente');
      setPortalClientId(client.id);
      setCurrentView('client-portal');
      setIsAuthModalOpen(false);
      addActivity('Acceso como Cliente', 'Portal', client.name);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('devjos_auth_session');
    setIsAuthModalOpen(true);
  };

  const hasAccessToView = (view: ActiveView): boolean => {
    const role = currentUser?.role || currentUserRole;
    return canAccessView(role, view);
  };

  // Helper for logging
  const addActivity = (action: string, targetType: string, targetTitle: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      userId: currentUser?.id || 'team-1',
      userName: currentUser?.name || 'Josías Lachapelle',
      action,
      targetType,
      targetTitle,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'system') => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: 'Justo ahora',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // CLIENTS CRUD + Backend Sync
  const addClient = (data: Omit<Client, 'id' | 'registeredDate'>): Client => {
    const newClient: Client = {
      ...data,
      id: 'cli-' + Date.now(),
      registeredDate: new Date().toISOString().split('T')[0],
      avatar: data.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    };
    setClients(prev => [newClient, ...prev]);
    addActivity('Registró nuevo cliente', 'Cliente', newClient.name);
    addNotification('Nuevo Cliente Registrado', `${newClient.name} (${newClient.company || 'Particular'})`, 'project');

    // Async sync to SQL backend
    syncToBackend('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    }).catch(e => { console.error('Sync client to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync client to SQL info: No se guardo en la base de datos.', 'system'); });

    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    const client = clients.find(c => c.id === id);
    if (client) {
      addActivity('Actualizó información de cliente', 'Cliente', client.name);
    }

    syncToBackend(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(e => { console.error('Sync update client to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync update client to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    if (client) {
      addActivity('Eliminó cliente', 'Cliente', client.name);
    }

    syncToBackend(`/api/clients/${id}`, { method: 'DELETE' }).catch(e => { console.error('Sync delete client to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync delete client to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  // PROJECTS CRUD + Backend Sync
  const addProject = (data: Omit<Project, 'id' | 'progress' | 'paidAmount'>): Project => {
    const newProj: Project = {
      ...data,
      id: 'proj-' + Date.now(),
      progress: 0,
      paidAmount: 0,
    };
    setProjects(prev => [newProj, ...prev]);

    // Automatically create empty payment tracking
    const newPaymentRecord: ProjectPayment = {
      id: 'pay-' + Date.now(),
      projectId: newProj.id,
      clientId: newProj.clientId,
      totalContract: newProj.price,
      advancePayment: 0,
      secondPayment: 0,
      additionalPayments: [],
      totalPaid: 0,
      totalPending: newProj.price,
      status: 'Pendiente',
    };
    setPayments(prev => [newPaymentRecord, ...prev]);

    if (settings.automationRules.autoFolderStructure) {
      const defaultFolders: FileFolder[] = ['Cotización', 'Contrato', 'Diseños', 'Fotografías', 'Videos', 'Entrega'];
      const newFiles: ProjectFile[] = defaultFolders.map((f, i) => ({
        id: `file-init-${Date.now()}-${i}`,
        clientId: newProj.clientId,
        projectId: newProj.id,
        folder: f,
        name: `Carpeta-${f}.dir`,
        size: '0 KB',
        type: 'Carpeta',
        uploadDate: new Date().toISOString().split('T')[0],
        url: '#',
        nasSynced: true,
      }));
      setFiles(prev => [...newFiles, ...prev]);
    }

    addActivity('Creó nuevo proyecto', 'Proyecto', newProj.name);
    addNotification('Nuevo Proyecto Creado', `Proyecto "${newProj.name}" inicializado.`, 'project');

    // Async sync to SQL backend
    syncToBackend('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj),
    }).catch(e => { console.error('Sync project to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync project to SQL info: No se guardo en la base de datos.', 'system'); });

    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    const proj = projects.find(p => p.id === id);
    if (proj) {
      addActivity('Actualizó proyecto', 'Proyecto', proj.name);
    }

    syncToBackend(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(e => { console.error('Sync update project to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync update project to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const updateProjectStatus = (id: string, status: ProjectStatus) => {
    let updatedProgress = 0;
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const progress = status === 'Completado' ? 100 : status === 'Entregado' ? 95 : p.progress;
        updatedProgress = progress;
        return { ...p, status, progress };
      }
      return p;
    }));
    const proj = projects.find(p => p.id === id);
    if (proj) {
      addActivity(`Cambió estado a ${status}`, 'Proyecto', proj.name);
      addNotification('Estado de Proyecto Actualizado', `"${proj.name}" ahora está en estado "${status}".`, 'project');
    }

    syncToBackend(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, progress: updatedProgress }),
    }).catch(e => { console.error('Sync update project status to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync update project status to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const deleteProject = (id: string) => {
    const proj = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    setPayments(prev => prev.filter(p => p.projectId !== id));
    if (proj) {
      addActivity('Eliminó proyecto', 'Proyecto', proj.name);
    }

    syncToBackend(`/api/projects/${id}`, { method: 'DELETE' }).catch(e => { console.error('Sync delete project to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync delete project to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  // TASKS CRUD + Backend Sync
  const addTask = (data: Omit<Task, 'id'>): Task => {
    const newTask: Task = {
      ...data,
      id: 'task-' + Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    addActivity('Creó nueva tarea', 'Tarea', newTask.name);

    syncToBackend('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    }).catch(e => { console.error('Sync task to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync task to SQL info: No se guardo en la base de datos.', 'system'); });

    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    syncToBackend(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(e => { console.error('Sync update task to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync update task to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const toggleTaskStatus = (id: string) => {
    let nextStatus: TaskStatus = 'Pendiente';
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        nextStatus = t.status === 'Completada' ? 'Pendiente' : 'Completada';
        return { ...t, status: nextStatus };
      }
      return t;
    }));

    syncToBackend(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    }).catch(e => { console.error('Sync task status to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync task status to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    syncToBackend(`/api/tasks/${id}`, { method: 'DELETE' }).catch(e => { console.error('Sync delete task to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync delete task to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  // SERVICES CRUD
  const addService = (data: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...data,
      id: 'srv-' + Date.now(),
    };
    setServices(prev => [newService, ...prev]);
    addActivity('Agregó servicio al catálogo', 'Servicio', newService.name);

    syncToBackend('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService),
    }).catch(e => { console.error('Sync service to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync service to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    syncToBackend(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(e => { console.error('Sync update service info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync update service info: No se guardo en la base de datos.', 'system'); });
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    syncToBackend(`/api/services/${id}`, { method: 'DELETE' }).catch(e => { console.error('Sync delete service info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync delete service info: No se guardo en la base de datos.', 'system'); });
  };

  // QUOTES & AUTOMATION + Backend Sync
  const addQuote = (data: Omit<Quote, 'id' | 'quoteNumber'>): Quote => {
    const count = quotes.length + 42;
    const year = new Date().getFullYear();
    const newQuote: Quote = {
      ...data,
      id: 'qt-' + Date.now(),
      quoteNumber: `DEVJOS-COT-${year}-${String(count).padStart(3, '0')}`,
    };
    setQuotes(prev => [newQuote, ...prev]);
    addActivity('Generó cotización', 'Cotización', newQuote.quoteNumber);
    addNotification('Nueva Cotización Creada', `${newQuote.quoteNumber} para total de $${newQuote.total.toFixed(2)} USD`, 'quote');

    syncToBackend('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote),
    }).catch(e => { console.error('Sync quote to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync quote to SQL info: No se guardo en la base de datos.', 'system'); });

    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes(prev => prev.map(q => (q.id === id ? { ...q, ...updates } : q)));
    syncToBackend(`/api/quotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(e => { console.error('Sync update quote to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync update quote to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    syncToBackend(`/api/quotes/${id}`, { method: 'DELETE' }).catch(e => { console.error('Sync delete quote to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync delete quote to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const updateQuoteStatus = (id: string, status: QuoteStatus, autoTriggerProject: boolean = true) => {
    const targetQuote = quotes.find(q => q.id === id);
    if (!targetQuote) return;

    setQuotes(prev => prev.map(q => (q.id === id ? { ...q, status } : q)));
    addActivity(`Actualizó cotización a ${status}`, 'Cotización', targetQuote.quoteNumber);

    syncToBackend(`/api/quotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(e => { console.error('Sync quote status to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync quote status to SQL info: No se guardo en la base de datos.', 'system'); });

    if (status === 'Aceptada' && autoTriggerProject && settings.automationRules.autoCreateProjectOnQuoteAccept && !targetQuote.associatedProjectId) {
      const client = clients.find(c => c.id === targetQuote.clientId);
      const projectName = targetQuote.items[0]?.description.substring(0, 45) || `Proyecto ${targetQuote.quoteNumber}`;
      
      const newProj = addProject({
        name: projectName,
        clientId: targetQuote.clientId,
        category: 'Desarrollo',
        description: `Proyecto generado automáticamente a partir de la cotización aceptada ${targetQuote.quoteNumber}.`,
        price: targetQuote.subtotal,
        startDate: new Date().toISOString().split('T')[0],
        deliveryDate: targetQuote.expiryDate,
        status: 'Aprobado',
        priority: 'Alta',
        responsibleId: 'team-1',
        notes: targetQuote.notes || 'Iniciado tras aceptación de cotización.',
      });

      setQuotes(prev => prev.map(q => (q.id === id ? { ...q, associatedProjectId: newProj.id } : q)));

      if (settings.automationRules.autoCreateKickoffTasks) {
        addTask({
          name: `Kickoff & Entrega de Brief - ${client?.company || client?.name || 'Cliente'}`,
          description: 'Reunión de alineación inicial y recopilación de activos de marca.',
          projectId: newProj.id,
          responsibleId: 'team-1',
          priority: 'Alta',
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          status: 'Pendiente',
        });
        addTask({
          name: 'Estructurar wireframes / guión base',
          description: 'Primera propuesta conceptual para validación con el cliente.',
          projectId: newProj.id,
          responsibleId: 'team-3',
          priority: 'Media',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'Pendiente',
        });
      }

      if (settings.automationRules.autoRecordAdvanceDeposit) {
        const advanceAmount = Math.round(targetQuote.total * 0.5);
        addIncome({
          clientId: targetQuote.clientId,
          projectId: newProj.id,
          amount: advanceAmount,
          date: new Date().toISOString().split('T')[0],
          method: 'Transferencia',
          description: `Anticipo 50% por aceptación de cotización ${targetQuote.quoteNumber}`,
        });
      }

      addNotification(
        'Automatización DevJos Ejecutada 🚀',
        `Se creó automáticamente el proyecto "${newProj.name}" y sus tareas de inicio a partir de la cotización aprobada.`,
        'project'
      );
    }
  };

  // INCOMES & EXPENSES + Backend Sync
  const addIncome = (data: Omit<Income, 'id'>) => {
    const newInc: Income = {
      ...data,
      id: 'inc-' + Date.now(),
      invoiceNumber: data.invoiceNumber || `FAC-${new Date().getFullYear()}-${String(incomes.length + 90).padStart(3, '0')}`,
    };
    setIncomes(prev => [newInc, ...prev]);

    if (data.projectId) {
      setProjects(prev => prev.map(p => {
        if (p.id === data.projectId) {
          const newPaid = p.paidAmount + data.amount;
          return { ...p, paidAmount: newPaid };
        }
        return p;
      }));

      setPayments(prev => prev.map(pay => {
        if (pay.projectId === data.projectId) {
          const newPaid = pay.totalPaid + data.amount;
          const newPending = Math.max(0, pay.totalContract - newPaid);
          const status = newPending === 0 ? 'Pagado' : newPaid > 0 ? 'Parcial' : 'Pendiente';
          return {
            ...pay,
            totalPaid: newPaid,
            totalPending: newPending,
            status,
            lastPaymentDate: data.date,
            additionalPayments: [
              ...pay.additionalPayments,
              {
                id: 'pay-item-' + Date.now(),
                amount: data.amount,
                date: data.date,
                note: data.description,
                method: data.method,
              },
            ],
          };
        }
        return pay;
      }));
    }

    addActivity(`Registró ingreso de $${data.amount.toFixed(2)}`, 'Finanzas', data.description);
    addNotification('Pago / Ingreso Recibido 💰', `+$${data.amount.toFixed(2)} USD registrado vía ${data.method}`, 'payment');

    syncToBackend('/api/incomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInc),
    }).catch(e => { console.error('Sync income to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync income to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
    syncToBackend(`/api/incomes/${id}`, { method: 'DELETE' }).catch(e => { console.error('Sync delete income info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync delete income info: No se guardo en la base de datos.', 'system'); });
  };

  const addExpense = (data: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...data,
      id: 'exp-' + Date.now(),
    };
    setExpenses(prev => [newExp, ...prev]);
    addActivity(`Registró gasto de $${data.amount.toFixed(2)}`, 'Finanzas', data.description);

    syncToBackend('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExp),
    }).catch(e => { console.error('Sync expense to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync expense to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    syncToBackend(`/api/expenses/${id}`, { method: 'DELETE' }).catch(e => { console.error('Sync delete expense info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync delete expense info: No se guardo en la base de datos.', 'system'); });
  };

  const recordPayment = (projectId: string, amount: number, method: PaymentMethod, note: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    addIncome({
      clientId: proj.clientId,
      projectId,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      description: note || `Pago registrado para proyecto ${proj.name}`,
    });
  };

  // PHOTOGRAPHY CRUD
  const addPhotoSession = (data: Omit<PhotographySession, 'id'>): PhotographySession => {
    const newSession: PhotographySession = {
      ...data,
      id: 'ses-' + Date.now(),
    };
    setPhotoSessions(prev => [newSession, ...prev]);

    addCalendarEvent({
      title: `Sesión: ${newSession.title}`,
      type: 'Sesión fotográfica',
      startDate: newSession.date,
      endDate: newSession.date,
      time: newSession.time,
      clientId: newSession.clientId,
      projectId: newSession.projectId,
      location: newSession.location,
      description: `Sesión fotográfica de tipo ${newSession.sessionType}.`,
    });

    addActivity('Programó sesión fotográfica', 'Fotografía', newSession.title);
    addNotification('Nueva Sesión Fotográfica Agendada', `${newSession.title} para el ${newSession.date} a las ${newSession.time}`, 'session');
    return newSession;
  };

  const updatePhotoSession = (id: string, updates: Partial<PhotographySession>) => {
    setPhotoSessions(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deletePhotoSession = (id: string) => {
    setPhotoSessions(prev => prev.filter(s => s.id !== id));
  };

  // GALLERIES CRUD
  const addGallery = (data: Omit<Gallery, 'id' | 'createdAt' | 'shareToken'>): Gallery => {
    const newGal: Gallery = {
      ...data,
      id: 'gal-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      shareToken: 'devjos-gal-' + Math.random().toString(36).substring(2, 9),
    };
    setGalleries(prev => [newGal, ...prev]);
    addActivity('Creó nueva galería fotográfica', 'Fotografía', newGal.title);
    return newGal;
  };

  const updateGallery = (id: string, updates: Partial<Gallery>) => {
    setGalleries(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGallery = (id: string) => {
    setGalleries(prev => prev.filter(g => g.id !== id));
  };

  const toggleGalleryImageSelection = (galleryId: string, imageId: string) => {
    setGalleries(prev => prev.map(g => {
      if (g.id === galleryId) {
        return {
          ...g,
          images: g.images.map(img => (img.id === imageId ? { ...img, selected: !img.selected } : img)),
        };
      }
      return g;
    }));
  };

  // MULTIMEDIA CRUD
  const addMediaProject = (data: Omit<MediaProject, 'id' | 'currentVersion'>): MediaProject => {
    const newMed: MediaProject = {
      ...data,
      id: 'med-' + Date.now(),
      currentVersion: (data.versions[0]?.version || 'V1'),
    };
    setMediaProjects(prev => [newMed, ...prev]);
    addActivity('Creó proyecto audiovisual', 'Multimedia', newMed.title);
    return newMed;
  };

  const updateMediaProject = (id: string, updates: Partial<MediaProject>) => {
    setMediaProjects(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMediaProject = (id: string) => {
    setMediaProjects(prev => prev.filter(m => m.id !== id));
  };

  const addMediaVersion = (mediaId: string, notes: string, fileUrl: string = '#') => {
    setMediaProjects(prev => prev.map(m => {
      if (m.id === mediaId) {
        const nextVer: 'V1' | 'V2' | 'V3' | 'Final' = 
          m.currentVersion === 'V1' ? 'V2' : m.currentVersion === 'V2' ? 'V3' : 'Final';
        const newVersionItem = {
          version: nextVer,
          fileUrl,
          createdAt: new Date().toISOString().split('T')[0],
          notes,
          status: 'En revisión' as const,
        };
        return {
          ...m,
          currentVersion: nextVer,
          versions: [...m.versions, newVersionItem],
        };
      }
      return m;
    }));
  };

  // FILES CRUD
  const addFile = (data: Omit<ProjectFile, 'id' | 'uploadDate' | 'nasSynced'>) => {
    const newFile: ProjectFile = {
      ...data,
      id: 'file-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
      nasSynced: true,
    };
    setFiles(prev => [newFile, ...prev]);
    addActivity('Subió archivo a proyecto', 'Archivos', newFile.name);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFileFolder = (fileId: string, newFolder: FileFolder) => {
    setFiles(prev => prev.map(f => (f.id === fileId ? { ...f, folder: newFolder } : f)));
  };

  // CALENDAR CRUD
  const addCalendarEvent = (data: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...data,
      id: 'evt-' + Date.now(),
    };
    setCalendarEvents(prev => [newEvt, ...prev]);
    addActivity('Agregó evento al calendario', 'Calendario', newEvt.title);
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  // TEAM CRUD
  const addTeamMember = (data: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...data,
      id: 'team-' + Date.now(),
    };
    setTeam(prev => [...prev, newMember]);
    addActivity('Agregó integrante al equipo', 'Equipo', newMember.name);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteTeamMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  // NOTIFICATIONS
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // SETTINGS & DEMO RESET
  const updateSettings = (updates: Partial<StudioSettings>) => {
    const updatedCurrency = updates.currency || settings.currency || 'DOP';
    const updatedCurrencySymbol = updates.currencySymbol || getCurrencySymbol(updatedCurrency);
    const updated = { 
      ...settings, 
      ...updates,
      currency: updatedCurrency,
      currencySymbol: updatedCurrencySymbol,
    };
    setSettings(updated);
    addActivity('Actualizó configuración del estudio', 'Configuración', `Moneda: ${updatedCurrency} (${updatedCurrencySymbol})`);

    syncToBackend('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(e => { console.error('Sync settings to SQL info:', e); setSyncStatus('offline'); addNotification('Error de sincronizacion', 'Sync settings to SQL info: No se guardo en la base de datos.', 'system'); });
  };

  const resetToDemoData = () => {
    setSettings(initialSettings);
    setClients(initialClients);
    setProjects(initialProjects);
    setTasks(initialTasks);
    setServices(initialServices);
    setQuotes(initialQuotes);
    setIncomes(initialIncomes);
    setExpenses(initialExpenses);
    setPayments(initialPayments);
    setPhotoSessions(initialPhotoSessions);
    setGalleries(initialGalleries);
    setMediaProjects(initialMediaProjects);
    setFiles(initialFiles);
    setCalendarEvents(initialCalendarEvents);
    setTeam(initialTeam);
    setNotifications(initialNotifications);
    setActivityLogs(initialActivityLogs);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    addNotification('Datos Restaurados 🔄', 'Se restablecieron todos los datos demostrativos de DevJos Studio.', 'system');
  };

  // CALCULATE METRICS
  const currentMonthPrefix = new Date().toISOString().substring(0, 7);
  const monthlyRevenue = incomes
    .filter(i => i.date.startsWith(currentMonthPrefix) || true)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenses = expenses
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyProfit = monthlyRevenue - monthlyExpenses;

  const totalPendingReceivables = projects.reduce((acc, p) => {
    const pending = Math.max(0, p.price - (p.paidAmount || 0));
    return acc + pending;
  }, 0);

  const activeProjects = projects.filter(p => !['Completado', 'Cancelado'].includes(p.status)).length;
  const completedProjects = projects.filter(p => p.status === 'Completado').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completada').length;
  const overdueProjectsCount = projects.filter(p => {
    if (['Completado', 'Cancelado'].includes(p.status)) return false;
    return new Date(p.deliveryDate).getTime() < new Date().getTime();
  }).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isUserProfileModalOpen,
        setIsUserProfileModalOpen,
        login,
        loginAsMember,
        loginAsClient,
        logout,
        hasAccessToView,
        currentView,
        setCurrentView,
        currentUserRole,
        setCurrentUserRole,
        theme,
        setTheme,
        toggleTheme,
        isDatabaseConnected,
        syncStatus,
        refreshDataFromDb,
        testFirestoreConnection,
        forceUploadToFirestore,
        forceDownloadFromFirestore,
        syncToPostgres,
        checkVercelDbStatus,
        selectedClientId,
        setSelectedClientId,
        selectedProjectId,
        setSelectedProjectId,
        selectedQuoteId,
        setSelectedQuoteId,
        selectedGalleryId,
        setSelectedGalleryId,
        selectedMediaId,
        setSelectedMediaId,
        portalClientId,
        setPortalClientId,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        quickActionOpen,
        setQuickActionOpen,
        settings,
        clients,
        projects,
        tasks,
        services,
        quotes,
        incomes,
        expenses,
        payments,
        photoSessions,
        galleries,
        mediaProjects,
        files,
        calendarEvents,
        team,
        notifications,
        activityLogs,
        addClient,
        updateClient,
        deleteClient,
        addProject,
        updateProject,
        deleteProject,
        updateProjectStatus,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        addService,
        updateService,
        deleteService,
        addQuote,
        updateQuote,
        deleteQuote,
        updateQuoteStatus,
        addIncome,
        deleteIncome,
        addExpense,
        deleteExpense,
        recordPayment,
        addPhotoSession,
        updatePhotoSession,
        deletePhotoSession,
        addGallery,
        updateGallery,
        deleteGallery,
        toggleGalleryImageSelection,
        addMediaProject,
        updateMediaProject,
        deleteMediaProject,
        addMediaVersion,
        addFile,
        deleteFile,
        moveFileFolder,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        updateSettings,
        resetToDemoData,
        formatMoney: (amount: number | string | undefined | null, options?: { hideDecimalsIfWhole?: boolean; includeCode?: boolean }) =>
          formatCurrency(amount, settings.currency || 'DOP', options),
        currencySymbol: settings.currencySymbol || getCurrencySymbol(settings.currency || 'DOP'),
        currencyCode: (settings.currency || 'DOP').toUpperCase(),
        metrics: {
          totalClients: clients.length,
          activeProjects,
          completedProjects,
          monthlyRevenue,
          monthlyExpenses,
          monthlyProfit,
          totalPendingReceivables,
          overdueProjectsCount,
          pendingTasksCount,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
