
'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Edit } from 'lucide-react';
import CategoryFormDialog from './CategoryFormDialog';
import { iconMap } from '@/lib/icons';

interface CategoriesDataTableProps {
  initialCategories: Category[];
}

export default function CategoriesDataTable({ initialCategories }: CategoriesDataTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleAddNew = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };
  
  const onCategorySaved = (savedCategory: Category) => {
    const existingIndex = categories.findIndex(c => c.id === savedCategory.id);
    if (existingIndex > -1) {
      const updatedCategories = [...categories];
      updatedCategories[existingIndex] = savedCategory;
      setCategories(updatedCategories);
    } else {
      setCategories([savedCategory, ...categories]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Añadir Categoría</Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Icono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const Icon = iconMap[category.iconName];
              return (
                <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="capitalize">
                      {Icon ? <Icon className="h-5 w-5" /> : category.iconName}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <CategoryFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onCategorySaved={onCategorySaved}
      />
    </>
  );
}
