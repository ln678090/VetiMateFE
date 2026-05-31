'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
        strokeWidth={2}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm sản phẩm theo tên, thương hiệu..."
        className="h-11 pr-10 pl-10"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
          onClick={() => onChange('')}
          aria-label="Xoá tìm kiếm"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </Button>
      )}
    </div>
  );
}
