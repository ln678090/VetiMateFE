'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardCheck,
  PhoneCall,
  Syringe,
  Stethoscope,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Phone,
  User,
  PawPrint,
  Save,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { dailyTasksApi } from '@/features/management/api/daily-tasks.api';
import type { DailyCareTaskDto, DailyTaskStatus } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MorningTasksPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<DailyCareTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'POST_OP' | 'VACCINE'>('POST_OP');

  // Edit Task Dialog
  const [selectedTask, setSelectedTask] = useState<DailyCareTaskDto | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskStatus, setTaskStatus] = useState<DailyTaskStatus>('PENDING');
  const [callResult, setCallResult] = useState('');
  const [notes, setNotes] = useState('');

  const loadTasks = useCallback(async (dateStr = selectedDate) => {
    try {
      setLoading(true);
      const data = await dailyTasksApi.getTasks(dateStr);
      setTasks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      toast.error('Không thể tải danh sách việc: ' + msg);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    let ignore = false;
    async function fetchTasks() {
      try {
        setLoading(true);
        const data = await dailyTasksApi.getTasks(selectedDate);
        if (!ignore) setTasks(data);
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
          toast.error('Không thể tải danh sách việc: ' + msg);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchTasks();
    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const data = await dailyTasksApi.generateTasks(selectedDate);
      setTasks(data);
      toast.success('Đã cập nhật & sinh danh sách việc sáng nay thành công!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi sinh việc';
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  // Filter Tasks
  const postOpTasks = tasks.filter((t) => t.taskType === 'POST_OP_CALL');
  const vaccineTasks = tasks.filter((t) => t.taskType === 'VACCINE_REMINDER');

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED' || t.status === 'CALLED').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Open Task Call Modal
  const openCallModal = (task: DailyCareTaskDto) => {
    setSelectedTask(task);
    setTaskStatus(task.status);
    setCallResult(task.callResult || (task.taskType === 'POST_OP_CALL' ? 'RECOVERING_WELL' : 'CONFIRMED'));
    setNotes(task.notes || '');
    setTaskDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (!selectedTask) return;
    try {
      const updated = await dailyTasksApi.updateTask(selectedTask.id, {
        status: taskStatus,
        callResult: callResult || undefined,
        notes: notes || undefined,
      });

      toast.success('Đã lưu kết quả liên hệ!');
      setTaskDialogOpen(false);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu kết quả';
      toast.error(msg);
    }
  };

  const quickMarkDone = async (task: DailyCareTaskDto) => {
    try {
      const updated = await dailyTasksApi.updateTask(task.id, {
        status: 'COMPLETED',
        callResult: task.taskType === 'POST_OP_CALL' ? 'RECOVERING_WELL' : 'CONFIRMED',
      });
      toast.success('Đã đánh dấu hoàn thành ca!');
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <ClipboardCheck className="size-6 text-white" />
              </span>
              <Badge className="bg-white/20 text-white hover:bg-white/30">Lễ tân & Chăm sóc khách hàng</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Danh sách Việc cần làm Sáng nay</h1>
            <p className="mt-1 text-sm text-amber-100">
              Tự động tổng hợp ca mổ hôm qua cần gọi thăm hỏi và ca tiêm phòng hôm nay cần nhắc lịch hẹn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-1.5 backdrop-blur">
              <Calendar className="size-4 text-white" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark]"
              />
            </div>

            <Button
              onClick={() => loadTasks(selectedDate)}
              disabled={loading}
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <RefreshCw className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <RefreshCw className={`mr-2 size-4 ${generating ? 'animate-spin' : ''}`} />
              Sinh lại việc
            </Button>
          </div>
        </div>
      </div>

      {/* Progress & Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-3xl border-slate-200/80 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tiến độ hôm nay</span>
              <Badge className="bg-emerald-100 text-emerald-800">{progressPercent}%</Badge>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {completedTasks} / {totalTasks} <span className="text-sm font-normal text-muted-foreground">đã xử lý</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Ca mổ hôm qua (Thăm hỏi)
              </span>
              <Stethoscope className="size-5 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {postOpTasks.length}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                ({postOpTasks.filter((t) => t.status === 'COMPLETED').length} đã hoàn tất)
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Gọi hỏi thăm vết mổ, ăn uống & dặn dò</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Ca tiêm hôm nay (Nhắc hẹn)
              </span>
              <Syringe className="size-5 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {vaccineTasks.length}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                ({vaccineTasks.filter((t) => t.status === 'COMPLETED').length} đã xác nhận)
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Gọi nhắc giờ hẹn tiêm phòng vắc-xin</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Card className="rounded-3xl border-slate-200/80 shadow-sm">
        <Tabs value={activeTab} onValueChange={(val: string) => setActiveTab(val as 'POST_OP' | 'VACCINE')}>
          <CardHeader className="border-b p-4 pb-0">
            <TabsList className="grid h-12 w-full max-w-md grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <TabsTrigger value="POST_OP" className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                📞 Ca mổ hôm qua ({postOpTasks.length})
              </TabsTrigger>
              <TabsTrigger value="VACCINE" className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                💉 Ca tiêm hôm nay ({vaccineTasks.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">Đang tải danh sách công việc...</div>
            ) : activeTab === 'POST_OP' ? (
              /* POST_OP LIST */
              postOpTasks.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  🎉 Hôm qua không có ca phẫu thuật nào cần gọi thăm hỏi.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {postOpTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onCall={() => openCallModal(task)} onDone={() => quickMarkDone(task)} />
                  ))}
                </div>
              )
            ) : (
              /* VACCINE LIST */
              vaccineTasks.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  🎉 Hôm nay không có lịch hẹn tiêm phòng nào cần nhắc.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {vaccineTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onCall={() => openCallModal(task)} onDone={() => quickMarkDone(task)} />
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Tabs>
      </Card>

      {/* Dialog Ghi nhận Cuộc gọi */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="size-5 text-emerald-600" />
              Ghi nhận kết quả liên hệ
            </DialogTitle>
            <DialogDescription>
              {selectedTask?.title} - Chủ: {selectedTask?.customerName} ({selectedTask?.phone})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-2xl bg-slate-50 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Thú cưng: {selectedTask?.petName}</span>
                <span className="text-muted-foreground">{selectedTask?.phone}</span>
              </div>
              <p className="mt-1 text-slate-600">{selectedTask?.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái thực hiện</Label>
              <Select value={taskStatus} onValueChange={(val: string) => setTaskStatus(val as DailyTaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">⚪ Chưa liên hệ</SelectItem>
                  <SelectItem value="CALLED">📞 Đã gọi / Đang theo dõi</SelectItem>
                  <SelectItem value="COMPLETED">✅ Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">❌ Hủy bỏ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kết quả phản hồi của chủ nuôi</Label>
              <Select value={callResult} onValueChange={setCallResult}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedTask?.taskType === 'POST_OP_CALL' ? (
                    <>
                      <SelectItem value="RECOVERING_WELL">🟢 Hồi phục tốt, ăn uống bình thường</SelectItem>
                      <SelectItem value="NEED_RE_EXAM">🔴 Vết mổ rỉ dịch/sốt - Cần tái khám gấp</SelectItem>
                      <SelectItem value="MONITORING">🟡 Đang theo dõi thêm tại nhà</SelectItem>
                      <SelectItem value="NO_ANSWER">⚪ Không nghe máy / Gọi lại sau</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="CONFIRMED">🟢 Xác nhận đến đúng giờ hẹn</SelectItem>
                      <SelectItem value="RESCHEDULED">🟡 Xin dời lịch sang ngày khác</SelectItem>
                      <SelectItem value="CANCELLED">🔴 Xin hủy lịch tiêm</SelectItem>
                      <SelectItem value="NO_ANSWER">⚪ Thuê bao / Chưa liên lạc được</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú cuộc gọi</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập chi tiết phản hồi của chủ nuôi..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveTask} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="mr-1.5 size-4" />
              Lưu kết quả
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskCard({
  task,
  onCall,
  onDone,
}: {
  task: DailyCareTaskDto;
  onCall: () => void;
  onDone: () => void;
}) {
  const isPostOp = task.taskType === 'POST_OP_CALL';
  const isDone = task.status === 'COMPLETED';

  return (
    <Card
      className={`group relative overflow-hidden rounded-3xl border transition-all hover:shadow-md ${
        isDone ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200/80 bg-white'
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-sm ${
                isPostOp ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {isPostOp ? '🩺' : '💉'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">{task.title}</h4>
                {isDone ? (
                  <Badge className="bg-emerald-100 text-emerald-800">
                    <Check className="mr-1 size-3" /> Đã hoàn thành
                  </Badge>
                ) : task.status === 'CALLED' ? (
                  <Badge className="bg-blue-100 text-blue-800">Đã gọi</Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                    Chờ gọi
                  </Badge>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <PawPrint className="size-3 text-emerald-600" />
                  Bé {task.petName || 'Thú cưng'}
                </span>
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  Chủ: {task.customerName}
                </span>
                <a
                  href={`tel:${task.phone}`}
                  className="flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                >
                  <Phone className="size-3" />
                  {task.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          {task.description}
        </p>

        {task.callResult && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span>Kết quả:</span>
            {task.callResult === 'RECOVERING_WELL' && (
              <Badge className="bg-emerald-100 text-emerald-800">Hồi phục tốt</Badge>
            )}
            {task.callResult === 'NEED_RE_EXAM' && (
              <Badge className="bg-rose-100 text-rose-800">Cần tái khám gấp</Badge>
            )}
            {task.callResult === 'CONFIRMED' && (
              <Badge className="bg-emerald-100 text-emerald-800">Xác nhận đến</Badge>
            )}
            {task.callResult === 'RESCHEDULED' && (
              <Badge className="bg-amber-100 text-amber-800">Dời lịch hẹn</Badge>
            )}
            {task.callResult === 'NO_ANSWER' && (
              <Badge className="bg-slate-100 text-slate-800">Không nghe máy</Badge>
            )}
          </div>
        )}

        {task.notes && (
          <p className="mt-1.5 text-xs text-slate-500">
            <strong>Ghi chú:</strong> {task.notes}
          </p>
        )}

        <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
          <Button size="sm" variant="outline" onClick={onCall} className="rounded-xl border-slate-200">
            <PhoneCall className="mr-1.5 size-3.5 text-emerald-600" />
            Ghi nhận cuộc gọi
          </Button>

          {!isDone && (
            <Button size="sm" onClick={onDone} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="mr-1.5 size-3.5" />
              Xong
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
