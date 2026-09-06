import { PetDto, PET_SPECIES_OPTIONS, PET_GENDER_OPTIONS } from '@/types/clinic';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Calendar, Weight, Info, Trash, Edit } from 'lucide-react';
import { useDeleteOwnerPet } from '@/hooks/useOwnerPets';
import { toast } from 'sonner';

interface OwnerPetCardProps {
  pet: PetDto;
  onEdit: (pet: PetDto) => void;
}

export function OwnerPetCard({ pet, onEdit }: OwnerPetCardProps) {
  const deleteMutation = useDeleteOwnerPet();

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thú cưng ${pet.name} không?`)) {
      deleteMutation.mutate(pet.id, {
        onSuccess: () => toast.success('Đã xóa thú cưng'),
        onError: (err: unknown) => {
          // Đổi thành unknown
          const apiError = err as Error; // Ép kiểu sang Error chuẩn
          toast.error(apiError.message || 'Lỗi khi xóa thú cưng');
        },
      });
    }
  };

  const Icon = pet.species === 'DOG' ? Dog : Cat;
  const genderLabel =
    PET_GENDER_OPTIONS.find((g) => g.value === pet.gender)?.label || 'Chưa xác định';
  const speciesLabel =
    PET_SPECIES_OPTIONS.find((s) => s.value === pet.species)?.label || pet.species;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {pet.name}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
              {speciesLabel} {pet.breed ? ` • ${pet.breed}` : ''}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-rose-500 flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-6 flex justify-center text-rose-400">
              <Info className="w-4 h-4" />
            </div>
            <span>
              Giới tính:{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">{genderLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-6 flex justify-center text-rose-400">
              <Calendar className="w-4 h-4" />
            </div>
            <span>
              Ngày sinh:{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {pet.birthDate || 'Chưa cập nhật'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-6 flex justify-center text-rose-400">
              <Weight className="w-4 h-4" />
            </div>
            <span>
              Cân nặng:{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {pet.weightKg ? `${pet.weightKg} kg` : 'Chưa cập nhật'}
              </span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex gap-2 justify-end bg-gray-50 dark:bg-gray-900/50">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 hover:text-rose-600 hover:bg-rose-50 border-gray-200"
          onClick={() => onEdit(pet)}
          disabled={deleteMutation.isPending}
        >
          <Edit className="w-4 h-4 mr-1.5" />
          Sửa
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash className="w-4 h-4 mr-1.5" />
          Xóa
        </Button>
      </CardFooter>
    </Card>
  );
}
