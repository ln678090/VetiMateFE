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
  useEligibleUsers,
  useStaffList,
  useUpdateStaff,
} from '@/features/staff/hooks/use-staff';
import { getApiErrorMessage } from '@/lib/axios';
import { staffFormSchema, type StaffFormValues } from '@/schemas/staff.schema';
import type {
  CreateStaffRequest,
  EligibleUserResponse,
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
  roleType: 'DOCTOR',
  active: true,
  reason: '',
};

function toCreateRequest(values: StaffFormValues): CreateStaffRequest {
  return {
    userId: values.userId,
    roleType: values.roleType,
    reason: values.reason.trim(),
  };
}

function toUpdateRequest(values: StaffFormValues): UpdateStaffRequest {
  return {
    roleType: values.roleType,
    active: true,
    reason: values.reason.trim(),
  };
}

export default function StaffManagementPage() {
  const [filters, setFilters] = useState<StaffFilters>({
    page: 0,
    size: PAGE_SIZE,
  });

  const [keywordDraft, setKeywordDraft] = useState('');
  const [accountKeyword, setAccountKeyword] = useState('');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const staffQuery = useStaffList(filters);

  const eligibleUsersQuery = useEligibleUsers(
    {
      keyword: accountKeyword.trim() || undefined,
      page: 0,
      size: 20,
    },
    formOpen && editingStaffId === null
  );

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deactivateMutation = useDeactivateStaff();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onBlur',
  });

  const page = staffQuery.data;
  const staffItems = page?.content ?? [];
  const eligibleUsers = eligibleUsersQuery.data?.content ?? [];

  const selectedUserId = form.watch('userId');

  const submitting = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingStaffId(null);
    setAccountKeyword('');
    form.reset(DEFAULT_FORM_VALUES);
    setFormOpen(true);
  }

  function openEditForm(staff: StaffResponse) {
    if (!staff.active) {
      toast.error('Nhân viên đã ngừng hoạt động nên không thể chỉnh sửa.');
      return;
    }

    setEditingStaffId(staff.id);
    setAccountKeyword('');

    form.reset({
      userId: staff.userId,
      roleType: staff.roleType,
      active: true,
      reason: '',
    });

    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingStaffId(null);
    setAccountKeyword('');
    form.reset(DEFAULT_FORM_VALUES);
  }

  function applySearch() {
    setFilters((current) => ({
      ...current,
      keyword: keywordDraft.trim() || undefined,
      page: 0,
    }));
  }

  function resetFilters() {
    setKeywordDraft('');

    setFilters({
      page: 0,
      size: PAGE_SIZE,
    });
  }

  function selectAccount(user: EligibleUserResponse) {
    form.setValue('userId', user.id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  async function submitForm(values: StaffFormValues) {
    try {
      if (editingStaffId) {
        await updateMutation.mutateAsync({
          staffId: editingStaffId,
          request: toUpdateRequest(values),
        });

        toast.success('Cập nhật vai trò nhân viên thành công');
      } else {
        await createMutation.mutateAsync(toCreateRequest(values));

        toast.success('Tiếp nhận nhân viên thành công');
      }

      closeForm();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function deactivateStaff(staff: StaffResponse) {
    const reason = window.prompt(`Nhập lý do ngừng hoạt động của "${staff.fullName}":`);

    if (reason === null) {
      return;
    }

    const normalizedReason = reason.trim();

    if (normalizedReason.length < 10) {
      toast.error('Lý do phải có ít nhất 10 ký tự');
      return;
    }

    try {
      await deactivateMutation.mutateAsync({
        staffId: staff.id,
        request: {
          reason: normalizedReason,
        },
      });

      toast.success('Đã ngừng hoạt động nhân viên');

      if (editingStaffId === staff.id) {
        closeForm();
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-rose-600">Quản trị nhân sự</p>

          <h1 className="text-2xl font-bold tracking-tight">Nhân viên & bác sĩ</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Tiếp nhận tài khoản, phân vai trò nghiệp vụ và quản lý trạng thái làm việc.
          </p>
        </div>

        <Button type="button" onClick={openCreateForm}>
          <Plus className="mr-2 size-4" />
          Tiếp nhận nhân viên
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
                  event.preventDefault();
                  applySearch();
                }
              }}
              placeholder="Tên, username hoặc email"
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
                roleType:
                  event.target.value === '' ? undefined : (event.target.value as StaffRoleType),
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

          <Button type="button" variant="ghost" onClick={resetFilters}>
            Xóa lọc
          </Button>
        </CardContent>
      </Card>

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingStaffId ? 'Cập nhật vai trò nhân viên' : 'Tiếp nhận nhân viên'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(submitForm)} className="grid gap-4 md:grid-cols-2">
              {editingStaffId === null && (
                <div className="space-y-3 md:col-span-2">
                  <Label>
                    Tài khoản
                    <span className="ml-0.5 text-rose-500">*</span>
                  </Label>

                  <Input
                    value={accountKeyword}
                    onChange={(event) => setAccountKeyword(event.target.value)}
                    placeholder="Tìm tên, username hoặc email"
                  />

                  <div className="max-h-56 overflow-y-auto rounded-md border">
                    {eligibleUsers.map((user) => {
                      const selected = selectedUserId === user.id;

                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => selectAccount(user)}
                          className={[
                            'block w-full border-b px-4 py-3 text-left last:border-b-0',
                            selected
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
                              : 'hover:bg-muted',
                          ].join(' ')}
                        >
                          <p className="text-sm font-medium">{user.fullName}</p>

                          <p className="text-xs text-muted-foreground">
                            {user.username} — {user.email}
                          </p>

                          {user.phone && (
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          )}
                        </button>
                      );
                    })}

                    {eligibleUsersQuery.isLoading && (
                      <p className="p-4 text-sm text-muted-foreground">Đang tải tài khoản...</p>
                    )}

                    {eligibleUsersQuery.isError && (
                      <p className="p-4 text-sm text-destructive">
                        {eligibleUsersQuery.error.message}
                      </p>
                    )}

                    {!eligibleUsersQuery.isLoading &&
                      !eligibleUsersQuery.isError &&
                      eligibleUsers.length === 0 && (
                        <p className="p-4 text-sm text-muted-foreground">
                          Không có tài khoản phù hợp.
                        </p>
                      )}
                  </div>

                  <p className="text-xs text-destructive">
                    {form.formState.errors.userId?.message}
                  </p>
                </div>
              )}

              {editingStaffId !== null && (
                <div className="rounded-md border bg-muted/40 p-4 md:col-span-2">
                  <p className="text-sm font-medium">Tài khoản đã được liên kết</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Không thể thay đổi tài khoản sau khi tiếp nhận.
                  </p>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="roleType">
                  Vai trò nghiệp vụ
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

                <p className="text-xs text-destructive">
                  {form.formState.errors.roleType?.message}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">
                  Lý do
                  <span className="ml-0.5 text-rose-500">*</span>
                </Label>

                <textarea
                  id="reason"
                  rows={3}
                  {...form.register('reason')}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Ví dụ: Tiếp nhận nhân viên mới theo quyết định tuyển dụng..."
                />

                <p className="text-xs text-muted-foreground">Nội dung được lưu vào Audit Log.</p>

                <p className="text-xs text-destructive">{form.formState.errors.reason?.message}</p>
              </div>

              <div className="flex justify-end gap-2 md:col-span-2">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Hủy
                </Button>

                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? 'Đang lưu...'
                    : editingStaffId
                      ? 'Cập nhật vai trò'
                      : 'Tiếp nhận nhân viên'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left">Tài khoản</th>
                <th className="px-4 py-3 text-left">Liên hệ</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {staffItems.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{staff.fullName}</p>

                    <p className="text-xs text-muted-foreground">@{staff.username}</p>
                  </td>

                  <td className="px-4 py-3">
                    <p>{staff.email}</p>

                    <p className="text-xs text-muted-foreground">{staff.phone ?? 'Chưa có SĐT'}</p>
                  </td>

                  <td className="px-4 py-3">{ROLE_LABELS[staff.roleType]}</td>

                  <td className="px-4 py-3 text-center">
                    <span className={staff.active ? 'text-emerald-600' : 'text-zinc-500'}>
                      {staff.active ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {staff.active && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openEditForm(staff)}
                          >
                            <Pencil className="mr-1 size-4" />
                            Sửa
                          </Button>

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
                        </>
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

              <p className="text-sm text-muted-foreground">Không tìm thấy nhân viên.</p>
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
                  page: Math.max(current.page - 1, 0),
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
