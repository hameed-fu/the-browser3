import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import { router, usePathname } from 'expo-router';
import { usePlatform } from '@/hooks/usePlatform';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function Header({ title, showBackButton = false }: HeaderProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const pathname = usePathname();
  const { isTV } = usePlatform();
  
  const handleBack = () => {
    router.back();
  };
  
  // For home screen on TV, we don't need a header
  if (isTV && pathname === '/(tabs)') {
    return null;
  }
  
  return (
    <SafeAreaView style={{ backgroundColor: colors.card }}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        
        {showBackButton && <View style={styles.placeholder} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  title: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
});