import { Icon } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { BaseText } from '../Text';
import { capitalize } from '../../_shared/util';

const BaseScrollableTab = ({
  tabs = [{ name: '', iconName: '', iconType: '' }],
  activeTabIdx = 0,
  onTabChange = function (idx) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const activeColor = theme.colors.color1;
  const inActiveColor = theme.colors.black;

  const renderTabs = () => {
    const allTabs = [];

    tabs.map((tab, idx) => {
      allTabs.push(
        <TouchableOpacity
          key={idx}
          onPress={() => onTabChange(idx)}
          style={styles.tab}>
          {tab.iconName !== '' && tab.iconType !== '' && (
            <Icon
              name={tab.iconName}
              type={tab.iconType}
              containerStyle={styles.icon}
              color={idx === activeTabIdx ? activeColor : inActiveColor}
              size={17}
            />
          )}
          <BaseText
            text4
            style={{
              color: idx === activeTabIdx ? activeColor : inActiveColor,
            }}>
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
      margin: 4,
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
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    icon: { marginRight: 6 },
  });

export default BaseScrollableTab;
