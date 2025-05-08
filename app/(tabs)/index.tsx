import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useTVNavigation } from '@/context/TVNavigationContext';
import { usePlatform } from '@/hooks/usePlatform';
import { SearchBar } from '@/components/SearchBar';
import { QuickLinks } from '@/components/QuickLinks';
import { BookmarksList } from '@/components/BookmarksList';
import { useBookmarks } from '@/context/BookmarksContext';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import { TVFocusGuideView } from '@/components/TVFocusGuideView';
import Header from '@/components/Header';

export default function HomeScreen() {
  const { isTV } = usePlatform();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [url, setUrl] = useState('');
  const { recentBookmarks } = useBookmarks();
  
  const handleSearch = (searchText: string) => {
    if (!searchText) return;
    
    let finalUrl = searchText;
    if (!searchText.match(/^https?:\/\//i)) {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;
    }
    
    router.push({
      pathname: '/webview',
      params: { url: finalUrl }
    });
  };

  const windowWidth = Dimensions.get('window').width;
  const smallScreen = windowWidth < 400;

  return (
    <TVFocusGuideView style={styles.container} colors={colors}>
      <Header title="The Browser" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mascotContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/6601811/pexels-photo-6601811.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search or enter website URL"
            value={url}
            onChangeText={setUrl}
            onSubmit={() => handleSearch(url)}
            isTVMode={isTV}
          />
        </View>
        
        {recentBookmarks.length > 0 && (
          <View style={styles.recentBookmarksContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Bookmarks</Text>
            <BookmarksList 
              bookmarks={recentBookmarks.slice(0, 4)} 
              isTV={isTV}
              horizontal={true}
            />
          </View>
        )}
        
        <View style={styles.quickLinksContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Links</Text>
          <QuickLinks isTV={isTV} />
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
  scrollContent: {
    paddingBottom: 40,
  },
  mascotContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  mascotImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  recentBookmarksContainer: {
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  quickLinksContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    marginBottom: 16,
  },
});