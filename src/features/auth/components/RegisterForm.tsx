'use client';
import { Phone } from 'lucide-react';
import { RequiredLabel } from '@/components/ui/required-label';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, AtSign, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

import { useAuth } from '@/hooks/use-auth';
import { registerSchema, type RegisterInput } from '@/schemas/auth.schema';

import { AuthSubmitButton } from './AuthSubmitButton';

export function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  function onSubmit(values: RegisterInput) {
    registerUser(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Stagger delayChildren={0.15} staggerChildren={0.07}>
          <StaggerItem>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Họ và tên</RequiredLabel>

                  <FormControl>
                    <div className="relative">
                      <User
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <Input
                        {...field}
                        autoComplete="name"
                        placeholder="Nguyễn Văn A"
                        className="h-11 pl-10"
                        disabled={isRegistering}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>

          <StaggerItem>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Tên đăng nhập</RequiredLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSign
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <Input
                        {...field}
                        autoComplete="username"
                        placeholder="username"
                        className="h-11 pl-10"
                        disabled={isRegistering}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>

          <StaggerItem>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Email</RequiredLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="h-11 pl-10"
                        disabled={isRegistering}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>
          <StaggerItem>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Số điện thoại</RequiredLabel>

                  <FormControl>
                    <div className="relative">
                      <Phone
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />

                      <Input
                        {...field}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0912345678"
                        className="h-11 pl-10"
                        disabled={isRegistering}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>
          <StaggerItem>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Mật khẩu</RequiredLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <PasswordInput
                        {...field}
                        autoComplete="new-password"
                        placeholder="Tối thiểu 6 ký tự"
                        className="h-11 pl-10"
                        disabled={isRegistering}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>
          <StaggerItem>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required>Nhập lại mật khẩu</RequiredLabel>

                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />

                      <PasswordInput
                        {...field}
                        autoComplete="new-password"
                        placeholder="Nhập lại mật khẩu"
                        className="h-11 pl-10"
                        disabled={isRegistering}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>
          <StaggerItem className="!mt-6">
            <AuthSubmitButton isLoading={isRegistering} loadingText="Đang tạo tài khoản">
              Tạo tài khoản
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </AuthSubmitButton>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-5 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="font-medium text-rose-600 transition hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
              >
                Đăng nhập
              </Link>
            </p>
          </StaggerItem>
        </Stagger>
      </form>
    </Form>
  );
}
