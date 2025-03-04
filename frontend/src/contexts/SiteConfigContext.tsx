import React, { createContext, useContext, ReactNode } from 'react';
import useSiteConfig from '@/hooks/useSiteConfig';

interface SiteConfigContextType {
  configs: { [key: string]: string };
  loading: boolean;
  error: string | null;
  refreshConfigs: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const siteConfig = useSiteConfig();

  return (
    <SiteConfigContext.Provider value={siteConfig}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfigContext = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfigContext debe ser usado dentro de un SiteConfigProvider');
  }
  return context;
};

export default SiteConfigProvider; 