'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productApi } from '@/features/shop/api/product.api';
import { ProductTable } from './components/ProductTable';
import { ProductFormModal } from './components/ProductFormModal';
import { Product } from '@/features/shop/types/product.types';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts('newest'),
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Sản phẩm Shop
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Quản lý danh sách sản phẩm, giá bán và tồn kho
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          Thêm Sản phẩm
        </Button>
      </header>
      
      <Card>
        <CardContent className="p-0">
          <ProductTable 
            products={productsData?.data?.items || []} 
            isLoading={isLoading} 
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
      />
    </div>
  );
}
