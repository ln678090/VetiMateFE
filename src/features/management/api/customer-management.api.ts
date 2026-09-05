import { api, unwrap } from '@/lib/axios';
import type {
  CustomerDto,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  MergeCustomerRequest,
  MergePetRequest,
  PetDto,
  CreatePetRequest,
  UpdatePetRequest,
  SpringPage,
} from '@/types/clinic';

export const customerManagementApi = {
  // Tìm kiếm / Phân trang danh sách khách hàng
  async searchCustomers(keyword?: string, page = 0, size = 20): Promise<SpringPage<CustomerDto>> {
    return unwrap<SpringPage<CustomerDto>>(
      api.get('/api/clinic/customers', {
        params: { keyword: keyword || undefined, page, size, sort: 'createdAt,desc' },
      })
    );
  },

  // Lấy chi tiết khách hàng
  async getCustomerById(id: string): Promise<CustomerDto> {
    return unwrap<CustomerDto>(api.get(`/api/clinic/customers/${id}`));
  },

  // Tạo khách hàng mới
  async createCustomer(body: CreateCustomerRequest): Promise<CustomerDto> {
    return unwrap<CustomerDto>(api.post('/api/clinic/customers', body));
  },

  // Cập nhật thông tin khách hàng
  async updateCustomer(id: string, body: UpdateCustomerRequest): Promise<CustomerDto> {
    return unwrap<CustomerDto>(api.put(`/api/clinic/customers/${id}`, body));
  },

  // Xóa khách hàng
  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/api/clinic/customers/${id}`);
  },

  // Gộp 2 hồ sơ khách hàng trùng
  async mergeCustomers(targetId: string, sourceId: string): Promise<CustomerDto> {
    const body: MergeCustomerRequest = { targetId, sourceId };
    return unwrap<CustomerDto>(api.post('/api/clinic/customers/merge', body));
  },

  // Lấy danh sách thú cưng của khách hàng
  async getPetsByCustomerId(customerId: string): Promise<PetDto[]> {
    const res = await unwrap<PetDto[] | SpringPage<PetDto>>(
      api.get('/api/clinic/pets', { params: { customerId, size: 50 } })
    );
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as SpringPage<PetDto>).content)) {
      return (res as SpringPage<PetDto>).content;
    }
    return [];
  },

  // Tạo thú cưng mới cho khách hàng
  async createPet(body: CreatePetRequest): Promise<PetDto> {
    return unwrap<PetDto>(api.post('/api/clinic/pets', body));
  },

  // Cập nhật thú cưng
  async updatePet(id: string, body: UpdatePetRequest): Promise<PetDto> {
    return unwrap<PetDto>(api.put(`/api/clinic/pets/${id}`, body));
  },

  // Xóa thú cưng
  async deletePet(id: string): Promise<void> {
    await api.delete(`/api/clinic/pets/${id}`);
  },

  // Gộp 2 thú cưng trùng
  async mergePets(targetId: string, sourceId: string): Promise<PetDto> {
    const body: MergePetRequest = { targetId, sourceId };
    return unwrap<PetDto>(api.post('/api/clinic/pets/merge', body));
  },
};
