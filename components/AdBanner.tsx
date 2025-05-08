import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { X } from 'lucide-react-native';
import { useTokenSystem } from '@/hooks/useTokenSystem';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

export function AdBanner() {
  const { earnTokens, dismissAd } = useTokenSystem();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [timeLeft, setTimeLeft] = useState(5);
  const [canEarn, setCanEarn] = useState(false);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanEarn(true);
    }
  }, [timeLeft]);
  
  const handleEarnTokens = () => {
    earnTokens();
  };
  
  return (
    <Animated.View 
      style={[styles.container, { backgroundColor: colors.card }]}
      entering={FadeInDown}
      exiting={FadeOutDown}
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={dismissAd}
      >
        <X size={16} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=300' }}
          style={styles.adImage}
          resizeMode="cover"
        />
        
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            Earn Gizmo Tokens!
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Thanks for browsing with us. Earn tokens to unlock premium features.
          </Text>
          
          <TouchableOpacity
            style={[
              styles.earnButton,
              canEarn ? { backgroundColor: colors.tint } : { backgroundColor: colors.tabIconDefault }
            ]}
            onPress={handleEarnTokens}
            disabled={!canEarn}
          >
            <Text style={styles.earnButtonText}>
              {canEarn ? 'Earn Tokens Now' : `Wait ${timeLeft}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 12,
  },
  earnButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  earnButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: 'white',
  },
});