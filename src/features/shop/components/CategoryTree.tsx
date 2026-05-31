'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { useCategoryTree } from '@/features/shop/hooks/use-categories';
import { cn } from '@/lib/utils';
import type { CategoryTree as CategoryTreeNode } from '@/types/catalog';

interface CategoryTreeProps {
  className?: string;
  showRoot?: boolean;
}

export function CategoryTree({ className, showRoot = true }: CategoryTreeProps) {
  const { data, isLoading, isError } = useCategoryTree();

  if (isLoading) return <CategoryTreeSkeleton />;

  if (isError || !data || data.length === 0) {
    return (
      <p className={cn('text-sm text-zinc-500 dark:text-zinc-500', className)}>Chưa có danh mục</p>
    );
  }

  return (
    <nav className={cn('space-y-1', className)} aria-label="Danh mục">
      {showRoot && <CategoryTreeItem name="Tất cả sản phẩm" slug="" isAllProducts level={0} />}
      {data.map((node, idx) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: idx * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <CategoryTreeItem
            name={node.name}
            slug={node.slug}
            icon={node.icon}
            children={node.children}
            level={0}
          />
        </motion.div>
      ))}
    </nav>
  );
}

interface CategoryTreeItemProps {
  name: string;
  slug: string;
  icon?: string | null;
  children?: CategoryTreeNode[];
  level: number;
  isAllProducts?: boolean;
}

function CategoryTreeItem({
  name,
  slug,
  icon,
  children,
  level,
  isAllProducts = false,
}: CategoryTreeItemProps) {
  const pathname = usePathname();
  const href = isAllProducts ? '/shop' : `/shop/category/${slug}`;
  const isActive = pathname === href || (slug && pathname.startsWith(`/shop/category/${slug}`));

  // Resolve lucide icon từ tên string
  const IconComponent =
    icon && icon in Icons
      ? (
          Icons as unknown as Record<
            string,
            React.ComponentType<{ className?: string; strokeWidth?: number }>
          >
        )[icon]
      : null;

  return (
    <>
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          isActive
            ? 'bg-gradient-to-br from-rose-500/10 to-amber-500/10 text-rose-700 dark:from-rose-500/20 dark:to-amber-500/10 dark:text-rose-300'
            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white'
        )}
        style={{ paddingLeft: `${0.75 + level * 0.875}rem` }}
      >
        {IconComponent && (
          <IconComponent
            className={cn(
              'h-4 w-4 shrink-0',
              isActive ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500 dark:text-zinc-500'
            )}
            strokeWidth={2}
          />
        )}
        <span className="flex-1">{name}</span>
        {children && children.length > 0 && (
          <ChevronRight
            className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600"
            strokeWidth={2.2}
          />
        )}
      </Link>

      {/* Render children đệ quy */}
      {children && children.length > 0 && (
        <div className="mt-0.5 space-y-0.5">
          {children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              name={child.name}
              slug={child.slug}
              icon={child.icon}
              children={child.children}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

function CategoryTreeSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full rounded-lg" />
      ))}
    </div>
  );
}
