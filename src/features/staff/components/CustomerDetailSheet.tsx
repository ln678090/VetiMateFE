'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { CustomerDto } from '@/types/clinic';
import { useStaffPets } from '@/hooks/useStaffPets';
import { useCustomerAppointments } from '@/hooks/useCustomerAppointments';

interface CustomerDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerDto | null;
}

export function CustomerDetailSheet({ open, onOpenChange, customer }: CustomerDetailSheetProps) {
  const { data: petsData, isLoading: isLoadingPets } = useStaffPets(customer?.id || '');
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useCustomerAppointments(
    customer?.id || ''
  );

  if (!customer) return null;

  const pets = petsData?.content || [];
  const appointments = appointmentsData?.content || [];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-hidden flex flex-col">
          <SheetHeader className="shrink-0 mb-4">
            <SheetTitle>Chi tiết Khách hàng</SheetTitle>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-4 mb-6 shrink-0 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Họ và tên</p>
              <p className="font-semibold text-slate-900">{customer.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Số điện thoại</p>
              <p className="font-semibold text-slate-900">{customer.phone}</p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="pets" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 shrink-0">
                <TabsTrigger value="pets">Danh sách Thú cưng</TabsTrigger>
                <TabsTrigger value="history">Lịch sử Hẹn / Dịch vụ</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 mt-4">
                <TabsContent value="pets" className="m-0 space-y-4 pr-4">
                  {isLoadingPets ? (
                    <div className="space-y-3">
                      <Skeleton className="h-24 w-full rounded-xl" />
                      <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                  ) : pets.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                      Khách hàng chưa có thú cưng nào.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {pets.map((pet) => (
                        <div
                          key={pet.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm"
                        >
                          <div>
                            <h4 className="font-semibold text-lg text-slate-800">{pet.name}</h4>
                            <p className="text-sm text-slate-500">
                              {pet.species === 'DOG' ? 'Chó' : 'Mèo'} •{' '}
                              {pet.breed || 'Không rõ giống'} •{' '}
                              {pet.gender === 'MALE'
                                ? 'Đực'
                                : pet.gender === 'FEMALE'
                                  ? 'Cái'
                                  : 'Chưa rõ giới tính'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="m-0 pr-4">
                  {isLoadingAppointments ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full rounded-xl" />
                      <Skeleton className="h-20 w-full rounded-xl" />
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                      Chưa có lịch sử hẹn nào.
                    </div>
                  ) : (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                      {appointments.map((apt) => {
                        const date = new Date(apt.startAt);
                        return (
                          <div key={apt.id} className="relative flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white shadow-sm shrink-0 z-10 relative">
                              <svg
                                className="fill-current w-4 h-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 12 12"
                              >
                                <path d="M12 10v2H7V8.496a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V12H0V4.496a.5.5 0 0 1 .206-.4l5.5-4a.5.5 0 0 1 .588 0l5.5 4a.5.5 0 0 1 .206.4V10Z" />
                              </svg>
                            </div>
                            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="font-bold text-slate-900 text-base leading-tight">
                                  {apt.serviceName}
                                </div>
                                <time className="font-medium text-indigo-600 text-sm whitespace-nowrap bg-indigo-50 px-2 py-0.5 rounded-full">
                                  {format(date, 'dd/MM/yyyy - HH:mm', { locale: vi })}
                                </time>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                <span className="text-slate-500 text-sm">
                                  Thú cưng:{' '}
                                  <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                    {apt.petName}
                                  </span>
                                </span>
                                <Badge
                                  variant={apt.status === 'DONE' ? 'default' : 'secondary'}
                                  className={
                                    apt.status === 'DONE' ? 'bg-green-500 hover:bg-green-600' : ''
                                  }
                                >
                                  {apt.status === 'DONE' ? 'Đã xong' : apt.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
