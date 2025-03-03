import { useState } from 'react';
import { toast } from 'sonner';
import { Save, Globe, Mail, Phone, MapPin, CreditCard, Percent } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: 'Mi Tienda Online',
      storeDescription: 'La mejor tienda de productos online',
      storeEmail: 'info@mitienda.com',
      storePhone: '+34 612 345 678',
      storeAddress: 'Calle Principal 123, 28001 Madrid, España'
    },
    payment: {
      currency: 'EUR',
      currencySymbol: '€',
      taxRate: 21,
      allowCreditCards: true,
      allowPaypal: true,
      allowCashOnDelivery: false
    },
    shipping: {
      freeShippingMinimum: 50,
      defaultShippingCost: 4.99,
      internationalShipping: true,
      internationalShippingCost: 14.99
    }
  });

  const handleInputChange = (
    section: 'general' | 'payment' | 'shipping', 
    field: string, 
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Aquí implementaríamos la llamada a la API para guardar la configuración
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de llamada API
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
          {!saving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Pagos</TabsTrigger>
          <TabsTrigger value="shipping">Envíos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium mb-1">
                  Nombre de la tienda <span className="text-red-500">*</span>
                </label>
                <input
                  id="storeName"
                  type="text"
                  value={settings.general.storeName}
                  onChange={(e) => handleInputChange('general', 'storeName', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="storeDescription" className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  id="storeDescription"
                  value={settings.general.storeDescription}
                  onChange={(e) => handleInputChange('general', 'storeDescription', e.target.value)}
                  className="w-full p-2 border rounded-md min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" /> Información de contacto
              </h3>
              
              <div>
                <label htmlFor="storeEmail" className=" text-sm font-medium mb-1 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="storeEmail"
                  type="email"
                  value={settings.general.storeEmail}
                  onChange={(e) => handleInputChange('general', 'storeEmail', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="storePhone" className=" text-sm font-medium mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Teléfono
                </label>
                <input
                  id="storePhone"
                  type="tel"
                  value={settings.general.storePhone}
                  onChange={(e) => handleInputChange('general', 'storePhone', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="storeAddress" className=" text-sm font-medium mb-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Dirección
                </label>
                <textarea
                  id="storeAddress"
                  value={settings.general.storeAddress}
                  onChange={(e) => handleInputChange('general', 'storeAddress', e.target.value)}
                  className="w-full p-2 border rounded-md min-h-[60px]"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-md font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Configuración de pagos
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium mb-1">
                    Moneda <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="currency"
                    value={settings.payment.currency}
                    onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">Dólar (USD)</option>
                    <option value="GBP">Libra (GBP)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="currencySymbol" className="block text-sm font-medium mb-1">
                    Símbolo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="currencySymbol"
                    type="text"
                    value={settings.payment.currencySymbol}
                    onChange={(e) => handleInputChange('payment', 'currencySymbol', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                    maxLength={1}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="taxRate" className=" text-sm font-medium mb-1 flex items-center gap-1">
                  <Percent className="h-3.5 w-3.5" /> Tasa de impuestos (%)
                </label>
                <input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.payment.taxRate}
                  onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Métodos de pago aceptados</h3>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="allowCreditCards"
                    type="checkbox"
                    checked={settings.payment.allowCreditCards}
                    onChange={(e) => handleInputChange('payment', 'allowCreditCards', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="allowCreditCards" className="ml-2 block text-sm">
                    Tarjetas de crédito
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="allowPaypal"
                    type="checkbox"
                    checked={settings.payment.allowPaypal}
                    onChange={(e) => handleInputChange('payment', 'allowPaypal', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="allowPaypal" className="ml-2 block text-sm">
                    PayPal
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="allowCashOnDelivery"
                    type="checkbox"
                    checked={settings.payment.allowCashOnDelivery}
                    onChange={(e) => handleInputChange('payment', 'allowCashOnDelivery', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="allowCashOnDelivery" className="ml-2 block text-sm">
                    Pago contra reembolso
                  </label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-md font-medium">Envío nacional</h3>
              
              <div>
                <label htmlFor="defaultShippingCost" className="block text-sm font-medium mb-1">
                  Coste de envío estándar
                </label>
                <div className="flex items-center">
                  <span className="mr-2">{settings.payment.currencySymbol}</span>
                  <input
                    id="defaultShippingCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.defaultShippingCost}
                    onChange={(e) => handleInputChange('shipping', 'defaultShippingCost', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="freeShippingMinimum" className="block text-sm font-medium mb-1">
                  Pedido mínimo para envío gratis
                </label>
                <div className="flex items-center">
                  <span className="mr-2">{settings.payment.currencySymbol}</span>
                  <input
                    id="freeShippingMinimum"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.freeShippingMinimum}
                    onChange={(e) => handleInputChange('shipping', 'freeShippingMinimum', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Envío internacional</h3>
              
              <div className="flex items-center">
                <input
                  id="internationalShipping"
                  type="checkbox"
                  checked={settings.shipping.internationalShipping}
                  onChange={(e) => handleInputChange('shipping', 'internationalShipping', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="internationalShipping" className="ml-2 block text-sm">
                  Habilitar envío internacional
                </label>
              </div>
              
              {settings.shipping.internationalShipping && (
                <div>
                  <label htmlFor="internationalShippingCost" className="block text-sm font-medium mb-1">
                    Coste de envío internacional
                  </label>
                  <div className="flex items-center">
                    <span className="mr-2">{settings.payment.currencySymbol}</span>
                    <input
                      id="internationalShippingCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.shipping.internationalShippingCost}
                      onChange={(e) => handleInputChange('shipping', 'internationalShippingCost', parseFloat(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel; 