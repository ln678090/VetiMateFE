import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          Hàng d?i di?n t?
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Giao di?n dang du?c xây d?ng...
        </p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>D? li?u</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-sm text-zinc-500">Chua có d? li?u</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
