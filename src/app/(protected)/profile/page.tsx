'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { Mail, UserRound, ShieldCheck, Package, PawPrint, CalendarDays, ChevronRight } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/auth.store';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';
import { ProductCard } from '@/features/shop/components/ProductCard';

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
  const { data: profile, isLoading: loadingProfile, isError: profileError } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => userService.getMyProfile(),
  });
  
  const { data: favoritesData, isLoading: loadingFavorites } = useQuery({
    queryKey: ['my-favorites'],
    queryFn: () => userService.getFavorites(),
  });

  const { data: viewedData, isLoading: loadingViewed } = useQuery({
    queryKey: ['my-viewed'],
    queryFn: () => userService.getRecentlyViewed(),
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
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thất bại');
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

  const displayName =
    profile?.fullName || customer?.fullName || profile?.username || 'Người dùng';

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Gradient */}
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 p-6 text-white shadow-sm">
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
          {/* Đã bỏ phần Role theo yêu cầu */}
        </div>
      </section>

      {/* 2. Grid 2 cột: Thông tin tài khoản & Đổi mật khẩu */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5 text-rose-500" />
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

        <Card className="rounded-3xl flex flex-col h-full">
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

      {/* 4. Sản phẩm đã thích & Đã xem gần đây */}
      <Card className="rounded-3xl">
        <Tabs defaultValue="favorites" className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <TabsList className="bg-muted/50 rounded-2xl p-1">
              <TabsTrigger value="favorites" className="rounded-xl px-6">Sản phẩm đã thích</TabsTrigger>
              <TabsTrigger value="viewed" className="rounded-xl px-6">Đã xem gần đây</TabsTrigger>
            </TabsList>
            <Button variant="ghost" className="text-sm font-medium text-rose-600 hover:text-rose-700" asChild>
              <Link href="/profile/interactions">Xem tất cả</Link>
            </Button>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="favorites" className="mt-0">
              {loadingFavorites ? (
                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                   {Array.from({ length: 5 }).map((_, i) => (
                     <Skeleton key={i} className="h-64 rounded-2xl" />
                   ))}
                 </div>
              ) : favoritesData?.content?.length ? (
                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                   {favoritesData.content.slice(0, 5).map((product: any) => (
                     <ProductCard key={product.id} product={product} />
                   ))}
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed">
                   <Package className="size-12 text-muted-foreground/50 mb-4" />
                   <p className="text-muted-foreground">Bạn chưa có sản phẩm yêu thích nào.</p>
                 </div>
              )}
            </TabsContent>

            <TabsContent value="viewed" className="mt-0">
              {loadingViewed ? (
                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                   {Array.from({ length: 5 }).map((_, i) => (
                     <Skeleton key={i} className="h-64 rounded-2xl" />
                   ))}
                 </div>
              ) : viewedData?.content?.length ? (
                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                   {viewedData.content.slice(0, 5).map((product: any) => (
                     <ProductCard key={product.id} product={product} />
                   ))}
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed">
                   <Package className="size-12 text-muted-foreground/50 mb-4" />
                   <p className="text-muted-foreground">Chưa có sản phẩm nào được xem gần đây.</p>
                 </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 px-4 py-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-3xl transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-rose-500">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>
            Mở
            <ChevronRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
