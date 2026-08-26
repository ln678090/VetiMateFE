'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { catalogApi } from '@/features/shop/api/catalog.api';
import { Category, Brand } from '@/features/shop/types/catalog.types';
import { CategoryTable } from './components/CategoryTable';
import { BrandTable } from './components/BrandTable';
import { CategoryFormModal } from './components/CategoryFormModal';
import { BrandFormModal } from './components/BrandFormModal';

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('categories');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.getAllCategories,
  });

  const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: catalogApi.getAllBrands,
  });

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsBrandModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Danh mục & Thương hiệu
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Quản lý các danh mục sản phẩm và thương hiệu của shop
          </p>
        </div>
        <Button 
          onClick={() => {
            if (activeTab === 'categories') {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            } else {
              setEditingBrand(null);
              setIsBrandModalOpen(true);
            }
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm {activeTab === 'categories' ? 'Danh mục' : 'Thương hiệu'}
        </Button>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Danh mục sản phẩm</TabsTrigger>
          <TabsTrigger value="brands">Thương hiệu</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <CategoryTable 
                categories={categoriesData?.data || []} 
                isLoading={isLoadingCategories} 
                onEdit={handleEditCategory}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="brands" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <BrandTable 
                brands={brandsData?.data || []} 
                isLoading={isLoadingBrands} 
                onEdit={handleEditBrand}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CategoryFormModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categoryToEdit={editingCategory}
        categories={categoriesData?.data || []}
      />

      <BrandFormModal 
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        brandToEdit={editingBrand}
      />
    </div>
  );
}
