import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STORAGE_KEY = 'browser_token_balance';
const TOKEN_SETTINGS_KEY = 'browser_token_settings';

type TokenContextType = {
  tokenBalance: number;
  tokensEnabled: boolean;
  adBlockingEnabled: boolean;
  shouldShowAd: boolean;
  earnTokens: () => void;
  spendTokens: (amount: number) => boolean;
  resetTokenBalance: () => void;
  setTokensEnabled: (enabled: boolean) => void;
  setAdBlockingEnabled: (enabled: boolean) => void;
  dismissAd: () => void;
  recordBrowsingTime: () => void;
};

const TokenContext = createContext<TokenContextType>({
  tokenBalance: 0,
  tokensEnabled: true,
  adBlockingEnabled: true,
  shouldShowAd: false,
  earnTokens: () => {},
  spendTokens: () => false,
  resetTokenBalance: () => {},
  setTokensEnabled: () => {},
  setAdBlockingEnabled: () => {},
  dismissAd: () => {},
  recordBrowsingTime: () => {},
});

interface TokenSettings {
  tokensEnabled: boolean;
  adBlockingEnabled: boolean;
  lastAdDisplayTime: number;
  lastTokenEarnTime: number;
  browsingTimeMinutes: number;
}

export const useTokenContext = () => useContext(TokenContext);

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider = ({ children }: TokenProviderProps) => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [settings, setSettings] = useState<TokenSettings>({
    tokensEnabled: true,
    adBlockingEnabled: true,
    lastAdDisplayTime: 0,
    lastTokenEarnTime: 0,
    browsingTimeMinutes: 0,
  });
  const [shouldShowAd, setShouldShowAd] = useState(false);
  
  // Load token balance and settings from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedBalance) {
          setTokenBalance(parseInt(storedBalance, 10));
        }
        
        const storedSettings = await AsyncStorage.getItem(TOKEN_SETTINGS_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Error loading token data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Check if we should show an ad
  useEffect(() => {
    if (!settings.tokensEnabled) return;
    
    const now = Date.now();
    const adIntervalMs = 30 * 60 * 1000; // 30 minutes
    const timeSinceLastAd = now - settings.lastAdDisplayTime;
    
    if (timeSinceLastAd > adIntervalMs && settings.browsingTimeMinutes >= 5) {
      setShouldShowAd(true);
    }
  }, [settings]);
  
  const updateTokenBalance = async (newBalance: number) => {
    setTokenBalance(newBalance);
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newBalance.toString());
    } catch (error) {
      console.error('Error saving token balance:', error);
    }
  };
  
  const updateSettings = async (newSettings: Partial<TokenSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      await AsyncStorage.setItem(TOKEN_SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving token settings:', error);
    }
  };
  
  const earnTokens = () => {
    const newBalance = tokenBalance + 5;
    updateTokenBalance(newBalance);
    updateSettings({
      lastTokenEarnTime: Date.now(),
      lastAdDisplayTime: Date.now(),
      browsingTimeMinutes: 0,
    });
    setShouldShowAd(false);
  };
  
  const spendTokens = (amount: number) => {
    if (tokenBalance >= amount) {
      updateTokenBalance(tokenBalance - amount);
      return true;
    }
    return false;
  };
  
  const resetTokenBalance = () => {
    updateTokenBalance(0);
  };
  
  const setTokensEnabled = (enabled: boolean) => {
    updateSettings({ tokensEnabled: enabled });
  };
  
  const setAdBlockingEnabled = (enabled: boolean) => {
    updateSettings({ adBlockingEnabled: enabled });
  };
  
  const dismissAd = () => {
    setShouldShowAd(false);
    updateSettings({
      lastAdDisplayTime: Date.now(),
    });
  };
  
  const recordBrowsingTime = () => {
    updateSettings({
      browsingTimeMinutes: settings.browsingTimeMinutes + 1,
    });
  };
  
  const value = {
    tokenBalance,
    tokensEnabled: settings.tokensEnabled,
    adBlockingEnabled: settings.adBlockingEnabled,
    shouldShowAd,
    earnTokens,
    spendTokens,
    resetTokenBalance,
    setTokensEnabled,
    setAdBlockingEnabled,
    dismissAd,
    recordBrowsingTime,
  };
  
  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};