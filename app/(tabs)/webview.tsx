import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';
import { usePlatform } from '@/hooks/usePlatform';
import { useBookmarks } from '@/context/BookmarksContext';
import { useTokenSystem } from '@/hooks/useTokenSystem';
import { ArrowLeft, ArrowRight, X, RotateCcw, Bookmark, BookmarkPlus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { WebviewControls } from '@/components/WebviewControls';
import { TVFocusGuideView } from '@/components/TVFocusGuideView';
import { AdBanner } from '@/components/AdBanner';
import { SafeAreaView } from 'react-native-safe-area-context';

// Create a forwarded ref version of WebView for all platforms
const ForwardedWebView = React.forwardRef((props, ref) => <WebView {...props} ref={ref} />);

export default function WebViewScreen() {
  const { url: initialUrl } = useLocalSearchParams<{ url: string }>();
  const { isTV } = usePlatform();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const webviewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { shouldShowAd, recordBrowsingTime } = useTokenSystem();

  // Update currentUrl when initialUrl changes
  useEffect(() => {
    if (initialUrl) {
      setCurrentUrl(initialUrl);
      // Reset WebView state
      setCanGoBack(false);
      setCanGoForward(false);
      setTitle('');
      if (webviewRef.current) {
        webviewRef.current.reload();
      }
    }
  }, [initialUrl]);
  
  // Track browsing time for token rewards
  useEffect(() => {
    const interval = setInterval(() => {
      recordBrowsingTime();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        if (canGoBack && webviewRef.current) {
          webviewRef.current.goBack();
          return true; // Prevent default behavior
        }
        return false; // Let default behavior occur (exit app)
      };
      
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [canGoBack]);
  
  const goBack = () => {
    if (webviewRef.current) {
      webviewRef.current.goBack();
    }
  };
  
  const goForward = () => {
    if (webviewRef.current) {
      webviewRef.current.goForward();
    }
  };
  
  const reload = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };
  
  const closeWebView = () => {
    // Reset state before navigating back
    setCurrentUrl('');
    setTitle('');
    setCanGoBack(false);
    setCanGoForward(false);
    router.back();
  };
  
  const toggleBookmark = () => {
    if (isBookmarked(currentUrl)) {
      removeBookmark(currentUrl);
    } else {
      addBookmark({
        url: currentUrl,
        title: title || currentUrl,
        favicon: `https://www.google.com/s2/favicons?domain=${currentUrl}&sz=64`
      });
    }
  };
  
  const bookmarked = isBookmarked(currentUrl);
  
  // JavaScript to inject for ad blocking
  const adBlockScript = `
    (function() {
      function hideAds() {
        const adSelectors = [
          'div[id*="google_ads"]',
          'ins.adsbygoogle',
          'div[id*="advertisement"]',
          'div[class*="ad-"]',
          'div[class*="Ad-"]',
          'div[class*="AD-"]',
          'div[class*="ad_"]',
          'div[class*="Ad_"]',
          'div[class*="AD_"]',
          'iframe[src*="doubleclick.net"]',
          'iframe[src*="googleadservices"]',
          'iframe[src*="advertising"]',
          'iframe[id*="google_ads"]',
          '[data-ad]',
          '[data-ad-unit]',
          '[data-ad-slot]'
        ];
        
        adSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
          }
        });
      }
      
      // Run immediately and then on interval
      hideAds();
      setInterval(hideAds, 1000);
    })();
  `;

  // Don't render anything if there's no URL
  if (!currentUrl) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TVFocusGuideView style={styles.container} colors={colors}>
        {!isTV && (
          <WebviewControls
            title={title || currentUrl}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            isBookmarked={bookmarked}
            onBack={goBack}
            onForward={goForward}
            onRefresh={reload}
            onClose={closeWebView}
            onBookmark={toggleBookmark}
          />
        )}
        
        <View style={styles.webviewContainer}>
          <ForwardedWebView
            key={currentUrl} // Add key to force re-render on URL change
            ref={webviewRef}
            source={{ uri: currentUrl }}
            style={styles.webview}
            incognito={true}
            javaScriptEnabled={true}
            thirdPartyCookiesEnabled={false}
            sharedCookiesEnabled={false}
            cacheEnabled={false}
            allowsBackForwardNavigationGestures={true}
            injectedJavaScript={adBlockScript}
            onNavigationStateChange={(navState) => {
              setCurrentUrl(navState.url);
              setTitle(navState.title || '');
              setCanGoBack(navState.canGoBack);
              setCanGoForward(navState.canGoForward);
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.tint} />
            </View>
          )}
        </View>
        
        {isTV && (
          <View style={styles.tvControlsContainer}>
            <TouchableOpacity 
              style={[styles.tvControlButton, { backgroundColor: colors.card }]} 
              onPress={goBack} 
              disabled={!canGoBack}
            >
              <ArrowLeft size={24} color={canGoBack ? colors.text : colors.tabIconDefault} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tvControlButton, { backgroundColor: colors.card }]} 
              onPress={goForward} 
              disabled={!canGoForward}
            >
              <ArrowRight size={24} color={canGoForward ? colors.text : colors.tabIconDefault} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tvControlButton, { backgroundColor: colors.card }]} 
              onPress={reload}
            >
              <RotateCcw size={24} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tvControlButton, { backgroundColor: colors.card }]} 
              onPress={toggleBookmark}
            >
              {bookmarked ? (
                <Bookmark size={24} color={colors.tint} />
              ) : (
                <BookmarkPlus size={24} color={colors.text} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tvControlButton, { backgroundColor: colors.card }]} 
              onPress={closeWebView}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
        
        {shouldShowAd && <AdBanner />}
      </TVFocusGuideView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tvControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#1A1A1A',
  },
  tvControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
});