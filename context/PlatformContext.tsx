import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

type PlatformContextType = {
  isTV: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isWeb: boolean;
};

const PlatformContext = createContext<PlatformContextType>({
  isTV: false,
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  isWeb: Platform.OS === 'web',
});

export const usePlatform = () => useContext(PlatformContext);

interface PlatformProviderProps {
  children: ReactNode;
}

export const PlatformProvider = ({ children }: PlatformProviderProps) => {
  const [isTV, setIsTV] = useState(false);
  
  useEffect(() => {
    const detectTV = async () => {
      if (Platform.OS === 'android') {
        const deviceType = await Device.getDeviceTypeAsync();
        const isTVDevice = deviceType === Device.DeviceType.TV;
        setIsTV(isTVDevice);
      }
    };
    
    detectTV();
  }, []);
  
  const value = {
    isTV,
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    isWeb: Platform.OS === 'web',
  };
  
  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};