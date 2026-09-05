import { useState } from 'react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Lock, UserRound, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; fullName: string; username: string } | null;
}

export function ChangePasswordModal({ isOpen, onClose, user }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsLoading(true);
      await adminService.adminChangePassword(user.id, newPassword);
      toast.success('Đổi mật khẩu thành công');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500 w-full"></div>
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">Cấp lại mật khẩu</DialogTitle>
                <DialogDescription className="mt-1">
                  Thay đổi mật khẩu cho người dùng này.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-y border-border/50 flex items-center gap-3">
           <Avatar className="h-10 w-10 border border-background shadow-sm">
             <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || user.username}`} />
             <AvatarFallback className="bg-primary/10 text-primary font-medium">
               {getInitials(user.fullName || user.username)}
             </AvatarFallback>
           </Avatar>
           <div>
             <p className="text-sm font-semibold text-foreground">{user.fullName || 'Chưa cập nhật tên'}</p>
             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
               <UserRound className="h-3 w-3" />
               @{user.username}
             </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                placeholder="Nhập ít nhất 6 ký tự"
                className="pl-9"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className="pl-9"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                'Cập nhật mật khẩu'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
