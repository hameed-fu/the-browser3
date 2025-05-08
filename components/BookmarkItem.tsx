import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Bookmark } from '@/types/bookmarks';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onPress: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
  isTV: boolean;
}

export function BookmarkItem({ bookmark, onPress, onDelete, onEdit, isTV }: BookmarkItemProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(bookmark.title);
  
  const handleEdit = () => {
    setEditTitle(bookmark.title);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(editTitle.trim());
      setIsEditing(false);
    } else {
      Alert.alert('Error', 'Title cannot be empty');
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(bookmark.title);
  };
  
  const confirmDelete = () => {
    Alert.alert(
      'Delete Bookmark',
      `Are you sure you want to delete "${bookmark.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: onDelete,
          style: 'destructive'
        }
      ]
    );
  };
  
  if (isEditing) {
    return (
      <Animated.View 
        style={[
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.tint },
          styles.editingContainer
        ]}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <TextInput
          style={[styles.editInput, { color: colors.text }]}
          value={editTitle}
          onChangeText={setEditTitle}
          autoFocus
          selectTextOnFocus
        />
        
        <View style={styles.editButtons}>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.tint }]}
            onPress={handleSave}
          >
            <Text style={styles.editButtonText}>Save</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleCancel}
          >
            <Text style={[styles.editButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card },
        isTV && styles.tvContainer
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: bookmark.favicon || 'https://www.google.com/s2/favicons?domain=google.com&sz=64' }}
        style={styles.favicon}
      />
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            { color: colors.text },
            isTV && styles.tvTitle
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {bookmark.title}
        </Text>
        
        <Text 
          style={[
            styles.url, 
            { color: colors.textSecondary },
            isTV && styles.tvUrl
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {bookmark.url}
        </Text>
      </View>
      
      {!isTV && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEdit}
          >
            <Edit2 size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={confirmDelete}
          >
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tvContainer: {
    padding: 16,
    borderRadius: 12,
  },
  editingContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    borderWidth: 2,
  },
  favicon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  tvTitle: {
    fontSize: 18,
  },
  url: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  tvUrl: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  editInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  editButtonText: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    fontSize: 14,
  },
});