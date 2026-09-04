'use client';

import { useState } from 'react';
import { useBilling } from '@/hooks/useBilling';
import { ClinicInvoiceDto, InvoiceStatus } from '@/types/billing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

import { Loader2, Plus, Receipt, User, Clock, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BillingSheet } from './BillingSheet';
import { customerService } from '@/services/customer.service';

export const BillingBoard = () => {
  const { invoices, isLoading, createInvoice, isCreating } = useBilling();
  const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<ClinicInvoiceDto | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchFilter = filter === 'ALL' || inv.status === filter;
    const matchSearch =
      inv.invoiceCode.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (inv.customerPhone && inv.customerPhone.includes(search));
    return matchFilter && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Chờ thanh toán</Badge>;
      case 'PAID':
        return <Badge className="bg-green-500 hover:bg-green-600">Đã thanh toán</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleOpenInvoice = (invoice: ClinicInvoiceDto) => {
    setSelectedInvoice(invoice);
    setSheetOpen(true);
  };

  const handleCreateDemoInvoice = async () => {
    try {
      const customerData = await customerService.search('', 0, 1);
      const customer = customerData.content?.[0];

      if (!customer) {
        alert('Chưa có khách hàng nào trong DB để tạo demo!');
        return;
      }

      createInvoice({
        customerId: customer.id,
        note: 'Hóa đơn Demo tự động',
        items: [
          {
            name: 'Khám tổng quát (Demo)',
            quantity: 1,
            unitPrice: 150000,
            productId: '550e8400-e29b-41d4-a716-446655440201',
          },
          {
            name: 'Siêu âm ổ bụng (Demo)',
            quantity: 1,
            unitPrice: 250000,
            productId: '550e8400-e29b-41d4-a716-446655440202',
          },
          {
            name: 'Thuốc tiêu hóa (Demo)',
            quantity: 2,
            unitPrice: 50000,
            productId: '550e8400-e29b-41d4-a716-446655440203',
          },
        ],
      });
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tạo demo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Tìm mã HĐ, tên khách, SĐT..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 rounded-md p-1">
            <Button
              variant={filter === 'ALL' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('ALL')}
            >
              Tất cả
            </Button>
            <Button
              variant={filter === 'PENDING' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('PENDING')}
              className={filter === 'PENDING' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
            >
              Chờ TT
            </Button>
            <Button
              variant={filter === 'PAID' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('PAID')}
              className={filter === 'PAID' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
            >
              Đã TT
            </Button>
          </div>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={handleCreateDemoInvoice}
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Tạo HĐ Demo
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-slate-200"
                onClick={() => handleOpenInvoice(invoice)}
              >
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                      <Receipt className="h-4 w-4" />
                      {invoice.invoiceCode}
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-800">
                        {invoice.customerName || 'Khách vãng lai'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-500">Tổng tiền</span>
                    <span className="text-lg font-bold text-slate-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(invoice.totalAmount)}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-500 border border-dashed rounded-lg">
              <Receipt className="h-8 w-8 mb-2 text-slate-300" />
              <p>Không tìm thấy hóa đơn nào</p>
            </div>
          )}
        </div>
      )}

      {selectedInvoice && (
        <BillingSheet open={sheetOpen} onOpenChange={setSheetOpen} invoice={selectedInvoice} />
      )}
    </div>
  );
};
