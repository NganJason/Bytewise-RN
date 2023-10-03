import { Icon } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { capitalize } from '../../_shared/util';
import { BaseText } from '../Text';

const BaseScrollableTab = ({
  tabs = [{ name: '', iconName: '', iconType: '' }],
  activeTab = { name: '', iconName: '', iconType: '' },
  onTabChange = function (tab, idx) {},
  disableNonActive = false,
  highlightActiveTab = true,
  hideNonActive = false,
  highlightedTabs = [],
  highlightedColors = null,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isActive = tabName => {
    return activeTab.name === tabName;
  };

  const shouldHide = tabName => {
    return hideNonActive && !isActive(tabName);
  };

  const shouldDisable = tabName => {
    return disableNonActive && !isActive(tabName);
  };

  const getTextStyle = tabName => {
    if (shouldHighlightTab(tabName)) {
      return {
        color: highlightedColors ? highlightedColors : theme.colors.color1,
      };
    }
    if (shouldDisable(tabName)) {
      return styles.disabledTabText;
    }
    return styles.tabText;
  };

  const getIconColor = tabName => {
    if (shouldHighlightTab(tabName)) {
      return highlightedColors ? highlightedColors : theme.colors.color1;
    }
    if (shouldDisable(tabName)) {
      return theme.colors.color8;
    }
    return theme.colors.black;
  };

  const shouldHighlightTab = tabName => {
    if (activeTab.name === tabName && highlightActiveTab) {
      return true;
    }

    if (highlightedTabs.some(d => d.name === tabName)) {
      return true;
    }

    return false;
  };

  const renderTabs = () => {
    let allTabs = [];

    tabs.map((tab, idx) => {
      if (tab.name === '') {
        return;
      }

      if (shouldHide(tab.name)) {
        return;
      }

      allTabs.push(
        <TouchableOpacity
          key={tab.name}
          onPress={() => onTabChange(tab, idx)}
          disabled={shouldDisable(tab.name)}
          style={styles.tab}>
          {tab.iconName !== '' && tab.iconType !== '' && (
            <Icon
              name={tab.iconName}
              type={tab.iconType}
              containerStyle={styles.icon}
              color={getIconColor(tab.name)}
              size={17}
            />
          )}
          <BaseText text4 style={getTextStyle(tab.name)}>
            {capitalize(tab.name)}
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
    disabledTabText: {
      color: theme.colors.color8,
    },
  });

export default BaseScrollableTab;
