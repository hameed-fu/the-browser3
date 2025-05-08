import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTokenSystem } from '@/hooks/useTokenSystem';
import { usePlatform } from '@/hooks/usePlatform';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import { TVFocusGuideView } from '@/components/TVFocusGuideView';
import Header from '@/components/Header';
import { SettingItem } from '@/components/SettingItem';
import { SearchEngineSelector } from '@/components/SearchEngineSelector';

export default function SettingsScreen() {
  const { isTV } = usePlatform();
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const { 
    adBlockingEnabled, 
    setAdBlockingEnabled,
    tokensEnabled,
    setTokensEnabled,
    tokenBalance,
    resetTokenBalance
  } = useTokenSystem();
  
  const [searchEngine, setSearchEngine] = useState('Google');
  
  const confirmReset = () => {
    Alert.alert(
      'Reset Tokens',
      'Are you sure you want to reset your token balance?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          onPress: resetTokenBalance,
          style: 'destructive'
        }
      ]
    );
  };
  
  return (
    <TVFocusGuideView style={styles.container} colors={colors}>
      <Header title="Settings" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Browser Settings</Text>
          
          <SettingItem
            title="Dark Theme"
            description="Use dark colors for the app interface"
            isTV={isTV}
          >
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.tint }}
              thumbColor="#f4f3f4"
            />
          </SettingItem>
          
          <SettingItem
            title="Ad Blocking"
            description="Block most ads while browsing"
            isTV={isTV}
          >
            <Switch
              value={adBlockingEnabled}
              onValueChange={setAdBlockingEnabled}
              trackColor={{ false: '#767577', true: colors.tint }}
              thumbColor="#f4f3f4"
            />
          </SettingItem>
          
          <SearchEngineSelector
            currentEngine={searchEngine}
            onSelect={setSearchEngine}
            isTV={isTV}
            colors={colors}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tokens & Rewards</Text>
          
          <SettingItem
            title="Enable Tokens"
            description="Earn tokens while browsing to unlock features"
            isTV={isTV}
          >
            <Switch
              value={tokensEnabled}
              onValueChange={setTokensEnabled}
              trackColor={{ false: '#767577', true: colors.tint }}
              thumbColor="#f4f3f4"
            />
          </SettingItem>
          
          <View style={styles.tokenBalanceContainer}>
            <Text style={[styles.tokenBalanceLabel, { color: colors.text }]}>
              Current Token Balance:
            </Text>
            <Text style={[styles.tokenBalance, { color: colors.tint }]}>
              {tokenBalance}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.resetButton,
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}
            onPress={confirmReset}
          >
            <Text style={[styles.resetButtonText, { color: colors.error }]}>
              Reset Token Balance
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={[styles.appName, { color: colors.text }]}>
              Private Browser App
            </Text>
            <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
              A privacy-focused browser with ad blocking and TV optimization.
            </Text>
          </View>
        </View>
      </ScrollView>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    marginBottom: 16,
    marginTop: 8,
  },
  tokenBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginBottom: 16,
  },
  tokenBalanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  tokenBalance: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  resetButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  aboutContainer: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  appName: {
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  appDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
});