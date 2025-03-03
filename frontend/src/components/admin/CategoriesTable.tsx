import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { Category } from '@/lib/services/categoryService';
import categoryService from '@/lib/services/categoryService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryForm from './CategoryForm';

const CategoriesTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchQuery]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories(currentPage, 10);
      
      // Filtrar localmente si hay un término de búsqueda
      let filteredCategories = response.categories;
      if (searchQuery) {
        filteredCategories = filteredCategories.filter(category => 
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setCategories(filteredCategories);
      setTotalPages(Math.ceil(response.totalCount / 10));
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      await categoryService.deleteCategory(deletingId);
      toast.success('Categoría eliminada correctamente');
      fetchCategories();
      setDeletingId(null);
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      toast.error('Error al eliminar la categoría');
    }
  };

  const handleEditCategory = (id: number) => {
    setSelectedCategoryId(id);
    setIsFormOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
        <Button onClick={() => {
          setSelectedCategoryId(undefined);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border rounded-md"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-60" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">{category.id}</td>
                    <td className="px-4 py-3 font-medium">{category.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{category.description || 'Sin descripción'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCategory(category.id!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {deletingId === category.id && confirmDelete ? (
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={handleDelete}
                            >
                              Confirmar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setDeletingId(null);
                                setConfirmDelete(false);
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setDeletingId(category.id!);
                              setConfirmDelete(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron categorías
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 flex justify-between items-center border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando página {currentPage} de {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage} 
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CategoryForm 
        categoryId={selectedCategoryId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          fetchCategories();
          setIsFormOpen(false);
        }}
      />
    </div>
  );
};

export default CategoriesTable; 