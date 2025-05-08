import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isTVMode?: boolean;
}

export function SearchBar({ 
  placeholder, 
  value, 
  onChangeText, 
  onSubmit,
  isTVMode = false
}: SearchBarProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: isFocused ? colors.tint : colors.border,
        },
        isTVMode && styles.tvContainer
      ]}
    >
      <Search 
        size={20} 
        color={colors.textSecondary}
        style={styles.searchIcon} 
      />
      
      <TextInput
        style={[
          styles.input, 
          { color: colors.text },
          isTVMode && styles.tvInput
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSubmit}
        blurOnSubmit
        hasTVPreferredFocus={isTVMode}
      />
      
      {value.length > 0 && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
        >
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => onChangeText('')}
          >
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  tvContainer: {
    height: 56,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  tvInput: {
    fontSize: 18,
  },
  clearButton: {
    padding: 4,
  },
});