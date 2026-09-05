'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAccountModal({ open, onOpenChange, onSuccess }: CreateAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    roleName: 'ROLE_USER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.fullName) {
      toast.error('Vui lòng điền các trường bắt buộc');
      return;
    }

    setLoading(true);
    try {
      await adminService.adminCreateUser(formData);
      toast.success('Tạo tài khoản thành công!');
      onSuccess();
      onOpenChange(false);
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        roleName: 'ROLE_USER',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm tài khoản mới</DialogTitle>
            <DialogDescription>
              Tạo tài khoản và cấp quyền cho người dùng trong hệ thống.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Tên đăng nhập *
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ví dụ: nguyenvanb"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Mật khẩu *
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Họ và tên *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Nguyễn Văn B"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                placeholder="nguyenvanb@example.com"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
                placeholder="09..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Vai trò *
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.roleName}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, roleName: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROLE_USER">Khách hàng (ROLE_USER)</SelectItem>
                    <SelectItem value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</SelectItem>
                    <SelectItem value="ROLE_MANAGER">Quản lý (ROLE_MANAGER)</SelectItem>
                    <SelectItem value="ROLE_DOCTOR">Bác sĩ (ROLE_DOCTOR)</SelectItem>
                    <SelectItem value="ROLE_RECEPTIONIST">Lễ tân (ROLE_RECEPTIONIST)</SelectItem>
                    <SelectItem value="ROLE_ACCOUNTANT">Kế toán (ROLE_ACCOUNTANT)</SelectItem>
                    <SelectItem value="ROLE_WAREHOUSE">Thủ kho (ROLE_WAREHOUSE)</SelectItem>
                    <SelectItem value="ROLE_SHOP_STAFF">Nhân viên Shop (ROLE_SHOP_STAFF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
