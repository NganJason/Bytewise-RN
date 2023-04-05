import { StyleSheet } from 'react-native';
import { Tab, useTheme } from '@rneui/themed';

const BaseTabView = ({
  onPress = function () {},
  selectedIndex = 0,
  titles = [],
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Tab
      dense
      value={selectedIndex}
      onChange={onPress}
      disableIndicator
      titleStyle={{ color: theme.colors.primary }}>
      {titles.map((title, i) => (
        <Tab.Item
          key={i}
          title={title}
          containerStyle={[
            styles.tabItem,
            selectedIndex === i ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </Tab>
  );
};

export default BaseTabView;

const getStyles = theme =>
  StyleSheet.create({
    tabItem: {
      borderBottomWidth: 2,
    },
    active: {
      borderBottomColor: theme.colors.primary,
    },
    inactive: {
      borderBottomColor: 'transparent',
    },
  });
