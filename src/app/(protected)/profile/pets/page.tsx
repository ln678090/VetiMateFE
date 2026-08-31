'use client';

import { useState } from 'react';
import { Plus, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOwnerPets } from '@/hooks/useOwnerPets';
import { OwnerPetCard } from '@/features/profile/components/OwnerPetCard';
import { OwnerPetDialog } from '@/features/profile/components/OwnerPetDialog';
import { PetDto } from '@/types/clinic';
import { FullScreenLoader } from '@/components/shared/FullScreenLoader';

export default function MyPetsPage() {
  const { data, isLoading, isError } = useOwnerPets(0, 100); // Fetch up to 100 pets
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetDto | undefined>(undefined);

  const handleAddPet = () => {
    setSelectedPet(undefined);
    setIsDialogOpen(true);
  };

  const handleEditPet = (pet: PetDto) => {
    setSelectedPet(pet);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p>Có lỗi xảy ra khi tải danh sách thú cưng. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const pets = data?.content || [];

  return (
    <div className="container mx-auto max-w-6xl py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <PawPrint className="w-8 h-8 text-rose-500" />
            Thú cưng của tôi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Quản lý thông tin và hồ sơ sức khỏe thú cưng của bạn
          </p>
        </div>
        
        <Button 
          onClick={handleAddPet}
          className="bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-none transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm thú cưng
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full mb-4">
            <PawPrint className="w-10 h-10 text-rose-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Chưa có thú cưng nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
            Bạn chưa thêm thú cưng nào vào hồ sơ. Thêm ngay thú cưng của bạn để dễ dàng đặt lịch khám và sử dụng các dịch vụ của PetCare.
          </p>
          <Button 
            onClick={handleAddPet}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            Thêm thú cưng đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <OwnerPetCard 
              key={pet.id} 
              pet={pet} 
              onEdit={handleEditPet} 
            />
          ))}
        </div>
      )}

      <OwnerPetDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedPet}
      />
    </div>
  );
}
