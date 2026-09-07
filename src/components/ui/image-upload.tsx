'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { uploadFile } from '@/services/upload.service';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'petcare', className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File ảnh không được quá 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFile(file, folder);
      onChange(result.url);
      toast.success('Upload ảnh thành công');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload ảnh thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <Image
            src={value}
            alt="Preview"
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragActive
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
              : 'border-zinc-300 hover:border-rose-400 dark:border-zinc-700 dark:hover:border-rose-500'
          }`}
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              <span className="text-sm text-zinc-500 font-medium">Đang upload...</span>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                <Upload className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Kéo thả ảnh vào đây hoặc bấm để chọn
                </p>
                <p className="text-xs text-zinc-400 mt-1">PNG, JPG, WEBP — Tối đa 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
