import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';

interface SettingItemProps {
  title: string;
  description?: string;
  children?: ReactNode;
  onPress?: () => void;
  isTV?: boolean;
}

export function SettingItem({ 
  title, 
  description, 
  children, 
  onPress,
  isTV = false
}: SettingItemProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: colors.card },
        isTV && styles.tvContainer
      ]}
      onPress={onPress}
    >
      <View style={styles.textContainer}>
        <Text 
          style={[
            styles.title, 
            { color: colors.text },
            isTV && styles.tvTitle
          ]}
        >
          {title}
        </Text>
        
        {description && (
          <Text 
            style={[
              styles.description, 
              { color: colors.textSecondary },
              isTV && styles.tvDescription
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      
      {children && (
        <View style={styles.controlContainer}>
          {children}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tvContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  tvTitle: {
    fontSize: 18,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  tvDescription: {
    fontSize: 14,
  },
  controlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});