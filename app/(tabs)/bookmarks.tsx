import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useBookmarks } from '@/context/BookmarksContext';
import { usePlatform } from '@/hooks/usePlatform';
import { TVFocusGuideView } from '@/components/TVFocusGuideView';
import { BookmarkItem } from '@/components/BookmarkItem';
import Header from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import { Plus } from 'lucide-react-native';

export default function BookmarksScreen() {
  const { bookmarks, removeBookmark, editBookmark } = useBookmarks();
  const { isTV } = usePlatform();
  const { theme } = useTheme();
  const colors = Colors[theme];
  
  const handleBookmarkPress = (url: string) => {
    router.push({
      pathname: '/webview',
      params: { url }
    });
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        No bookmarks yet. Add some while browsing!
      </Text>
    </View>
  );
  
  return (
    <TVFocusGuideView style={styles.container} colors={colors}>
      <Header title="Bookmarks" />
      
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <BookmarkItem
            bookmark={item}
            onPress={() => handleBookmarkPress(item.url)}
            onDelete={() => removeBookmark(item.url)}
            onEdit={(newTitle) => 
              editBookmark(item.url, { ...item, title: newTitle })
            }
            isTV={isTV}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
      
      {!isTV && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={() => router.push('/webview')}
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      )}
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for the add button
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 80,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});