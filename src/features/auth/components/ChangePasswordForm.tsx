'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Lock, Save, Loader2 } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { RequiredLabel } from '@/components/ui/required-label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { changePasswordSchema, type ChangePasswordInput } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/axios';

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const changePasswordMutation = useMutation({
    mutationFn: (input: ChangePasswordInput) => authService.changePassword(input),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công');
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Đổi mật khẩu thất bại'));
    },
  });

  function onSubmit(values: ChangePasswordInput) {
    changePasswordMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Đổi mật khẩu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Cập nhật mật khẩu mới cho tài khoản của bạn để đảm bảo an toàn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Mật khẩu hiện tại</RequiredLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <PasswordInput
                        {...field}
                        placeholder="Nhập mật khẩu cũ"
                        className="h-11 pl-10"
                        disabled={changePasswordMutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Mật khẩu mới</RequiredLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <PasswordInput
                        {...field}
                        placeholder="Mật khẩu từ 6 ký tự trở lên"
                        className="h-11 pl-10"
                        disabled={changePasswordMutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Xác nhận mật khẩu mới</RequiredLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <PasswordInput
                        {...field}
                        placeholder="Nhập lại mật khẩu mới"
                        className="h-11 pl-10"
                        disabled={changePasswordMutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 !mt-6"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu thay đổi...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
