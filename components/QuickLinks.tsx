import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';

interface QuickLinkProps {
  title: string;
  url: string;
  imageUrl: string;
  isTV: boolean;
  onPress: () => void;
}

const QuickLink = ({ title, imageUrl, isTV, onPress }: QuickLinkProps) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  
  return (
    <TouchableOpacity 
      style={[
        styles.quickLinkButton, 
        { backgroundColor: colors.card },
        isTV && styles.tvQuickLink
      ]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: imageUrl }}
        style={styles.quickLinkImage}
        resizeMode="contain"
      />
      <Text 
        style={[
          styles.quickLinkText, 
          { color: colors.text },
          isTV && styles.tvQuickLinkText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

interface QuickLinksProps {
  isTV: boolean;
}

export function QuickLinks({ isTV }: QuickLinksProps) {
  const quickLinks = [
    {
      title: 'YouTube',
      url: 'https://www.youtube.com/',
      imageUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128'
    },
    {
      title: 'Hulu',
      url: 'https://www.hulu.com/',
      imageUrl: 'https://www.google.com/s2/favicons?domain=hulu.com&sz=128'
    },
    {
      title: 'Tubi',
      url: 'https://tubitv.com/',
      imageUrl: 'https://www.google.com/s2/favicons?domain=tubitv.com&sz=128'
    },
    {
      title: 'Netflix',
      url: 'https://www.netflix.com/',
      imageUrl: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128'
    }
  ];
  
  const handleQuickLinkPress = (url: string) => {
    router.push({
      pathname: '/webview',
      params: { url }
    });
  };
  
  return (
    <View style={styles.container}>
      {quickLinks.map((link) => (
        <QuickLink
          key={link.title}
          title={link.title}
          url={link.url}
          imageUrl={link.imageUrl}
          isTV={isTV}
          onPress={() => handleQuickLinkPress(link.url)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickLinkButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  tvQuickLink: {
    paddingVertical: 24,
    borderRadius: 12,
  },
  quickLinkImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  quickLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  tvQuickLinkText: {
    fontSize: 16,
  },
});