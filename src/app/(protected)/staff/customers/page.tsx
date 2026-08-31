'use client';

import { useState } from 'react';
import { Search, Phone, User, PawPrint } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import { useCustomers } from '@/hooks/useCustomers';
import { useStaffPets } from '@/hooks/useStaffPets';
import { CustomerDto } from '@/types/clinic';
import { CustomerDetailSheet } from '@/features/staff/components/CustomerDetailSheet';

function CustomerPetTags({ customerId }: { customerId: string }) {
  const { data, isLoading } = useStaffPets(customerId, 0, 5);
  const pets = data?.content || [];

  if (isLoading) {
    return <Skeleton className="h-5 w-24 rounded-full" />;
  }

  if (pets.length === 0) {
    return <span className="text-xs text-zinc-400 italic">Chưa có thú cưng</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {pets.map((pet) => (
        <Badge key={pet.id} variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
          {pet.species === 'DOG' ? '🐶' : '🐱'} {pet.name}
        </Badge>
      ))}
      {data && data.totalElements > 5 && (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          +{data.totalElements - 5}
        </Badge>
      )}
    </div>
  );
}

export default function CustomerManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(0);
  const size = 12; // Adjusted size for grid

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);

  const { data, isLoading } = useCustomers(debouncedSearchTerm, page, size);
  const customers = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Quản lý Khách hàng & Thú cưng
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Tra cứu thông tin khách hàng, xem danh sách thú cưng và lịch sử sử dụng dịch vụ.
          </p>
        </div>
      </div>

      <div className="flex items-center w-full max-w-sm relative">
        <Search className="w-4 h-4 absolute left-3 text-zinc-400" />
        <Input
          placeholder="Tìm theo tên hoặc SĐT..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // Reset page on search
          }}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3"><Skeleton className="h-5 w-3/4" /></CardHeader>
              <CardContent className="pb-3"><Skeleton className="h-4 w-1/2" /></CardContent>
              <CardFooter><Skeleton className="h-6 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-12 text-center text-zinc-500">
          Không tìm thấy khách hàng nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              className="cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group overflow-hidden"
              onClick={() => {
                setSelectedCustomer(customer);
                setSheetOpen(true);
              }}
            >
              <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                      {customer.fullName || 'Chưa cập nhật tên'}
                    </h3>
                    <div className="flex items-center text-xs text-zinc-500 mt-1">
                      <User className="w-3 h-3 mr-1" />
                      Mã KH: {customer.id.split('-')[0].toUpperCase()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex items-center text-sm text-zinc-600">
                  <Phone className="w-4 h-4 mr-2 text-zinc-400 shrink-0" />
                  {customer.phone || 'Chưa cập nhật SĐT'}
                </div>
              </CardContent>
              <CardFooter className="bg-zinc-50/50 border-t border-zinc-100 py-3">
                <div className="flex items-center gap-2 w-full">
                  <PawPrint className="w-4 h-4 text-zinc-400 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <CustomerPetTags customerId={customer.id} />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-zinc-500">
            Trang {page + 1} / {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}

      <CustomerDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}
