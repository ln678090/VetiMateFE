'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Plus,
  GitMerge,
  Edit2,
  Trash2,
  PawPrint,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Weight,
  AlertTriangle,
  Activity,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { customerManagementApi } from '@/features/management/api/customer-management.api';
import type { CustomerDto, PetDto, CreateCustomerRequest, CreatePetRequest } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function getErrorMessage(err: unknown, fallback = 'Đã có lỗi xảy ra'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    if (res?.data?.message) return res.data.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function CustomersManagementPage() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  // Selected customer for viewing/managing pets
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);
  const [customerPets, setCustomerPets] = useState<PetDto[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);

  // Dialog States
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | null>(null);
  const [customerForm, setCustomerForm] = useState<CreateCustomerRequest>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  });

  const [petDialogOpen, setPetDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetDto | null>(null);
  const [petForm, setPetForm] = useState<{
    name: string;
    species: 'DOG' | 'CAT';
    breed: string;
    gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
    birthDate: string;
    weightKg: string;
    photoUrl: string;
    note: string;
  }>({
    name: '',
    species: 'DOG',
    breed: '',
    gender: 'MALE',
    birthDate: '',
    weightKg: '',
    photoUrl: '',
    note: '',
  });

  // Merge Dialog States
  const [mergeCustomerOpen, setMergeCustomerOpen] = useState(false);
  const [targetCustomerId, setTargetCustomerId] = useState('');
  const [sourceCustomerId, setSourceCustomerId] = useState('');

  const [mergePetOpen, setMergePetOpen] = useState(false);
  const [targetPetId, setTargetPetId] = useState('');
  const [sourcePetId, setSourcePetId] = useState('');

  // Load Customers
  const loadCustomers = useCallback(async (searchKw = '') => {
    try {
      setLoading(true);
      const res = await customerManagementApi.searchCustomers(searchKw, 0, 50);
      setCustomers(res.content || []);
    } catch (err: unknown) {
      toast.error('Không thể tải danh sách khách hàng: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        setLoading(true);
        const res = await customerManagementApi.searchCustomers('', 0, 50);
        if (!ignore) setCustomers(res.content || []);
      } catch (err: unknown) {
        if (!ignore) {
          toast.error('Không thể tải danh sách khách hàng: ' + getErrorMessage(err));
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers(keyword);
  };

  // Load Pets when selecting customer
  const selectCustomer = async (cust: CustomerDto) => {
    setSelectedCustomer(cust);
    try {
      setLoadingPets(true);
      const pets = await customerManagementApi.getPetsByCustomerId(cust.id);
      setCustomerPets(pets);
    } catch (err: unknown) {
      toast.error('Lỗi khi tải danh sách thú cưng: ' + getErrorMessage(err));
    } finally {
      setLoadingPets(false);
    }
  };

  // Customer Form Handlers
  const openCreateCustomer = () => {
    setEditingCustomer(null);
    setCustomerForm({ fullName: '', phone: '', email: '', address: '', note: '' });
    setCustomerDialogOpen(true);
  };

  const openEditCustomer = (cust: CustomerDto) => {
    setEditingCustomer(cust);
    setCustomerForm({
      fullName: cust.fullName || '',
      phone: cust.phone || '',
      email: cust.email || '',
      address: cust.address || '',
      note: cust.note || '',
    });
    setCustomerDialogOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.fullName.trim() || !customerForm.phone.trim()) {
      toast.error('Vui lòng nhập họ tên và số điện thoại');
      return;
    }

    try {
      if (editingCustomer) {
        await customerManagementApi.updateCustomer(editingCustomer.id, customerForm);
        toast.success('Cập nhật thông tin khách hàng thành công!');
      } else {
        await customerManagementApi.createCustomer(customerForm);
        toast.success('Thêm khách hàng mới thành công!');
      }
      setCustomerDialogOpen(false);
      loadCustomers(keyword);
      if (selectedCustomer && editingCustomer && selectedCustomer.id === editingCustomer.id) {
        setSelectedCustomer({ ...selectedCustomer, ...customerForm });
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Lỗi khi lưu khách hàng'));
    }
  };

  const handleDeleteCustomer = async (cust: CustomerDto) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${cust.fullName}" (${cust.phone}) và toàn bộ thú cưng liên quan?`)) {
      return;
    }
    try {
      await customerManagementApi.deleteCustomer(cust.id);
      toast.success('Đã xóa khách hàng thành công');
      if (selectedCustomer?.id === cust.id) {
        setSelectedCustomer(null);
        setCustomerPets([]);
      }
      loadCustomers(keyword);
    } catch (err: unknown) {
      toast.error('Lỗi khi xóa khách hàng: ' + getErrorMessage(err));
    }
  };

  // Pet Form Handlers
  const openCreatePet = () => {
    if (!selectedCustomer) return;
    setEditingPet(null);
    setPetForm({
      name: '',
      species: 'DOG',
      breed: '',
      gender: 'MALE',
      birthDate: '',
      weightKg: '',
      photoUrl: '',
      note: '',
    });
    setPetDialogOpen(true);
  };

  const openEditPet = (pet: PetDto) => {
    setEditingPet(pet);
    setPetForm({
      name: pet.name || '',
      species: pet.species || 'DOG',
      breed: pet.breed || '',
      gender: pet.gender || 'MALE',
      birthDate: pet.birthDate || '',
      weightKg: pet.weightKg ? String(pet.weightKg) : '',
      photoUrl: pet.photoUrl || '',
      note: pet.note || '',
    });
    setPetDialogOpen(true);
  };

  const handleSavePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    if (!petForm.name.trim()) {
      toast.error('Vui lòng nhập tên thú cưng');
      return;
    }

    try {
      const payload: CreatePetRequest = {
        customerId: selectedCustomer.id,
        name: petForm.name.trim(),
        species: petForm.species,
        breed: petForm.breed.trim() || null,
        gender: petForm.gender,
        birthDate: petForm.birthDate || null,
        weightKg: petForm.weightKg ? parseFloat(petForm.weightKg) : null,
        photoUrl: petForm.photoUrl.trim() || null,
        note: petForm.note.trim() || null,
      };

      if (editingPet) {
        await customerManagementApi.updatePet(editingPet.id, payload);
        toast.success('Cập nhật thông tin thú cưng thành công!');
      } else {
        await customerManagementApi.createPet(payload);
        toast.success('Thêm thú cưng mới thành công!');
      }

      setPetDialogOpen(false);
      selectCustomer(selectedCustomer);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Lỗi khi lưu thú cưng'));
    }
  };

  const handleDeletePet = async (pet: PetDto) => {
    if (!confirm(`Bạn có chắc muốn xóa thú cưng "${pet.name}"?`)) return;
    try {
      await customerManagementApi.deletePet(pet.id);
      toast.success('Đã xóa thú cưng thành công');
      if (selectedCustomer) {
        selectCustomer(selectedCustomer);
      }
    } catch (err: unknown) {
      toast.error('Lỗi khi xóa thú cưng: ' + getErrorMessage(err));
    }
  };

  // Merge Handlers
  const handleMergeCustomers = async () => {
    if (!targetCustomerId || !sourceCustomerId) {
      toast.error('Vui lòng chọn đủ 2 khách hàng');
      return;
    }
    if (targetCustomerId === sourceCustomerId) {
      toast.error('Không thể gộp 1 khách hàng vào chính họ!');
      return;
    }

    try {
      const merged = await customerManagementApi.mergeCustomers(targetCustomerId, sourceCustomerId);
      toast.success(`Đã gộp hồ sơ thành công vào khách hàng: ${merged.fullName}`);
      setMergeCustomerOpen(false);
      setTargetCustomerId('');
      setSourceCustomerId('');
      loadCustomers(keyword);
      if (selectedCustomer?.id === sourceCustomerId || selectedCustomer?.id === targetCustomerId) {
        selectCustomer(merged);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Lỗi khi gộp khách hàng'));
    }
  };

  const handleMergePets = async () => {
    if (!targetPetId || !sourcePetId) {
      toast.error('Vui lòng chọn đủ 2 thú cưng');
      return;
    }
    if (targetPetId === sourcePetId) {
      toast.error('Không thể gộp 1 thú cưng vào chính nó!');
      return;
    }

    try {
      const merged = await customerManagementApi.mergePets(targetPetId, sourcePetId);
      toast.success(`Đã gộp thú cưng thành công vào: ${merged.name}`);
      setMergePetOpen(false);
      setTargetPetId('');
      setSourcePetId('');
      if (selectedCustomer) {
        selectCustomer(selectedCustomer);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Lỗi khi gộp thú cưng'));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Users className="size-6 text-white" />
              </span>
              <Badge className="bg-white/20 text-white hover:bg-white/30">Lễ tân & Quản lý</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Hồ sơ Chủ Pet & Thú cưng</h1>
            <p className="mt-1 text-sm text-emerald-100">
              Quản lý toàn bộ hồ sơ khách hàng, thú cưng, lịch sử khám và công cụ gộp hồ sơ trùng lặp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setMergeCustomerOpen(true)}
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <GitMerge className="mr-2 size-4" />
              Gộp hồ sơ trùng
            </Button>
            <Button onClick={openCreateCustomer} className="bg-white text-emerald-700 shadow hover:bg-emerald-50">
              <Plus className="mr-2 size-4" />
              Thêm chủ nuôi mới
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Customer List */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="rounded-3xl border-slate-200/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Danh sách Khách hàng ({customers.length})</CardTitle>
              <CardDescription>Tìm kiếm theo họ tên, số điện thoại hoặc email</CardDescription>

              <form onSubmit={handleSearch} className="relative mt-2">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Nhập tên hoặc số điện thoại..."
                  className="rounded-2xl pl-9"
                />
              </form>
            </CardHeader>

            <CardContent className="space-y-2 p-3">
              {loading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Đang tải danh sách...</div>
              ) : customers.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Không tìm thấy khách hàng phù hợp.
                </div>
              ) : (
                <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
                  {customers.map((cust) => {
                    const isSelected = selectedCustomer?.id === cust.id;
                    return (
                      <div
                        key={cust.id}
                        onClick={() => selectCustomer(cust)}
                        className={`group relative cursor-pointer rounded-2xl border p-4 transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                            : 'border-slate-200/70 bg-white hover:border-emerald-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white shadow-sm">
                              {cust.fullName ? cust.fullName.charAt(0).toUpperCase() : 'K'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                                {cust.fullName}
                              </h3>
                              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Phone className="size-3 text-emerald-600" />
                                <span className="font-medium text-slate-700">{cust.phone}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-90">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-slate-500 hover:text-emerald-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditCustomer(cust);
                              }}
                            >
                              <Edit2 className="size-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-slate-500 hover:text-rose-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomer(cust);
                              }}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>

                        {cust.address && (
                          <p className="mt-2 line-clamp-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="size-3 shrink-0 text-slate-400" />
                            {cust.address}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Details & Pets */}
        <div className="space-y-6 lg:col-span-7">
          {selectedCustomer ? (
            <>
              {/* Selected Customer Header Card */}
              <Card className="rounded-3xl border-slate-200/80 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
                        {selectedCustomer.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-slate-900">{selectedCustomer.fullName}</h2>
                          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                            Khách hàng thân thiết
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Phone className="size-3 text-emerald-600" />
                            {selectedCustomer.phone}
                          </span>
                          {selectedCustomer.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="size-3" />
                              {selectedCustomer.email}
                            </span>
                          )}
                          {selectedCustomer.address && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {selectedCustomer.address}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditCustomer(selectedCustomer)}
                        className="rounded-xl border-slate-200"
                      >
                        <Edit2 className="mr-1.5 size-3.5" />
                        Sửa hồ sơ
                      </Button>
                      <Button
                        size="sm"
                        onClick={openCreatePet}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="mr-1.5 size-3.5" />
                        Thêm thú cưng
                      </Button>
                    </div>
                  </div>

                  {selectedCustomer.note && (
                    <div className="mt-4 rounded-2xl bg-amber-50/80 p-3 text-xs text-amber-900">
                      <strong>Ghi chú đặc biệt:</strong> {selectedCustomer.note}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pets Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold text-slate-900">
                    <PawPrint className="size-5 text-emerald-600" />
                    Danh sách thú cưng ({customerPets.length})
                  </h3>

                  {customerPets.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setMergePetOpen(true)}
                      className="text-xs text-slate-600 hover:text-emerald-700"
                    >
                      <GitMerge className="mr-1 size-3.5" />
                      Gộp thú cưng trùng
                    </Button>
                  )}
                </div>

                {loadingPets ? (
                  <div className="rounded-3xl border bg-white p-12 text-center text-sm text-muted-foreground">
                    Đang tải danh sách thú cưng...
                  </div>
                ) : customerPets.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <PawPrint className="mx-auto size-12 text-slate-300" />
                    <h4 className="mt-3 font-semibold text-slate-700">Chưa có thú cưng nào</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Bấm nút &quot;Thêm thú cưng&quot; ở trên để tạo hồ sơ chó, mèo cho khách hàng này.
                    </p>
                    <Button onClick={openCreatePet} className="mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="mr-1.5 size-4" />
                      Thêm thú cưng ngay
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {customerPets.map((pet) => {
                      const isDog = pet.species === 'DOG';
                      return (
                        <Card
                          key={pet.id}
                          className="group relative overflow-hidden rounded-3xl border-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {pet.photoUrl ? (
                                  <img
                                    src={pet.photoUrl}
                                    alt={pet.name}
                                    className="size-14 rounded-2xl object-cover shadow-sm ring-2 ring-emerald-500/20"
                                  />
                                ) : (
                                  <div
                                    className={`flex size-14 items-center justify-center rounded-2xl text-2xl font-bold shadow-sm ${
                                      isDog
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {isDog ? '🐕' : '🐈'}
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">
                                      {pet.name}
                                    </h4>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] ${
                                        isDog
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-rose-100 text-rose-800'
                                      }`}
                                    >
                                      {isDog ? 'Chó' : 'Mèo'}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{pet.breed || 'Chưa rõ giống'}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7 text-slate-400 hover:text-emerald-600"
                                  onClick={() => openEditPet(pet)}
                                >
                                  <Edit2 className="size-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7 text-slate-400 hover:text-rose-600"
                                  onClick={() => handleDeletePet(pet)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-2 p-4 pt-2 text-xs">
                            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2.5">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Calendar className="size-3.5 text-slate-400" />
                                <span>{pet.birthDate || 'Chưa rõ ngày sinh'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Weight className="size-3.5 text-slate-400" />
                                <span>{pet.weightKg ? `${pet.weightKg} kg` : 'Chưa cân'}</span>
                              </div>
                            </div>

                            {pet.currentHealthStatus && (
                              <div className="flex items-center gap-1.5 font-medium text-emerald-700">
                                <Activity className="size-3.5" />
                                <span>Tình trạng: {pet.currentHealthStatus}</span>
                              </div>
                            )}

                            {pet.note && (
                              <p className="line-clamp-2 text-slate-500">
                                <strong>Ghi chú:</strong> {pet.note}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-muted-foreground">
              <UserCheck className="size-12 text-slate-300" />
              <h3 className="mt-3 text-lg font-semibold text-slate-700">Chọn một khách hàng để xem chi tiết</h3>
              <p className="mt-1 max-w-sm text-sm">
                Bấm vào khách hàng ở danh sách bên trái để xem hồ sơ chi tiết, quản lý danh sách thú cưng và lịch hẹn.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Thêm / Sửa Khách hàng */}
      <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Chỉnh sửa hồ sơ khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
            <DialogDescription>Nhập thông tin liên hệ của chủ nuôi thú cưng.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCustomer} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={customerForm.fullName}
                onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                placeholder="VD: Nguyễn Văn A"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="0901234567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerForm.email || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={customerForm.address || ''}
                onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                placeholder="Số nhà, đường, phường/xã..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                value={customerForm.note || ''}
                onChange={(e) => setCustomerForm({ ...customerForm, note: e.target.value })}
                placeholder="Yêu cầu đặc biệt, lưu ý tiếp đón..."
                rows={2}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCustomerDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {editingCustomer ? 'Lưu thay đổi' : 'Tạo khách hàng'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Thêm / Sửa Thú cưng */}
      <Dialog open={petDialogOpen} onOpenChange={setPetDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPet ? `Chỉnh sửa thú cưng: ${editingPet.name}` : `Thêm thú cưng cho ${selectedCustomer?.fullName}`}
            </DialogTitle>
            <DialogDescription>Nhập đầy đủ thông tin nhận diện, giống, cân nặng và ảnh.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePet} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="petName">Tên thú cưng *</Label>
                <Input
                  id="petName"
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  placeholder="VD: Miu, Lu, Bông..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="petSpecies">Loài thú cưng *</Label>
                <Select
                  value={petForm.species}
                  onValueChange={(val: 'DOG' | 'CAT') => setPetForm({ ...petForm, species: val })}
                >
                  <SelectTrigger id="petSpecies">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOG">🐕 Chó</SelectItem>
                    <SelectItem value="CAT">🐈 Mèo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="petBreed">Giống loài</Label>
                <Input
                  id="petBreed"
                  value={petForm.breed}
                  onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                  placeholder="Poodle, Golden, Mèo Anh..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="petGender">Giới tính</Label>
                <Select
                  value={petForm.gender}
                  onValueChange={(val: 'MALE' | 'FEMALE' | 'UNKNOWN') => setPetForm({ ...petForm, gender: val })}
                >
                  <SelectTrigger id="petGender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Đực</SelectItem>
                    <SelectItem value="FEMALE">Cái</SelectItem>
                    <SelectItem value="UNKNOWN">Chưa rõ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Ngày sinh</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={petForm.birthDate}
                  onChange={(e) => setPetForm({ ...petForm, birthDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightKg">Cân nặng (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  value={petForm.weightKg}
                  onChange={(e) => setPetForm({ ...petForm, weightKg: e.target.value })}
                  placeholder="VD: 4.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl">Link ảnh đại diện (URL)</Label>
              <Input
                id="photoUrl"
                value={petForm.photoUrl}
                onChange={(e) => setPetForm({ ...petForm, photoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="petNote">Ghi chú sức khỏe / Dị ứng</Label>
              <Textarea
                id="petNote"
                value={petForm.note}
                onChange={(e) => setPetForm({ ...petForm, note: e.target.value })}
                placeholder="Dị ứng thuốc, tính khí nhút nhát, tiền sử bệnh..."
                rows={2}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setPetDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {editingPet ? 'Lưu thay đổi' : 'Thêm thú cưng'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Gộp Khách hàng trùng (Merge Customers) */}
      <Dialog open={mergeCustomerOpen} onOpenChange={setMergeCustomerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitMerge className="size-5 text-emerald-600" />
              Gộp hồ sơ khách hàng trùng lặp
            </DialogTitle>
            <DialogDescription>
              Chuyển toàn bộ thú cưng, lịch hẹn và lịch sử từ hồ sơ phụ sang hồ sơ chính, sau đó xóa hồ sơ phụ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-2xl bg-amber-50 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="size-4 text-amber-600" />
                Lưu ý quan trọng
              </div>
              <p className="mt-1">
                Hồ sơ phụ (Source) sẽ bị xóa sau khi gộp. Toàn bộ Pet và lịch hẹn sẽ được chuyển sang Hồ sơ chính (Target).
              </p>
            </div>

            <div className="space-y-2">
              <Label>1. Chọn Hồ sơ CHÍNH (Target - Giữ lại hồ sơ này) *</Label>
              <Select value={targetCustomerId} onValueChange={setTargetCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khách hàng chính..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id} disabled={c.id === sourceCustomerId}>
                      {c.fullName} - {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>2. Chọn Hồ sơ PHỤ (Source - Hồ sơ trùng cần gộp vào) *</Label>
              <Select value={sourceCustomerId} onValueChange={setSourceCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khách hàng phụ cần gộp..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id} disabled={c.id === targetCustomerId}>
                      {c.fullName} - {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeCustomerOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleMergeCustomers} className="bg-emerald-600 hover:bg-emerald-700">
              <GitMerge className="mr-1.5 size-4" />
              Xác nhận gộp hồ sơ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Gộp Thú cưng trùng (Merge Pets) */}
      <Dialog open={mergePetOpen} onOpenChange={setMergePetOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitMerge className="size-5 text-emerald-600" />
              Gộp 2 hồ sơ thú cưng trùng lặp
            </DialogTitle>
            <DialogDescription>
              Chuyển toàn bộ bệnh án, lịch sử khám và lịch hẹn từ hồ sơ Pet B sang Pet A.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>1. Chọn Pet CHÍNH (Target - Giữ lại) *</Label>
              <Select value={targetPetId} onValueChange={setTargetPetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thú cưng chính..." />
                </SelectTrigger>
                <SelectContent>
                  {customerPets.map((p) => (
                    <SelectItem key={p.id} value={p.id} disabled={p.id === sourcePetId}>
                      {p.species === 'DOG' ? '🐕' : '🐈'} {p.name} ({p.breed || 'Chưa rõ giống'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>2. Chọn Pet PHỤ (Source - Hồ sơ trùng cần gộp) *</Label>
              <Select value={sourcePetId} onValueChange={setSourcePetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thú cưng phụ..." />
                </SelectTrigger>
                <SelectContent>
                  {customerPets.map((p) => (
                    <SelectItem key={p.id} value={p.id} disabled={p.id === targetPetId}>
                      {p.species === 'DOG' ? '🐕' : '🐈'} {p.name} ({p.breed || 'Chưa rõ giống'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMergePetOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleMergePets} className="bg-emerald-600 hover:bg-emerald-700">
              <GitMerge className="mr-1.5 size-4" />
              Xác nhận gộp Pet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
