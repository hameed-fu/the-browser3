import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark } from '@/types/bookmarks';

const BOOKMARKS_STORAGE_KEY = 'browser_bookmarks';

type BookmarksContextType = {
  bookmarks: Bookmark[];
  recentBookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (url: string) => void;
  editBookmark: (url: string, updatedBookmark: Bookmark) => void;
  isBookmarked: (url: string) => boolean;
};

const BookmarksContext = createContext<BookmarksContextType>({
  bookmarks: [],
  recentBookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  editBookmark: () => {},
  isBookmarked: () => false,
});

export const useBookmarks = () => useContext(BookmarksContext);

interface BookmarksProviderProps {
  children: ReactNode;
}

export const BookmarksProvider = ({ children }: BookmarksProviderProps) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  // Load bookmarks from storage
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };
    
    loadBookmarks();
  }, []);
  
  // Update storage when bookmarks change
  const saveBookmarks = async (updatedBookmarks: Bookmark[]) => {
    try {
      await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };
  
  const addBookmark = (bookmark: Bookmark) => {
    const newBookmarks = [
      { ...bookmark, dateAdded: new Date().toISOString() },
      ...bookmarks.filter(b => b.url !== bookmark.url)
    ];
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };
  
  const removeBookmark = (url: string) => {
    const newBookmarks = bookmarks.filter(bookmark => bookmark.url !== url);
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };
  
  const editBookmark = (url: string, updatedBookmark: Bookmark) => {
    const newBookmarks = bookmarks.map(bookmark => 
      bookmark.url === url ? { ...updatedBookmark, dateAdded: bookmark.dateAdded } : bookmark
    );
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };
  
  const isBookmarked = (url: string) => {
    return bookmarks.some(bookmark => bookmark.url === url);
  };
  
  // Get recent bookmarks sorted by date
  const recentBookmarks = [...bookmarks]
    .sort((a, b) => {
      const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
      const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
      return dateB - dateA;
    });
  
  const value = {
    bookmarks,
    recentBookmarks,
    addBookmark,
    removeBookmark,
    editBookmark,
    isBookmarked,
  };
  
  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};