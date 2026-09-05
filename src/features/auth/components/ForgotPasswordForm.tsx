'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Lock, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { RequiredLabel } from '@/components/ui/required-label';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';

import { AuthSubmitButton } from './AuthSubmitButton';

export function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Form Step 1: Send OTP to Email
  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  // Form Step 2: Verify OTP + Set New Password
  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '', otp: '', newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Send OTP
  async function handleSendEmail(values: ForgotPasswordInput) {
    setIsLoading(true);
    try {
      await authService.forgotPassword(values);
      setEmail(values.email);
      resetForm.setValue('email', values.email);
      setStep(2);
      setCountdown(60);
      toast.success('Mã xác thực OTP đã được gửi đến email của bạn!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err?.response?.data?.message || err?.message || 'Gửi mã xác thực thất bại';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Resend OTP
  async function handleResendOtp() {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await authService.forgotPassword({ email });
      setCountdown(60);
      toast.success('Đã gửi lại mã OTP mới!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err?.response?.data?.message || err?.message || 'Không thể gửi lại mã OTP';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  }

  // Handle Reset Password Submit
  async function handleResetPassword(values: ResetPasswordInput) {
    setIsLoading(true);
    try {
      await authService.resetPassword(values);
      setStep(3);
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = err?.response?.data?.message || err?.message || 'Đặt lại mật khẩu thất bại';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  // Step 3: Success Screen
  if (step === 3) {
    return (
      <div className="space-y-6 py-4 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100/50 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-9 w-9" strokeWidth={2.4} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Đặt lại mật khẩu thành công!
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Mật khẩu mới của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.
          </p>
        </div>
        <Link href="/login" className="block">
          <Button className="w-full bg-gradient-to-r from-rose-500 to-amber-500 font-semibold text-white shadow-md hover:from-rose-600 hover:to-amber-600">
            Đăng nhập ngay
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  // Step 2: OTP & New Password Form
  if (step === 2) {
    return (
      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
          <Stagger delayChildren={0.1} staggerChildren={0.07}>
            <StaggerItem>
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3.5 text-xs text-zinc-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>
                    Mã OTP đã gửi đến: <strong className="text-rose-600 dark:text-rose-400">{email}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="font-medium text-rose-600 underline hover:text-rose-700 dark:text-rose-400"
                  >
                    Đổi email
                  </button>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <FormField
                control={resetForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <RequiredLabel required htmlFor="otp">
                        Mã xác thực OTP (6 chữ số)
                      </RequiredLabel>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0 || isResending}
                        className="flex items-center gap-1 text-xs text-rose-600 transition hover:text-rose-700 disabled:opacity-50 dark:text-rose-400"
                      >
                        <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                        {countdown > 0 ? `Gửi lại sau (${countdown}s)` : 'Gửi lại mã'}
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <KeyRound
                          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                          strokeWidth={2}
                        />
                        <Input
                          {...field}
                          maxLength={6}
                          placeholder="Nhập mã 6 chữ số (VD: 123456)"
                          className="h-11 font-mono tracking-widest pl-10 text-base"
                          disabled={isLoading}
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
                control={resetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel required htmlFor="newPassword">
                      Mật khẩu mới
                    </RequiredLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                          strokeWidth={2}
                        />
                        <PasswordInput
                          {...field}
                          autoComplete="new-password"
                          placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                          className="h-11 pl-10"
                          disabled={isLoading}
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
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel required htmlFor="confirmPassword">
                      Xác nhận mật khẩu mới
                    </RequiredLabel>
                    <FormControl>
                      <div className="relative">
                        <ShieldCheck
                          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                          strokeWidth={2}
                        />
                        <PasswordInput
                          {...field}
                          autoComplete="new-password"
                          placeholder="Nhập lại mật khẩu mới"
                          className="h-11 pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </StaggerItem>

            <StaggerItem className="!mt-6">
              <AuthSubmitButton isLoading={isLoading} loadingText="Đang đặt lại mật khẩu">
                Xác nhận đổi mật khẩu
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </AuthSubmitButton>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại bước trước
                </button>
              </p>
            </StaggerItem>
          </Stagger>
        </form>
      </Form>
    );
  }

  // Step 1: Email Form
  return (
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(handleSendEmail)} className="space-y-5">
        <Stagger delayChildren={0.15} staggerChildren={0.08}>
          <StaggerItem>
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel required htmlFor="email">
                    Email tài khoản
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
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </StaggerItem>

          <StaggerItem className="!mt-6">
            <AuthSubmitButton isLoading={isLoading} loadingText="Đang gửi mã...">
              Gửi mã xác thực OTP
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </AuthSubmitButton>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Nhớ lại mật khẩu rồi?{' '}
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
