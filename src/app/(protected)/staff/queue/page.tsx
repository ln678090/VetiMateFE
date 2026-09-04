'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueueType } from '@/types/queue';
import { QueueBoard } from '@/features/staff/components/QueueBoard';

export default function QueuePage() {
  const [activeTab, setActiveTab] = useState<QueueType>('CLINIC');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          Hàng đợi điện tử
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Quản lý luồng khách hàng theo số thứ tự
        </p>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as QueueType)}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="CLINIC">Khám bệnh (Clinic)</TabsTrigger>
          <TabsTrigger value="SPA">Spa / Grooming</TabsTrigger>
        </TabsList>
        <TabsContent value="CLINIC" className="mt-0">
          <QueueBoard type="CLINIC" />
        </TabsContent>
        <TabsContent value="SPA" className="mt-0">
          <QueueBoard type="SPA" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
