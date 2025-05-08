import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BackHandler } from 'react-native';
import { router, usePathname } from 'expo-router';
import { usePlatform } from '@/hooks/usePlatform';

type TVNavigationContextType = {
  navigateToTab: (tabName: string) => void;
  navigateBack: () => boolean;
};

const TVNavigationContext = createContext<TVNavigationContextType>({
  navigateToTab: () => {},
  navigateBack: () => false,
});

export const useTVNavigation = () => useContext(TVNavigationContext);

interface TVNavigationProviderProps {
  children: ReactNode;
}

export const TVNavigationProvider = ({ children }: TVNavigationProviderProps) => {
  const { isTV } = usePlatform();
  const pathname = usePathname();
  
  // Handle back button navigation for TV
  useEffect(() => {
    if (isTV) {
      const handleBackButton = () => {
        if (pathname !== '/' && pathname !== '/(tabs)' && pathname !== '/(tabs)/index') {
          router.back();
          return true;
        }
        return false;
      };
      
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      
      return () => backHandler.remove();
    }
  }, [isTV, pathname]);
  
  const navigateToTab = (tabName: string) => {
    router.navigate(`/(tabs)/${tabName}`);
  };
  
  const navigateBack = () => {
    if (pathname !== '/' && pathname !== '/(tabs)' && pathname !== '/(tabs)/index') {
      router.back();
      return true;
    }
    return false;
  };
  
  const value = {
    navigateToTab,
    navigateBack,
  };
  
  return (
    <TVNavigationContext.Provider value={value}>
      {children}
    </TVNavigationContext.Provider>
  );
};