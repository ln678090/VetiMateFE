'use client';

import { useEffect, useState } from 'react';
import { adminService, UserAdminResp } from '@/services/admin.service';
import { PageResp } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreHorizontal,
  KeyRound,
  ShieldAlert,
  Search,
  Filter,
  UsersRound,
  Mail,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { CreateAccountModal } from './components/CreateAccountModal';

export default function AccountsManagementPage() {
  const [data, setData] = useState<PageResp<UserAdminResp>>({
    content: [],
    pageNo: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserAdminResp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAllUsers(0, 50); // Lấy tối đa 50 user để demo
      setData(res);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePasswordClick = (user: UserAdminResp) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user: UserAdminResp) => {
    try {
      await adminService.adminToggleUserStatus(user.id);
      toast.success(user.enabled ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản thành công');
      // Update local state
      setData((prev: PageResp<UserAdminResp>) => ({
        ...prev,
        content: prev.content.map((u: UserAdminResp) => 
          u.id === user.id ? { ...u, enabled: !u.enabled } : u
        )
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getRoleLabel = (roleStr: string) => {
    const roleMap: Record<string, { label: string, color: string }> = {
      ROLE_ADMIN: { label: 'Quản trị viên', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      ROLE_MANAGER: { label: 'Quản lý', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      ROLE_DOCTOR: { label: 'Bác sĩ', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      ROLE_RECEPTIONIST: { label: 'Lễ tân', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      ROLE_ACCOUNTANT: { label: 'Kế toán', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      ROLE_SHOP_STAFF: { label: 'Nhân viên Shop', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      ROLE_USER: { label: 'Khách hàng', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    };
    return roleMap[roleStr] || { label: roleStr, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredUsers = data.content.filter((user: UserAdminResp) => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <UsersRound className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Quản lý Tài khoản</h1>
            <p className="text-muted-foreground mt-1">
              Hệ thống có tổng cộng <span className="font-medium text-foreground">{data.totalElements}</span> người dùng
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-background">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </Button>
          <Button className="gap-2 shadow-sm" onClick={() => setIsCreateModalOpen(true)}>
            <UsersRound className="h-4 w-4" />
            Thêm tài khoản mới
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              Danh sách Người dùng
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, email, username..."
                className="w-full pl-9 bg-background focus-visible:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] py-4 whitespace-nowrap">Người dùng</TableHead>
                <TableHead className="whitespace-nowrap">Liên hệ</TableHead>
                <TableHead className="whitespace-nowrap">Vai trò</TableHead>
                <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
                <TableHead className="whitespace-nowrap">Ngày tham gia</TableHead>
                <TableHead className="text-right whitespace-nowrap">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-2"></div>
                      Đang tải dữ liệu...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p>Không tìm thấy người dùng nào phù hợp</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: UserAdminResp) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-colors group">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || user.username}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(user.fullName || user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {user.fullName || 'Chưa cập nhật tên'}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono mt-0.5">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{user.email || 'Không có email'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{user.phone || 'Không có SĐT'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {user.roles?.map((role: string) => {
                          const roleInfo = getRoleLabel(role);
                          return (
                            <Badge 
                              key={role} 
                              variant="outline" 
                              className={`font-normal px-2 py-0.5 shadow-sm ${roleInfo.color}`}
                            >
                              {roleInfo.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.enabled ? (
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-sm font-medium text-emerald-700 whitespace-nowrap">Hoạt động</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                          <span className="text-sm font-medium text-rose-700 whitespace-nowrap">Bị khóa</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background shadow-sm border border-transparent hover:border-border transition-all opacity-0 group-hover:opacity-100">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleChangePasswordClick(user)} className="cursor-pointer gap-2 py-2">
                            <KeyRound className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">Đổi mật khẩu</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(user)}
                            className={`cursor-pointer gap-2 py-2 ${user.enabled ? 'text-destructive' : 'text-emerald-600'}`}
                          >
                            {user.enabled ? (
                              <>
                                <ShieldAlert className="h-4 w-4" />
                                <span>Khóa tài khoản</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4" />
                                <span>Mở khóa tài khoản</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

      <CreateAccountModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
