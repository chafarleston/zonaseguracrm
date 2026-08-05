import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar as CalendarIcon,
} from 'lucide-react';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const TYPE_COLORS: Record<string, string> = {
  visit: 'bg-green-100 text-green-800',
  meeting: 'bg-blue-100 text-blue-800',
  call: 'bg-yellow-100 text-yellow-800',
  follow_up: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
};

const TYPE_LABELS: Record<string, string> = {
  visit: 'Visita',
  meeting: 'Reunión',
  call: 'Llamada',
  follow_up: 'Seguimiento',
  other: 'Otro',
};

const TYPE_ICONS: Record<string, typeof CalendarIcon> = {
  visit: MapPin,
  meeting: User,
  call: Phone,
  follow_up: Clock,
  other: CalendarIcon,
};

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentApi.getAll(),
  });

  const appointments: any[] = data?.data ?? [];

  const safeDate = (value: string | undefined | null): Date | null => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (value: string | undefined | null): string => {
    const d = safeDate(value);
    if (!d) return '';
    return d.toISOString().split('T')[0];
  };

  const formatDateTime = (value: string | undefined | null): string => {
    const d = safeDate(value);
    if (!d) return 'Fecha no disponible';
    return d.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }) + ' - ' + d.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (value: string | undefined | null): string => {
    const d = safeDate(value);
    if (!d) return '--:--';
    return d.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [startingDay, daysInMonth]);

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    appointments.forEach((apt) => {
      const date = formatDate(apt.startTime);
      if (!date) return;
      if (!map[date]) map[date] = [];
      map[date].push(apt);
    });
    return map;
  }, [appointments]);

  const selectedDateAppointments = selectedDate
    ? appointmentsByDate[selectedDate.toISOString().split('T')[0]] || []
    : [];

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = safeDate(apt.startTime);
    const today = new Date();
    return aptDate ? aptDate.toDateString() === today.toDateString() : false;
  });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error al cargar las citas. Intenta de nuevo.</p>
        <Button onClick={() => refetch()} className="bg-green-600 hover:bg-green-700">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendario</h2>
          <p className="text-muted-foreground">
            {todayAppointments.length} citas hoy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(v: 'month' | 'list') => setViewMode(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">
                  {MONTHS[month]} {year}
                </h3>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoy
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'month' ? (
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  if (!day) return <div key={`empty-${index}`} />;
                  
                  const date = new Date(year, month, day);
                  const dateStr = date.toISOString().split('T')[0];
                  const dayAppointments = appointmentsByDate[dateStr] || [];
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        p-2 min-h-[80px] rounded-lg border text-left transition-colors
                        ${isSelected ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'}
                        ${isToday ? 'font-bold' : ''}
                      `}
                    >
                      <span className={`text-sm ${isToday ? 'bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className="text-xs truncate px-1 py-0.5 rounded bg-green-100 text-green-800"
                          >
                            {apt.title}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{dayAppointments.length - 2} más
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {appointments
                  .sort((a, b) => (safeDate(a.startTime)?.getTime() || 0) - (safeDate(b.startTime)?.getTime() || 0))
                  .slice(0, 20)
                  .map((apt) => {
                    const TypeIcon = TYPE_ICONS[apt.type] || CalendarIcon;
                    return (
                      <div key={apt.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0 mt-1">
                          <TypeIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{apt.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(apt.startTime)}
                          </p>
                          {apt.client && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" /> {apt.client.name}
                            </p>
                          )}
                        </div>
                        <Badge className={TYPE_COLORS[apt.type]}>
                          {TYPE_LABELS[apt.type]}
                        </Badge>
                      </div>
                    );
                  })}
                {appointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay citas programadas
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Citas del día seleccionado */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Citas - ${selectedDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}`
                : 'Citas de Hoy'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(selectedDate ? selectedDateAppointments : todayAppointments).map((apt) => {
                const TypeIcon = TYPE_ICONS[apt.type] || CalendarIcon;
                return (
                  <div key={apt.id} className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-sm">{apt.title}</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                        </span>
                      </div>
                      {apt.client && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{apt.client.name}</span>
                        </div>
                      )}
                      {apt.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{apt.location}</span>
                        </div>
                      )}
                    </div>
                    <Badge className={`mt-2 ${TYPE_COLORS[apt.type]}`}>
                      {TYPE_LABELS[apt.type]}
                    </Badge>
                  </div>
                );
              })}
              {(selectedDate ? selectedDateAppointments : todayAppointments).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay citas programadas
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
