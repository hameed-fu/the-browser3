import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { usePlatform } from '@/hooks/usePlatform';

interface TVFocusGuideViewProps {
  children: ReactNode;
  style?: ViewStyle;
  colors: {
    background: string;
  };
}

export function TVFocusGuideView({ children, style, colors }: TVFocusGuideViewProps) {
  const { isTV } = usePlatform();
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colors.background },
        style,
        isTV && styles.tvContainer
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tvContainer: {
    padding: 24,
  },
});