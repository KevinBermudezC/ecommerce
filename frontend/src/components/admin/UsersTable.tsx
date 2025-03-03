import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Check, X, ChevronLeft, ChevronRight, UserCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { User } from '@/lib/services/userService';
import userService from '@/lib/services/userService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import  UserForm  from '@/components/admin/UserForm';

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(currentPage, 10);
      
      // Filtrar localmente si hay un término de búsqueda
      let filteredUsers = response.users;
      if (searchQuery) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setUsers(filteredUsers);
      setTotalPages(Math.ceil(response.totalCount / 10));
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      await userService.deleteUser(deletingId);
      toast.success('Usuario eliminado correctamente');
      fetchUsers();
      setDeletingId(null);
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleEditUser = (id: number) => {
    setSelectedUserId(id);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
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
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Fecha Registro</th>
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
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-30" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center">
                        <UserCircle2 className="h-5 w-5 mr-2 text-muted-foreground" />
                        {user.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditUser(user.id!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {deletingId === user.id && confirmDelete ? (
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={handleDelete}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setDeletingId(null);
                                setConfirmDelete(false);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setDeletingId(user.id!);
                              setConfirmDelete(true);
                            }}
                            disabled={user.role === 'ADMIN'} // No permitir eliminar administradores
                            title={user.role === 'ADMIN' ? "No se pueden eliminar usuarios administradores" : ""}
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
                    No se encontraron usuarios
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

      <UserForm 
        userId={selectedUserId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          fetchUsers();
          setIsFormOpen(false);
        }}
      />
    </div>
  );
};

export default UsersTable; 