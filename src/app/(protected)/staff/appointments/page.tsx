import { CalendarView } from './components/CalendarView';

export default function Page() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          Quản lý lịch hẹn
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Xem, quản lý và xác nhận lịch hẹn với khách hàng
        </p>
      </header>
      
      <CalendarView />
    </div>
  );
}
