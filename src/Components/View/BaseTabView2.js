import { useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const BaseTabView2 = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeTab, setActiveTab] = useState('Tab1'); // Initial active tab

  const handleTabPress = tab => {
    setActiveTab(tab);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'Tab1' && styles.activeTabButton,
        ]}
        onPress={() => handleTabPress('Tab1')}>
        <Text
          style={[
            styles.tabButtonText,
            activeTab === 'Tab1' && styles.activeTabButtonText,
          ]}>
          Income
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'Tab2' && styles.activeTabButton,
        ]}
        onPress={() => handleTabPress('Tab2')}>
        <Text
          style={[
            styles.tabButtonText,
            activeTab === 'Tab2' && styles.activeTabButtonText,
          ]}>
          Expense
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      marginBottom: 10,
    },
    tabButton: {
      minWidth: '45%',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 18,
      marginHorizontal: 10,
      backgroundColor: theme.colors.color4,
    },
    activeTabButton: {
      backgroundColor: '#015239',
    },
    tabButtonText: {
      ...theme.fontStyles.text1,
      color: '#015239',
    },
    activeTabButtonText: {
      ...theme.fontStyles.text1,
      color: theme.colors.white,
    },
  });
export default BaseTabView2;
