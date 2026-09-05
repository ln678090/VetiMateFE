'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import {
  Mail,
  UserRound,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileInput } from '@/schemas/user.schema';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMyCustomer } from '@/features/booking/hooks/use-clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth.store';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';
type ProfileUser = {
  id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  roles?: Array<string | { name?: string }>;
};

function getInitials(name?: string, email?: string) {
  const source = name || email || 'User';

  return source
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: customer, isLoading: loadingCustomer, isError: customerError } = useMyCustomer();
  const {
    data: profile,
    isLoading: loadingProfile,
    isError: profileError,
  } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => userService.getMyProfile(),
  });

  const isError = customerError || profileError;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
    },
  });

  // Cập nhật giá trị form khi load xong profile
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        username: profile.username || '',
        phone: profile.phone || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      await userService.updateProfile(data);
      toast.success('Cập nhật hồ sơ thành công');
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    } catch (error: unknown) {
      // Đổi thành unknown
      const apiError = error as Error; // Ép kiểu sang Error chuẩn
      toast.error(apiError.message || 'Cập nhật thất bại');
    }
  };

  if (loadingCustomer || loadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!profile && isError) {
    return (
      <div className="rounded-3xl border bg-white/80 p-6">
        <h1 className="text-xl font-semibold">Không tải được hồ sơ</h1>
        <p className="mt-2 text-muted-foreground">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const displayName = profile?.fullName || customer?.fullName || profile?.username || 'Người dùng';

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* 1. Header Banner Gradient */}
      <section className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 p-6 text-white shadow-xl shadow-rose-200/50">
        {/* Decorative background shapes */}
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-orange-200/20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-md ring-4 ring-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-transform duration-500 hover:scale-105 hover:rotate-3 cursor-default">
              {getInitials(displayName, profile?.email)}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">Hồ sơ cá nhân</p>
              <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-sm">{displayName}</h1>
              <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/10 w-fit px-2.5 py-1 rounded-full backdrop-blur-sm mt-1">
                <Mail className="size-3.5" />
                <span>{profile?.email || 'Chưa có'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grid 2 cột: Thông tin tài khoản & Đổi mật khẩu */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Thông tin */}
        <Card className="rounded-3xl h-full flex flex-col border-white/60 bg-white/70 shadow-xl shadow-rose-100/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-100/60 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-500 shadow-inner">
                <UserRound className="size-6" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">Thông định danh hiện tại của bạn.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-sm flex-1 flex flex-col"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  value={profile?.email || 'Chưa có'}
                  disabled
                  className="bg-muted/50 rounded-xl h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-medium">Họ tên</Label>
                <Input id="fullName" {...register('fullName')} className="rounded-xl h-10" />
                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="font-medium">Username</Label>
                <Input id="username" {...register('username')} className="rounded-xl h-10" />
                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full mt-4 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-200/50 hover:from-rose-600 hover:to-orange-600 hover:shadow-xl hover:shadow-rose-300/50 transition-all duration-300 h-10 text-sm font-medium"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Card Đổi mật khẩu */}
        <Card className="rounded-3xl flex flex-col h-full border-white/60 bg-white/70 shadow-xl shadow-emerald-100/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-100/60 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-500 shadow-inner">
                <ShieldCheck className="size-6" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-lg">Đổi mật khẩu</CardTitle>
                <CardDescription className="text-xs font-medium mt-0.5">Tăng cường bảo mật cho tài khoản.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <div className="mt-2 flex-1 flex flex-col">
              <ChangePasswordForm />
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
