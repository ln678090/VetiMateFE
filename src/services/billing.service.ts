import { api, unwrap } from '@/lib/axios';
import { ApiResp } from '@/types/api';
import { ClinicInvoiceDto, CreateClinicInvoiceReq, PayClinicInvoiceReq } from '@/types/billing';

const INVOICES_URL = '/api/clinic/invoices';

export const billingService = {
  getAllInvoices: async (): Promise<ClinicInvoiceDto[]> => {
    return unwrap(api.get<ApiResp<ClinicInvoiceDto[]>>(INVOICES_URL));
  },

  getInvoiceById: async (id: string): Promise<ClinicInvoiceDto> => {
    return unwrap(api.get<ApiResp<ClinicInvoiceDto>>(`${INVOICES_URL}/${id}`));
  },

  createInvoice: async (data: CreateClinicInvoiceReq): Promise<ClinicInvoiceDto> => {
    return unwrap(api.post<ApiResp<ClinicInvoiceDto>>(INVOICES_URL, data));
  },

  payInvoice: async (id: string, data: PayClinicInvoiceReq): Promise<ClinicInvoiceDto> => {
    return unwrap(api.put<ApiResp<ClinicInvoiceDto>>(`${INVOICES_URL}/${id}/pay`, data));
  },

  cancelInvoice: async (id: string): Promise<ClinicInvoiceDto> => {
    return unwrap(api.put<ApiResp<ClinicInvoiceDto>>(`${INVOICES_URL}/${id}/cancel`));
  },
};
