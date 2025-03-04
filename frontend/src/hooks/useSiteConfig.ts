import { useState, useEffect } from 'react';
import axios from 'axios';

interface SiteConfig {
  id: number;
  key: string;
  type: string;
  value: string;
  label: string;
  description?: string;
}

interface UseSiteConfigReturn {
  configs: { [key: string]: string };
  loading: boolean;
  error: string | null;
  refreshConfigs: () => Promise<void>;
}

const useSiteConfig = (): UseSiteConfigReturn => {
  const [configs, setConfigs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await axios.get<SiteConfig[]>('/api/site-config');
      const configsMap = response.data.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
      }, {} as { [key: string]: string });
      setConfigs(configsMap);
      setError(null);
    } catch (err) {
      setError('Error al cargar las configuraciones del sitio');
      console.error('Error fetching site configs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return {
    configs,
    loading,
    error,
    refreshConfigs: fetchConfigs
  };
};

export default useSiteConfig; 