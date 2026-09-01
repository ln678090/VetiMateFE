'use client';

import { useQueue } from '@/hooks/useQueue';
import { QueueStatus, QueueTicketDto, QueueType } from '@/types/queue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

import { Loader2, Plus, ArrowRight, Check } from 'lucide-react';

interface QueueBoardProps {
  type: QueueType;
}

export const QueueBoard = ({ type }: QueueBoardProps) => {
  const { tickets, isLoading, createTicket, updateStatus, isCreating, isUpdatingStatus } = useQueue(type);

  const waiting = tickets.filter(t => t.status === 'WAITING');
  const called = tickets.filter(t => t.status === 'CALLED');
  const done = tickets.filter(t => t.status === 'DONE');

  const handleCreate = () => {
    createTicket({ queueType: type });
  };

  const handleCall = (id: string) => {
    updateStatus({ id, data: { status: 'CALLED' } });
  };

  const handleDone = (id: string) => {
    updateStatus({ id, data: { status: 'DONE' } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate} disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700">
          {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Cấp vé vãng lai
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WAITING COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-100 rounded-t-xl p-3 border-t-4 border-slate-400">
            <h3 className="font-semibold text-slate-700 flex justify-between">
              Đang chờ 
              <Badge variant="secondary">{waiting.length}</Badge>
            </h3>
          </div>
          <div className="flex flex-col gap-3 min-h-[500px] bg-slate-50/50 p-3 rounded-b-xl border border-slate-100 border-t-0">
            {waiting.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                action={
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleCall(ticket.id)}
                    disabled={isUpdatingStatus}
                  >
                    Gọi vào <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
            ))}
            {waiting.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Trống</p>}
          </div>
        </div>

        {/* CALLED COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="bg-indigo-50 rounded-t-xl p-3 border-t-4 border-indigo-500">
            <h3 className="font-semibold text-indigo-700 flex justify-between">
              Đang phục vụ
              <Badge className="bg-indigo-500">{called.length}</Badge>
            </h3>
          </div>
          <div className="flex flex-col gap-3 min-h-[500px] bg-indigo-50/20 p-3 rounded-b-xl border border-indigo-50 border-t-0">
            {called.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                action={
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-green-600 hover:bg-green-700"
                    onClick={() => handleDone(ticket.id)}
                    disabled={isUpdatingStatus}
                  >
                    Hoàn thành <Check className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
            ))}
            {called.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Trống</p>}
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="bg-green-50 rounded-t-xl p-3 border-t-4 border-green-500">
            <h3 className="font-semibold text-green-700 flex justify-between">
              Đã xong
              <Badge className="bg-green-500">{done.length}</Badge>
            </h3>
          </div>
          <div className="flex flex-col gap-3 min-h-[500px] bg-green-50/20 p-3 rounded-b-xl border border-green-50 border-t-0">
            {done.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
              />
            ))}
            {done.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Trống</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketCard = ({ ticket, action }: { ticket: QueueTicketDto, action?: React.ReactNode }) => {
  return (
    <Card className="p-4 shadow-sm border-slate-200">
      <div className="flex justify-between items-start mb-2">
        <div className="bg-slate-100 text-slate-800 font-mono text-2xl font-bold px-3 py-1 rounded-lg">
          #{ticket.ticketNumber}
        </div>
        <div className="text-xs text-slate-500 text-right">
          <div>{format(new Date(ticket.createdAt), 'HH:mm')}</div>
          {ticket.calledAt && <div>Gọi: {format(new Date(ticket.calledAt), 'HH:mm')}</div>}
        </div>
      </div>
      
      {ticket.customerName ? (
        <div className="mt-3 text-sm space-y-1">
          <div className="font-medium text-slate-700">{ticket.customerName}</div>
          {ticket.petName && (
            <div className="text-slate-500">Thú cưng: <span className="font-medium text-slate-700">{ticket.petName}</span></div>
          )}
          {ticket.serviceName && (
            <div className="text-indigo-600 font-medium truncate" title={ticket.serviceName}>
              {ticket.serviceName}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 text-sm italic text-slate-500">
          Khách vãng lai (Chờ khám)
        </div>
      )}
      
      {action}
    </Card>
  );
};
