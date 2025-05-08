import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { SettingItem } from './SettingItem';

interface SearchEngineSelectorProps {
  currentEngine: string;
  onSelect: (engine: string) => void;
  isTV: boolean;
  colors: {
    text: string;
    textSecondary: string;
    background: string;
    card: string;
    border: string;
    tint: string;
  };
}

export function SearchEngineSelector({ 
  currentEngine, 
  onSelect, 
  isTV,
  colors
}: SearchEngineSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const engines = [
    'Google',
    'DuckDuckGo',
    'Bing',
  ];
  
  const handleOpenModal = () => {
    if (!isTV) {
      setModalVisible(true);
    }
  };
  
  const handleSelect = (engine: string) => {
    onSelect(engine);
    setModalVisible(false);
  };
  
  return (
    <>
      <SettingItem
        title="Search Engine"
        description="Choose your default search engine"
        onPress={handleOpenModal}
        isTV={isTV}
      >
        <View style={styles.engineSelector}>
          <Text style={[styles.engineText, { color: colors.text }]}>
            {currentEngine}
          </Text>
          <ChevronDown size={16} color={colors.text} />
        </View>
      </SettingItem>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Search Engine
            </Text>
            
            <FlatList
              data={engines}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.engineItem,
                    currentEngine === item && { backgroundColor: colors.tint + '33' } // 20% opacity
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[
                    styles.engineItemText,
                    { color: colors.text },
                    currentEngine === item && { fontWeight: 'bold', color: colors.tint }
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  engineSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engineText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    marginBottom: 16,
  },
  engineItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 8,
  },
  engineItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
});