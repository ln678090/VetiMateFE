'use client';

import { useEffect } from 'react';

import { Mail, UserRound, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileInput } from '@/schemas/user.schema';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';

function getInitials(name?: string, email?: string) {
  const source = name || email || 'User';

  return source
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function StaffProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile, isError } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => userService.getMyProfile(),
  });

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
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thất bại');
    }
  };

  if (loadingProfile) {
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

  const displayName = profile?.fullName || profile?.username || 'Người dùng';

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Gradient */}
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-white/20 text-2xl font-bold backdrop-blur">
              {getInitials(displayName, profile?.email)}
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">Hồ sơ cá nhân</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{displayName}</h1>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="size-4" />
                <span>{profile?.email || 'Chưa có'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grid 2 cột: Thông tin tài khoản & Đổi mật khẩu */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5 text-indigo-500" />
              Thông tin tài khoản
            </CardTitle>
            <CardDescription>Thông tin đăng nhập hiện tại.</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm flex-1 flex flex-col">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input id="email" value={profile?.email || 'Chưa có'} disabled className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên</Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register('username')} />
                {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-auto">
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500" />
              Đổi mật khẩu
            </CardTitle>
            <CardDescription>Cập nhật mật khẩu mới cho tài khoản của bạn.</CardDescription>
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
