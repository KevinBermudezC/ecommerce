import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle, Search, Filter, ChevronLeft, ChevronRight, Package } from "lucide-react";
import productService, { Product } from '@/lib/services/productService';
import categoryService, { Category } from '@/lib/services/categoryService';
import ProductForm from './ProductForm';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchQuery, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Preparar parámetros de búsqueda
      const params: any = {
        page: currentPage,
        limit: 10
      };
      
      if (categoryFilter) {
        params.categoryId = categoryFilter;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      console.log('Fetching products with params:', params);
      
      const response = await productService.getProducts(
        params.page, 
        params.limit, 
        params.categoryId,
        params.search
      );
      
      console.log('Products response in component:', response);
      
      if (response && Array.isArray(response.products)) {
        setProducts(response.products);
        setTotalPages(Math.ceil(response.totalCount / 10));
      } else if (response && Array.isArray(response)) {
        // Si la respuesta es un array directo de productos
        setProducts(response);
        setTotalPages(Math.ceil(response.length / 10));
      } else {
        setProducts([]);
        setTotalPages(0);
        toast.error('No se pudieron cargar los productos correctamente');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar los productos');
      setProducts([]);
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories(1, 100);
      setCategories(response.categories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      await productService.deleteProduct(deletingId);
      toast.success('Producto eliminado correctamente');
      fetchProducts();
      setDeletingId(null);
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };
  
  const handleCategoryFilter = (categoryId: number | '') => {
    setCategoryFilter(categoryId);
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchQuery('');
    setCategoryFilter('');
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Button onClick={() => {
          setSelectedProductId(undefined);
          setIsFormOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border rounded-md"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
          
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:w-auto w-full"
          >
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>
        
        {isFilterOpen && (
          <div className="p-4 border rounded-md bg-muted/30">
            <h3 className="text-sm font-medium mb-3">Filtrar por categoría</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={categoryFilter === '' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleCategoryFilter('')}
              >
                Todas
              </Button>
              
              {categories.map(category => (
                <Button 
                  key={category.id} 
                  variant={categoryFilter === category.id ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleCategoryFilter(category.id!)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            {(searchQuery || categoryFilter !== '') && (
              <>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {searchQuery && <span className="mr-2">Búsqueda: "{searchQuery}"</span>}
                    {categoryFilter !== '' && (
                      <span>
                        Categoría: {categories.find(c => c.id === categoryFilter)?.name}
                      </span>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearFilters}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-md mr-3" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">{product.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden mr-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.category?.name || 'Sin categoría'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock} uds.
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setIsFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {deletingId === product.id && confirmDelete ? (
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
                              setDeletingId(product.id!);
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
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                      <div>No se encontraron productos</div>
                      {(searchQuery || categoryFilter !== '') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleClearFilters}
                        >
                          Limpiar filtros
                        </Button>
                      )}
                    </div>
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

      <ProductForm 
        productId={selectedProductId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          fetchProducts();
          setIsFormOpen(false);
        }}
      />
    </div>
  );
};

export default ProductsTable; 