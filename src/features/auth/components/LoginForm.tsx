'use client';

import { RequiredLabel } from '@/components/ui/required-label';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

import { useAuth } from '@/hooks/use-auth';
import { loginSchema, type LoginInput } from '@/schemas/auth.schema';

import { AuthSubmitButton } from './AuthSubmitButton';

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  function onSubmit(values: LoginInput) {
    login(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Stagger delayChildren={0.15} staggerChildren={0.08}>
          <StaggerItem>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required htmlFor="email">
                    Email
                  </RequiredLabel>
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
                        disabled={isLoggingIn}
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
                <FormItem className="mt-4">
                  <div className="flex items-center justify-between">
                    <RequiredLabel required htmlFor="password">
                      Mật khẩu
                    </RequiredLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-rose-600 transition hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                      />
                      <PasswordInput
                        {...field}
                        autoComplete="current-password"
                        placeholder="Nhập mật khẩu"
                        className="h-11 pl-10"
                        disabled={isLoggingIn}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>

          <StaggerItem className="!mt-6">
            <AuthSubmitButton isLoading={isLoggingIn} loadingText="Đang đăng nhập">
              Đăng nhập
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </AuthSubmitButton>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-6 border-t border-dashed pt-4">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Tài khoản thử nghiệm nhanh (Mật khẩu: 123456)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    form.setValue('email', 'customer@vetimate.vn');
                    form.setValue('password', '123456');
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-2 text-left font-medium transition hover:border-rose-300 hover:bg-rose-50/50 dark:border-zinc-800 dark:bg-zinc-800/50"
                >
                  <span className="block font-semibold text-zinc-800 dark:text-zinc-200">🧑‍🦰 Khách hàng</span>
                  <span className="text-[11px] text-zinc-500">customer@vetimate.vn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setValue('email', 'admin@vetimate.vn');
                    form.setValue('password', '123456');
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-2 text-left font-medium transition hover:border-rose-300 hover:bg-rose-50/50 dark:border-zinc-800 dark:bg-zinc-800/50"
                >
                  <span className="block font-semibold text-zinc-800 dark:text-zinc-200">🛡️ Quản trị viên</span>
                  <span className="text-[11px] text-zinc-500">admin@vetimate.vn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setValue('email', 'doctor@vetimate.vn');
                    form.setValue('password', '123456');
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-2 text-left font-medium transition hover:border-rose-300 hover:bg-rose-50/50 dark:border-zinc-800 dark:bg-zinc-800/50"
                >
                  <span className="block font-semibold text-zinc-800 dark:text-zinc-200">🩺 Bác sĩ thú y</span>
                  <span className="text-[11px] text-zinc-500">doctor@vetimate.vn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setValue('email', 'receptionist@vetimate.vn');
                    form.setValue('password', '123456');
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-2 text-left font-medium transition hover:border-rose-300 hover:bg-rose-50/50 dark:border-zinc-800 dark:bg-zinc-800/50"
                >
                  <span className="block font-semibold text-zinc-800 dark:text-zinc-200">📋 Lễ tân phòng khám</span>
                  <span className="text-[11px] text-zinc-500">receptionist@vetimate.vn</span>
                </button>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Chưa có tài khoản?{' '}
              <Link
                href="/register"
                className="font-medium text-rose-600 transition hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
              >
                Đăng ký ngay
              </Link>
            </p>
          </StaggerItem>
        </Stagger>
      </form>
    </Form>
  );
}
