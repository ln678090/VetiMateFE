'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  UserRoundX,
  UsersRound,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCreateStaff,
  useDeactivateStaff,
  useStaffList,
  useUpdateStaff,
} from '@/features/staff/hooks/use-staff';
import { getApiErrorMessage } from '@/lib/axios';
import { staffFormSchema, type StaffFormValues } from '@/schemas/staff.schema';
import type {
  CreateStaffRequest,
  StaffFilters,
  StaffResponse,
  StaffRoleType,
  UpdateStaffRequest,
} from '@/types/staff';

const PAGE_SIZE = 10;

const ROLE_LABELS: Record<StaffRoleType, string> = {
  DOCTOR: 'Bác sĩ',
  RECEPTIONIST: 'Lễ tân',
  MANAGER: 'Quản lý',
  ACCOUNTANT: 'Kế toán',
  WAREHOUSE: 'Thủ kho',
  SHOP_STAFF: 'Nhân viên cửa hàng',
};

const DEFAULT_FORM_VALUES: StaffFormValues = {
  userId: '',
  fullName: '',
  phone: '',
  roleType: 'DOCTOR',
  licenseNumber: '',
  baseSalary: '0',
  commissionRate: '0',
  active: true,
};

function nullableText(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toCreateRequest(values: StaffFormValues): CreateStaffRequest {
  return {
    userId: nullableText(values.userId),
    fullName: values.fullName.trim(),
    phone: nullableText(values.phone),
    roleType: values.roleType,
    licenseNumber: nullableText(values.licenseNumber),
    baseSalary: Number(values.baseSalary),
    commissionRate: Number(values.commissionRate),
  };
}

function toUpdateRequest(values: StaffFormValues): UpdateStaffRequest {
  return {
    ...toCreateRequest(values),
    active: values.active,
  };
}

export default function StaffManagementPage() {
  const [filters, setFilters] = useState<StaffFilters>({
    keyword: undefined,
    roleType: undefined,
    active: undefined,
    page: 0,
    size: PAGE_SIZE,
  });

  const [keywordDraft, setKeywordDraft] = useState('');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const staffQuery = useStaffList(filters);
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deactivateMutation = useDeactivateStaff();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingStaffId(null);
    form.reset(DEFAULT_FORM_VALUES);
    setFormOpen(true);
  }

  function openEditForm(staff: StaffResponse) {
    setEditingStaffId(staff.id);

    form.reset({
      userId: staff.userId ?? '',
      fullName: staff.fullName,
      phone: staff.phone ?? '',
      roleType: staff.roleType,
      licenseNumber: staff.licenseNumber ?? '',
      baseSalary: String(staff.baseSalary),
      commissionRate: String(staff.commissionRate),
      active: staff.active,
    });

    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingStaffId(null);
    form.reset(DEFAULT_FORM_VALUES);
  }

  function applySearch() {
    setFilters((current) => ({
      ...current,
      keyword: keywordDraft.trim() || undefined,
      page: 0,
    }));
  }

  async function submitForm(values: StaffFormValues) {
    try {
      if (editingStaffId) {
        await updateMutation.mutateAsync({
          staffId: editingStaffId,
          request: toUpdateRequest(values),
        });

        toast.success('Cập nhật nhân viên thành công');
      } else {
        await createMutation.mutateAsync(toCreateRequest(values));

        toast.success('Tạo nhân viên thành công');
      }

      closeForm();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function deactivateStaff(staff: StaffResponse) {
    const accepted = window.confirm(`Ngừng hoạt động nhân viên "${staff.fullName}"?`);

    if (!accepted) {
      return;
    }

    try {
      await deactivateMutation.mutateAsync(staff.id);
      toast.success('Đã ngừng hoạt động nhân viên');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const page = staffQuery.data;
  const staffItems = page?.content ?? [];

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-rose-600">Quản trị nhân sự</p>

          <h1 className="text-2xl font-bold tracking-tight">Nhân viên & bác sĩ</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý hồ sơ nghiệp vụ, lương, hoa hồng và trạng thái làm việc.
          </p>
        </div>

        <Button type="button" onClick={openCreateForm}>
          <Plus className="mr-2 size-4" />
          Thêm nhân viên
        </Button>
      </header>

      <Card>
        <CardContent className="grid gap-3 pt-6 md:grid-cols-[1fr_220px_180px_auto]">
          <div className="flex gap-2">
            <Input
              value={keywordDraft}
              onChange={(event) => setKeywordDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  applySearch();
                }
              }}
              placeholder="Tên, điện thoại hoặc chứng chỉ"
            />

            <Button type="button" variant="outline" onClick={applySearch} aria-label="Tìm kiếm">
              <Search className="size-4" />
            </Button>
          </div>

          <select
            value={filters.roleType ?? ''}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                roleType: (event.target.value as StaffRoleType) || undefined,
                page: 0,
              }))
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Tất cả vai trò</option>

            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={filters.active === undefined ? '' : String(filters.active)}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                active: event.target.value === '' ? undefined : event.target.value === 'true',
                page: 0,
              }))
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Mọi trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setKeywordDraft('');
              setFilters({
                page: 0,
                size: PAGE_SIZE,
              });
            }}
          >
            Xóa lọc
          </Button>
        </CardContent>
      </Card>

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingStaffId ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(submitForm)} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Họ và tên
                  <span className="ml-0.5 text-rose-500">*</span>
                </Label>

                <Input id="fullName" {...form.register('fullName')} />

                <p className="text-xs text-destructive">
                  {form.formState.errors.fullName?.message}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleType">
                  Vai trò
                  <span className="ml-0.5 text-rose-500">*</span>
                </Label>

                <select
                  id="roleType"
                  {...form.register('roleType')}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>

                <Input id="phone" {...form.register('phone')} />

                <p className="text-xs text-destructive">{form.formState.errors.phone?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Số chứng chỉ</Label>

                <Input id="licenseNumber" {...form.register('licenseNumber')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseSalary">
                  Lương cơ bản
                  <span className="ml-0.5 text-rose-500">*</span>
                </Label>

                <Input
                  id="baseSalary"
                  type="number"
                  min="0"
                  step="1000"
                  {...form.register('baseSalary')}
                />

                <p className="text-xs text-destructive">
                  {form.formState.errors.baseSalary?.message}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">
                  Hoa hồng (%)
                  <span className="ml-0.5 text-rose-500">*</span>
                </Label>

                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...form.register('commissionRate')}
                />

                <p className="text-xs text-destructive">
                  {form.formState.errors.commissionRate?.message}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="userId">User UUID liên kết</Label>

                <Input id="userId" {...form.register('userId')} placeholder="Có thể để trống" />

                <p className="text-xs text-muted-foreground">
                  Liên kết tài khoản không tự động cấp quyền đăng nhập.
                </p>
              </div>

              {editingStaffId && (
                <label className="flex items-center gap-2 md:col-span-2">
                  <input type="checkbox" {...form.register('active')} />
                  <span className="text-sm">Nhân viên đang hoạt động</span>
                </label>
              )}

              <div className="flex justify-end gap-2 md:col-span-2">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Hủy
                </Button>

                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : 'Lưu nhân viên'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left">Nhân viên</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Điện thoại</th>
                <th className="px-4 py-3 text-right">Lương</th>
                <th className="px-4 py-3 text-right">Hoa hồng</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {staffItems.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{staff.fullName}</p>

                    {staff.licenseNumber && (
                      <p className="text-xs text-muted-foreground">
                        Chứng chỉ: {staff.licenseNumber}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3">{ROLE_LABELS[staff.roleType]}</td>

                  <td className="px-4 py-3">{staff.phone ?? '—'}</td>

                  <td className="px-4 py-3 text-right">
                    {staff.baseSalary.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="px-4 py-3 text-right">
                    {staff.commissionRate.toLocaleString('vi-VN')}%
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={staff.active ? 'text-emerald-600' : 'text-zinc-500'}>
                      {staff.active ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(staff)}
                      >
                        <Pencil className="mr-1 size-4" />
                        Sửa
                      </Button>

                      {staff.active && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={deactivateMutation.isPending}
                          onClick={() => deactivateStaff(staff)}
                        >
                          <UserRoundX className="mr-1 size-4" />
                          Ngừng
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {staffQuery.isLoading && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Đang tải danh sách nhân viên...
            </div>
          )}

          {staffQuery.isError && (
            <div className="p-10 text-center text-sm text-destructive">
              {staffQuery.error.message}
            </div>
          )}

          {!staffQuery.isLoading && !staffQuery.isError && staffItems.length === 0 && (
            <div className="grid place-items-center p-12 text-center">
              <UsersRound className="mb-3 size-10 text-zinc-300" />
              <p className="text-sm text-muted-foreground">Không tìm thấy nhân viên phù hợp.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {page && page.totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Tổng {page.totalElements} nhân viên</p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page.first}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: current.page - 1,
                }))
              }
            >
              <ChevronLeft className="size-4" />
            </Button>

            <span className="text-sm">
              Trang {page.number + 1}/{page.totalPages}
            </span>

            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page.last}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: current.page + 1,
                }))
              }
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
