import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Camera,
  Film,
  Users,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { EventModal } from './EventModal';
import { CalendarEvent, CalendarEventType } from '../../types';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, clients, projects } = useApp();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 7, 1)); // August 2025
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const eventTypes: { label: string; value: string; color: string }[] = [
    { label: 'Todos', value: 'all', color: 'bg-slate-700' },
    { label: 'Reuniones', value: 'Reunión', color: 'bg-blue-500' },
    { label: 'Sesiones Fotos', value: 'Sesión fotográfica', color: 'bg-cyan-400' },
    { label: 'Grabaciones', value: 'Grabación', color: 'bg-purple-500' },
    { label: 'Entregas', value: 'Entrega de proyecto', color: 'bg-emerald-500' },
  ];

  const filteredEvents = calendarEvents.filter((e) => {
    return typeFilter === 'all' || e.type === typeFilter;
  });

  // Calendar generation helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ day: d, dateStr: formatted });
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getEventBadgeClass = (type: CalendarEventType) => {
    switch (type) {
      case 'Sesión fotográfica':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Grabación':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Entrega de proyecto':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-100 px-3 capitalize font-display">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {eventTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  typeFilter === t.value
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Agendar Cita
        </button>
      </div>

      {/* Calendar Grid & Events Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Grid (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Dom</span>
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((item, index) => {
              if (!item) {
                return <div key={`empty-${index}`} className="min-h-[80px] bg-slate-950/20 rounded-xl" />;
              }

              const dayEvents = filteredEvents.filter((e) => e.startDate === item.dateStr);
              const isSelected = selectedDate === item.dateStr;

              return (
                <div
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`min-h-[80px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {item.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate border ${getEventBadgeClass(
                          ev.type
                        )}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-bold block">
                        +{dayEvents.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date & Agenda List (1 col) */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Agenda del {selectedDate}
                </h3>
                <p className="text-xs text-slate-400">Eventos y compromisos programados</p>
              </div>
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredEvents.filter((e) => !selectedDate || e.startDate === selectedDate).length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No hay eventos agendados para este día</p>
                </div>
              ) : (
                filteredEvents
                  .filter((e) => !selectedDate || e.startDate === selectedDate)
                  .map((evt) => {
                    const client = clients.find((c) => c.id === evt.clientId);
                    return (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getEventBadgeClass(evt.type)}`}>
                            {evt.type}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar evento "${evt.title}"?`)) {
                                deleteCalendarEvent(evt.id);
                              }
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-bold text-xs text-slate-100">{evt.title}</h4>

                        <div className="space-y-1 text-[11px] text-slate-400">
                          {evt.time && (
                            <p className="flex items-center gap-1.5 text-cyan-300">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              <span>{evt.time}</span>
                            </p>
                          )}
                          {evt.location && (
                            <p className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span>{evt.location}</span>
                            </p>
                          )}
                          {client && (
                            <p className="flex items-center gap-1.5">
                              <Users className="w-3 h-3 text-slate-500" />
                              <span>{client.name} ({client.company})</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar Evento para esta fecha
          </button>
        </div>
      </div>

      {/* Event Creation Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addCalendarEvent}
      />
    </div>
  );
};
