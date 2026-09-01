import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { QuickActionModal } from './components/layout/QuickActionModal';
import { LoginView } from './components/auth/LoginView';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { AccessRestrictedView } from './components/auth/AccessRestrictedView';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ClientsView } from './components/clients/ClientsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { TasksView } from './components/tasks/TasksView';
import { ServicesView } from './components/services/ServicesView';
import { QuotesView } from './components/quotes/QuotesView';
import { PaymentsView } from './components/payments/PaymentsView';
import { FinanceView } from './components/finance/FinanceView';
import { PhotographyView } from './components/photography/PhotographyView';
import { MultimediaView } from './components/multimedia/MultimediaView';
import { ContentPlannerView } from './components/content/ContentPlannerView';
import { FilesView } from './components/files/FilesView';
import { CalendarView } from './components/calendar/CalendarView';
import { TeamView } from './components/team/TeamView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ClientPortalView } from './components/portal/ClientPortalView';

// Quick Creation Modals
import { ClientModal } from './components/clients/ClientModal';
import { ProjectModal } from './components/projects/ProjectModal';
import { TaskModal } from './components/tasks/TaskModal';
import { QuoteBuilderModal } from './components/quotes/QuoteBuilderModal';
import { IncomeModal } from './components/finance/IncomeModal';
import { ExpenseModal } from './components/finance/ExpenseModal';
import { PhotoSessionModal } from './components/photography/PhotoSessionModal';
import { X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentView,
    currentUser,
    hasAccessToView,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    addClient,
    addProject,
    addTask,
    addQuote,
    addIncome,
    addExpense,
    addPhotoSession,
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Quick Action Sub-Modals
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [isNewIncomeModalOpen, setIsNewIncomeModalOpen] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  // If no user is authenticated at all, show login view
  if (!currentUser) {
    return <LoginView />;
  }

  const renderCurrentView = () => {
    // Permission check: if role cannot access this view, show friendly restriction shield
    if (!hasAccessToView(currentView)) {
      return <AccessRestrictedView />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientsView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <TasksView />;
      case 'services':
        return <ServicesView />;
      case 'quotes':
        return <QuotesView />;
      case 'payments':
        return <PaymentsView />;
      case 'finance':
        return <FinanceView />;
      case 'files':
        return <FilesView />;
      case 'photography':
        return <PhotographyView />;
      case 'multimedia':
        return <MultimediaView />;
      case 'content':
        return <ContentPlannerView />;
      case 'calendar':
        return <CalendarView />;
      case 'team':
        return <TeamView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'client-portal':
        return <ClientPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#07152f] text-slate-100 overflow-hidden font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {renderCurrentView()}
        </main>
      </div>

      {/* User Profile / Account Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />

      {/* Modal Switch User / Login Popup */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <LoginView onSuccess={() => setIsAuthModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <QuickActionModal
        onOpenNewClient={() => setIsNewClientModalOpen(true)}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        onOpenNewQuote={() => setIsNewQuoteModalOpen(true)}
        onOpenNewIncome={() => setIsNewIncomeModalOpen(true)}
        onOpenNewExpense={() => setIsNewExpenseModalOpen(true)}
        onOpenNewSession={() => setIsNewSessionModalOpen(true)}
      />

      {/* Quick Action Dedicated Modals */}
      <ClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSave={(data) => {
          addClient(data);
          setIsNewClientModalOpen(false);
        }}
      />

      <ProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSave={(data) => {
          addProject(data);
          setIsNewProjectModalOpen(false);
        }}
      />

      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSave={(data) => {
          addTask(data);
          setIsNewTaskModalOpen(false);
        }}
      />

      <QuoteBuilderModal
        isOpen={isNewQuoteModalOpen}
        onClose={() => setIsNewQuoteModalOpen(false)}
        onSave={(data) => {
          addQuote(data);
          setIsNewQuoteModalOpen(false);
        }}
      />

      <IncomeModal
        isOpen={isNewIncomeModalOpen}
        onClose={() => setIsNewIncomeModalOpen(false)}
        onSave={(data) => {
          addIncome(data);
          setIsNewIncomeModalOpen(false);
        }}
      />

      <ExpenseModal
        isOpen={isNewExpenseModalOpen}
        onClose={() => setIsNewExpenseModalOpen(false)}
        onSave={(data) => {
          addExpense(data);
          setIsNewExpenseModalOpen(false);
        }}
      />

      <PhotoSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onSave={(data) => {
          addPhotoSession(data);
          setIsNewSessionModalOpen(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
      <Analytics />
    </AppProvider>
  );
}
