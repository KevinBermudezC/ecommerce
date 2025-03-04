import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Plus, Image, Type, Palette, ToggleLeft, Hash, Link, Calendar } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { AuthContext, AuthContextType } from '@/context/AuthContext';
import { useNavigate } from 'react-router';

interface SiteConfig {
  id: number | string;
  key: string;
  type: string;
  value: string;
  label: string;
  description?: string;
  category?: string;
}

interface SiteConfigValue {
  id?: number | string;
  type?: string;
  value?: string;
  label?: string;
  description?: string;
  category?: string;
}

const CONFIG_TYPES = [
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'textarea', label: 'Texto Largo', icon: Type },
  { value: 'image', label: 'Imagen', icon: Image },
  { value: 'color', label: 'Color', icon: Palette },
  { value: 'boolean', label: 'Interruptor', icon: ToggleLeft },
  { value: 'number', label: 'Número', icon: Hash },
  { value: 'url', label: 'URL', icon: Link },
  { value: 'date', label: 'Fecha', icon: Calendar },
];

const CONFIG_CATEGORIES = [
  'General',
  'Apariencia',
  'SEO',
  'Social Media',
  'Contacto',
  'Otros'
];

// Configurar axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const SiteConfigManager = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [formData, setFormData] = useState({
    key: '',
    type: 'text',
    value: '',
    label: '',
    description: '',
    category: 'General'
  });

  useEffect(() => {
    // Verificar si el usuario está autenticado y es admin
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (auth.user?.role !== 'admin') {
      navigate('/');
      return;
    }

    loadConfigs();
  }, [auth.isAuthenticated, auth.user?.role, navigate]);

  const loadConfigs = async () => {
    try {
      const response = await api.get('/site-config');
      console.log('URL de la petición:', api.defaults.baseURL + '/site-config');
      console.log('Respuesta de la API:', response.data);

      // Si la respuesta está vacía, mostrar array vacío
      if (!response.data) {
        setConfigs([]);
        return;
      }

      // Transformar los datos según su estructura
      let configsArray: SiteConfig[];
      if (Array.isArray(response.data)) {
        configsArray = response.data.map(config => ({
          ...config,
          // Asegurarse de que todos los campos requeridos existan
          id: config.id || config.key,
          key: config.key || '',
          type: config.type || 'text',
          value: config.value || '',
          label: config.label || config.key || '',
          description: config.description || '',
          category: config.category || 'General'
        }));
      } else if (typeof response.data === 'object') {
        configsArray = Object.entries(response.data).map(([key, value]) => {
          // Si el valor es un objeto completo
          if (typeof value === 'object' && value !== null) {
            const configValue = value as SiteConfigValue;
            return {
              id: configValue.id || key,
              key,
              type: configValue.type || 'text',
              value: configValue.value || '',
              label: configValue.label || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
              description: configValue.description || '',
              category: configValue.category || 'General'
            };
          }
          // Si el valor es primitivo
          return {
            id: key,
            key,
            type: typeof value === 'boolean' ? 'boolean' : 
                  typeof value === 'number' ? 'number' : 
                  typeof value === 'string' && value.startsWith('http') ? 'image' : 'text',
            value: String(value),
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            description: '',
            category: 'General'
          };
        });
      } else {
        throw new Error('Formato de datos no válido');
      }

      console.log('Configuraciones procesadas:', configsArray);
      setConfigs(configsArray);
    } catch (error) {
      console.error('Error completo al cargar configuraciones:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
        });
        toast.error(`Error al cargar las configuraciones: ${error.response?.status === 404 ? 'API no encontrada' : error.message}`);
      } else {
        toast.error('Error al cargar las configuraciones');
      }
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedConfig) {
        await api.put(`/site-config/${selectedConfig.key}`, formData);
        toast.success('Configuración actualizada exitosamente');
      } else {
        await api.post('/site-config', formData);
        toast.success('Configuración creada exitosamente');
      }
      loadConfigs();
      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al guardar:', error.response?.data);
        toast.error(`Error al guardar: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error('Error al guardar la configuración');
      }
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta configuración?')) return;
    
    try {
      await api.delete(`/site-config/${key}`);
      toast.success('Configuración eliminada exitosamente');
      loadConfigs();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al eliminar:', error.response?.data);
        toast.error(`Error al eliminar: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error('Error al eliminar la configuración');
      }
    }
  };

  const handleEdit = (config: SiteConfig) => {
    setSelectedConfig(config);
    setFormData({
      key: config.key,
      type: config.type,
      value: config.value,
      label: config.label,
      description: config.description || '',
      category: config.category || 'General'
    });
  };

  const resetForm = () => {
    setSelectedConfig(null);
    setFormData({
      key: '',
      type: 'text',
      value: '',
      label: '',
      description: '',
      category: 'General'
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, value: response.data.url }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al subir archivo:', error.response?.data);
        toast.error(`Error al subir archivo: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error('Error al subir el archivo');
      }
    }
  };

  const renderConfigValue = (config: SiteConfig) => {
    switch (config.type) {
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={config.value} 
              alt={config.label} 
              className="mt-2 w-full h-32 object-cover rounded-lg transition-all duration-200 group-hover:opacity-75" 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="sm" onClick={() => window.open(config.value, '_blank')}>
                Ver imagen
              </Button>
            </div>
          </div>
        );
      case 'color':
        return (
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: config.value }}
            />
            <span>{config.value}</span>
          </div>
        );
      case 'boolean':
        return (
          <Switch 
            checked={config.value === 'true'} 
            disabled
            className="mt-2"
          />
        );
      case 'url':
        return (
          <a 
            href={config.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 block"
          >
            {config.value}
          </a>
        );
      default:
        return <p className="mt-2 text-gray-600">{config.value}</p>;
    }
  };

  const renderFormField = () => {
    switch (formData.type) {
      case 'textarea':
        return (
          <Textarea
            id="value"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            className="min-h-[100px]"
            required
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              id="value"
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
            />
            {formData.value && (
              <img 
                src={formData.value} 
                alt="Preview" 
                className="max-w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
        );
      case 'color':
        return (
          <div className="flex gap-2 items-center">
            <Input
              id="value"
              type="color"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-20 h-10"
              required
            />
            <Input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        );
      case 'boolean':
        return (
          <Switch
            checked={formData.value === 'true'}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, value: String(checked) }))
            }
          />
        );
      case 'number':
        return (
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            required
          />
        );
      case 'url':
        return (
          <Input
            id="value"
            type="url"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder="https://"
            required
          />
        );
      case 'date':
        return (
          <Input
            id="value"
            type="date"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            required
          />
        );
      default:
        return (
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            required
          />
        );
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  const filteredConfigs = activeTab === 'todos' 
    ? configs 
    : configs.filter(config => config.category === activeTab);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestor de Configuraciones del Sitio</h2>
        <Button onClick={resetForm} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Configuración
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{selectedConfig ? 'Editar Configuración' : 'Nueva Configuración'}</CardTitle>
            <CardDescription>
              {selectedConfig 
                ? 'Modifica los valores de la configuración seleccionada' 
                : 'Crea una nueva configuración para tu sitio'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="key">Clave</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  disabled={!!selectedConfig}
                  required
                  placeholder="mi_configuracion"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIG_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIG_TYPES.map(type => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="label">Etiqueta</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  required
                  placeholder="Mi Configuración"
                />
              </div>

              <div>
                <Label htmlFor="value">Valor</Label>
                {renderFormField()}
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el propósito de esta configuración..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {selectedConfig ? 'Actualizar' : 'Crear'}
                </Button>
                {selectedConfig && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de configuraciones */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Configuraciones Existentes</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full overflow-x-auto">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                {CONFIG_CATEGORIES.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConfigs.map((config) => (
                <Card key={config.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{config.label}</CardTitle>
                        <p className="text-sm text-gray-500">{config.key}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(config.key)}>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {config.description && (
                      <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                    )}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {renderConfigValue(config)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {CONFIG_TYPES.find(t => t.value === config.type)?.icon && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          {React.createElement(CONFIG_TYPES.find(t => t.value === config.type)!.icon, { 
                            className: "w-4 h-4" 
                          })}
                          <span>{CONFIG_TYPES.find(t => t.value === config.type)?.label}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteConfigManager; 