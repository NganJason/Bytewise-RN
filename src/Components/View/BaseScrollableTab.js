import { Icon } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { capitalizeWords } from '../../_shared/util/string';
import { BaseText } from '../Text';

const BaseScrollableTab = ({
  tabs = [{ name: '', iconName: '', iconType: '' }],
  activeTab = { name: '', iconName: '', iconType: '' },
  onTabChange = function (tab) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderTabs = () => {
    let allTabs = [];

    tabs.map(tab => {
      if (tab.name === '') {
        return;
      }

      allTabs.push(
        <TouchableOpacity
          key={tab.name}
          onPress={() => onTabChange(tab)}
          style={[styles.tab, activeTab.name === tab.name && styles.activeTab]}>
          {tab.iconName !== '' && tab.iconType !== '' && (
            <Icon
              name={tab.iconName}
              type={tab.iconType}
              containerStyle={styles.icon}
              color={
                activeTab.name === tab.name
                  ? theme.colors.color1
                  : theme.colors.black
              }
              size={17}
            />
          )}
          <BaseText
            text4
            style={
              activeTab.name === tab.name
                ? styles.activeTabText
                : styles.tabText
            }>
            {capitalizeWords(tab.name)}
          </BaseText>
        </TouchableOpacity>,
      );
    });

    return allTabs;
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {renderTabs()}
      </ScrollView>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    scrollContainer: {
      padding: 2,
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 9,
      marginRight: 12,
      borderRadius: 15,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    icon: { marginRight: 6 },
    tabText: {
      color: theme.colors.black,
    },
    activeTab: {},
    activeTabText: {
      color: theme.colors.color1,
    },
  });

export default BaseScrollableTab;
