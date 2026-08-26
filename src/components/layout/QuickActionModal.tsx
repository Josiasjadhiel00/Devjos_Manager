import React from 'react';
import {
  X,
  UserPlus,
  FolderPlus,
  PlusCircle,
  FilePlus,
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  Film,
  Calendar,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const QuickActionModal: React.FC<{
  onOpenNewClient: () => void;
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onOpenNewQuote: () => void;
  onOpenNewIncome: () => void;
  onOpenNewExpense: () => void;
  onOpenNewSession: () => void;
}> = ({
  onOpenNewClient,
  onOpenNewProject,
  onOpenNewTask,
  onOpenNewQuote,
  onOpenNewIncome,
  onOpenNewExpense,
  onOpenNewSession,
}) => {
  const { quickActionOpen, setQuickActionOpen } = useApp();

  if (!quickActionOpen) return null;

  const actions = [
    {
      label: 'Nuevo Cliente',
      desc: 'Registrar nuevo contacto o empresa en CRM',
      icon: UserPlus,
      color: 'from-blue-600 to-cyan-600',
      action: () => {
        setQuickActionOpen(false);
        onOpenNewClient();
      },
    },
    {
      label: 'Nuevo Proyecto',
      desc: 'Iniciar proyecto de desarrollo, diseño o multimedia',
      icon: FolderPlus,
      color: 'from-cyan-600 to-blue-600',
      action: () => {
        setQuickActionOpen(false);
        onOpenNewProject();
      },
    },
    {
      label: 'Nueva Cotización',
      desc: 'Generar presupuesto profesional con PDF',
      icon: FilePlus,
      color: 'from-purple-600 to-indigo-600',
      action: () => {
        setQuickActionOpen(false);
        onOpenNewQuote();
      },
    },
    {
      label: 'Nueva Tarea',
      desc: 'Asignar tarea con prioridad y fecha límite',
      icon: PlusCircle,
      color: 'from-amber-600 to-orange-600',
      action: () => {
        setQuickActionOpen(false);
        onOpenNewTask();
      },
    },
    {
      label: 'Registrar Ingreso / Pago',
      desc: 'Registrar anticipo, abono o cobro de factura',
      icon: ArrowDownRight,
      color: 'from-emerald-600 to-teal-600',
      action: () => {
        setQuickActionOpen(false);
        onOpenNewIncome();
      },
    },
    {
      label: 'Registrar Gasto',
      desc: 'Registrar gasto operativo, equipo o software',
      icon: ArrowUpRight,
      color: 'from-rose-600 to-pink-600',
      action: () => {
        setQuickActionOpen(false);
        onOpenNewExpense();
      },
    },
    {
      label: 'Nueva Sesión Fotográfica',
      desc: 'Agendar fecha, locación y fotos de cliente',
      icon: Camera,
      color: 'from-sky-600 to-blue-600',
      action: () => {
        setQuickActionOpen(false);
        onOpenNewSession();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-display font-bold text-base text-white">Crear Nuevo Elemento</h3>
            <p className="text-xs text-slate-400">Selecciona qué acción deseas realizar en DevJos Studio</p>
          </div>
          <button
            onClick={() => setQuickActionOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          {actions.map((act, index) => {
            const Icon = act.icon;
            return (
              <button
                key={index}
                onClick={act.action}
                className="p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-800/80 text-left transition-all group flex items-start gap-3"
              >
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${act.color} text-white shadow-md shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                    {act.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {act.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
