import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Bookmark } from '@/types/bookmarks';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  isTV: boolean;
  horizontal?: boolean;
}

export function BookmarksList({ bookmarks, isTV, horizontal = false }: BookmarksListProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  const handleBookmarkPress = (url: string) => {
    router.push({
      pathname: '/webview',
      params: { url }
    });
  };

  if (horizontal) {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContainer}
      >
        {bookmarks.map((bookmark) => (
          <TouchableOpacity
            key={bookmark.url}
            style={[
              styles.horizontalItem,
              { backgroundColor: colors.card },
              isTV && styles.tvHorizontalItem
            ]}
            onPress={() => handleBookmarkPress(bookmark.url)}
          >
            <Image
              source={{ uri: bookmark.favicon || 'https://www.google.com/s2/favicons?domain=google.com&sz=64' }}
              style={styles.horizontalItemIcon}
            />
            <Text
              style={[
                styles.horizontalItemTitle,
                { color: colors.text },
                isTV && styles.tvText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {bookmark.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {bookmarks.map((bookmark) => (
        <TouchableOpacity
          key={bookmark.url}
          style={[
            styles.item,
            { backgroundColor: colors.card },
            isTV && styles.tvItem
          ]}
          onPress={() => handleBookmarkPress(bookmark.url)}
        >
          <Image
            source={{ uri: bookmark.favicon || 'https://www.google.com/s2/favicons?domain=google.com&sz=64' }}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                isTV && styles.tvText
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
                isTV && styles.tvUrlText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {bookmark.url}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  horizontalContainer: {
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tvItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  horizontalItem: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  tvHorizontalItem: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  horizontalItemIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  horizontalItemTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  url: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  tvText: {
    fontSize: 18,
  },
  tvUrlText: {
    fontSize: 14,
  },
});