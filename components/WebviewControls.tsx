import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, ArrowRight, RotateCcw, X, Bookmark, BookmarkPlus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';

interface WebviewControlsProps {
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isBookmarked: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onClose: () => void;
  onBookmark: () => void;
}

export function WebviewControls({
  title,
  canGoBack,
  canGoForward,
  isBookmarked,
  onBack,
  onForward,
  onRefresh,
  onClose,
  onBookmark
}: WebviewControlsProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.leftControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onBack}
          disabled={!canGoBack}
        >
          <ArrowLeft size={20} color={canGoBack ? colors.text : colors.tabIconDefault} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onForward}
          disabled={!canGoForward}
        >
          <ArrowRight size={20} color={canGoForward ? colors.text : colors.tabIconDefault} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onRefresh}
        >
          <RotateCcw size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
      
      <View style={styles.rightControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onBookmark}
        >
          {isBookmarked ? (
            <Bookmark size={20} color={colors.tint} />
          ) : (
            <BookmarkPlus size={20} color={colors.text} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onClose}
        >
          <X size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    borderRadius: 20,
  },
});