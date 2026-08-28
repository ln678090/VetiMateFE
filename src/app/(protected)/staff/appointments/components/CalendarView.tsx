"use client";

import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { useManagementAppointments, useUpdateAppointmentCallStatus, useUpdateAppointmentStatus } from '@/features/booking/hooks/use-clinic';
import { AppointmentStatus, AppointmentDto } from '@/types/clinic';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Phone, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CalendarView() {
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: appointmentsPage, isLoading } = useManagementAppointments({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    size: 1000,
  });

  const updateStatus = useUpdateAppointmentStatus();
  const updateCallStatus = useUpdateAppointmentCallStatus();

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);

  const events = useMemo(() => {
    if (!appointmentsPage?.content) return [];
    
    return appointmentsPage.content.map(apt => {
      let color = '#3b82f6'; // blue (SCHEDULED)
      if (apt.status === 'CONFIRMED') color = '#eab308'; // yellow
      if (apt.status === 'DONE') color = '#22c55e'; // green
      if (apt.status === 'CANCELLED' || apt.status === 'NO_SHOW') color = '#ef4444'; // red
      if (apt.status === 'ARRIVED') color = '#10b981'; // emerald

      return {
        id: apt.id,
        title: `${apt.customerName} - ${apt.petName} (${apt.serviceName})`,
        start: apt.startAt,
        end: apt.endAt,
        backgroundColor: color,
        borderColor: color,
        extendedProps: { ...apt },
      };
    });
  }, [appointmentsPage]);

  const handleDatesSet = (arg: any) => {
    // FullCalendar datesSet is called on view render or date range change
    const newStart = format(arg.start, 'yyyy-MM-dd');
    const newEnd = format(arg.end, 'yyyy-MM-dd');
    setDateRange(prev => {
      if (prev.startDate === newStart && prev.endDate === newEnd) return prev;
      return { startDate: newStart, endDate: newEnd };
    });
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedAppointment(clickInfo.event.extendedProps as AppointmentDto);
  };

  const handleUpdateStatus = (status: AppointmentStatus) => {
    if (!selectedAppointment) return;
    
    updateStatus.mutate(
      { appointmentId: selectedAppointment.id, status },
      {
        onSuccess: () => {
          toast.success('Cập nhật trạng thái thành công');
          setSelectedAppointment(prev => prev ? { ...prev, status } : null);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Cập nhật thất bại');
        },
      }
    );
  };

  const handleUpdateCallStatus = (isCalled: boolean) => {
    if (!selectedAppointment) return;
    
    updateCallStatus.mutate(
      { appointmentId: selectedAppointment.id, isCalled },
      {
        onSuccess: () => {
          toast.success('Cập nhật trạng thái gọi điện thành công');
          setSelectedAppointment(prev => prev ? { ...prev, isCalledToConfirm: isCalled } : null);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Cập nhật thất bại');
        },
      }
    );
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="min-h-[600px]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locales={[viLocale]}
          locale="vi"
          events={events}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          height="auto"
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          nowIndicator={true}
        />
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-zinc-500">Khách hàng:</span>
                <span className="col-span-2 font-semibold">{selectedAppointment.customerName}</span>
                
                <span className="font-medium text-zinc-500">Thú cưng:</span>
                <span className="col-span-2">{selectedAppointment.petName}</span>
                
                <span className="font-medium text-zinc-500">Dịch vụ:</span>
                <span className="col-span-2">{selectedAppointment.serviceName}</span>
                
                <span className="font-medium text-zinc-500">Thời gian:</span>
                <span className="col-span-2">
                  {format(parseISO(selectedAppointment.startAt), 'HH:mm dd/MM/yyyy')}
                </span>
                
                <span className="font-medium text-zinc-500">Trạng thái:</span>
                <span className="col-span-2 flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    selectedAppointment.status === 'SCHEDULED' && "border-blue-500 text-blue-500",
                    selectedAppointment.status === 'CONFIRMED' && "border-yellow-500 text-yellow-500",
                    selectedAppointment.status === 'ARRIVED' && "border-emerald-500 text-emerald-500",
                    selectedAppointment.status === 'DONE' && "border-green-500 text-green-500",
                    (selectedAppointment.status === 'CANCELLED' || selectedAppointment.status === 'NO_SHOW') && "border-red-500 text-red-500"
                  )}>
                    {selectedAppointment.status}
                  </Badge>
                </span>
              </div>

              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className={cn("h-4 w-4", selectedAppointment.isCalledToConfirm ? "text-green-500" : "text-zinc-400")} />
                    <span className="text-sm font-medium">Xác nhận gọi điện:</span>
                  </div>
                  <Button 
                    variant={selectedAppointment.isCalledToConfirm ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleUpdateCallStatus(!selectedAppointment.isCalledToConfirm)}
                    disabled={updateCallStatus.isPending}
                  >
                    {selectedAppointment.isCalledToConfirm ? 'Đã gọi' : 'Đánh dấu đã gọi'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-medium">Cập nhật trạng thái:</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleUpdateStatus('SCHEDULED')}
                  >
                    <Clock className="mr-2 h-4 w-4" /> Đặt lịch
                  </Button>
                  <Button 
                    size="sm" variant="outline"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    onClick={() => handleUpdateStatus('CONFIRMED')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận
                  </Button>
                  <Button 
                    size="sm" variant="outline"
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleUpdateStatus('ARRIVED')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Đã đến
                  </Button>
                  <Button 
                    size="sm" variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => handleUpdateStatus('DONE')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Hoàn thành
                  </Button>
                  <Button 
                    size="sm" variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => handleUpdateStatus('NO_SHOW')}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Không đến
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
