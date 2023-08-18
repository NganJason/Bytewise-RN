import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

const BaseProgressTab = ({ numTab = 0, activeTab = 0 }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isTabActive = idx => {
    return activeTab === idx;
  };

  const renderTabs = () => {
    let tabs = [];

    for (let step = 0; step < numTab; step++) {
      tabs.push(
        <View
          key={step}
          style={[
            styles.tab,
            isTabActive(step) ? styles.activeTab : styles.inactiveTab,
          ]}
        />,
      );
    }

    return tabs;
  };

  return <View style={styles.tabContainer}>{renderTabs()}</View>;
};

const getStyles = theme => {
  return StyleSheet.create({
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    tab: {
      width: 10,
      height: 10,
      borderRadius: 100,
      marginHorizontal: 12,
    },
    activeTab: {
      width: 16,
      backgroundColor: theme.colors.color1,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    inactiveTab: {
      backgroundColor: theme.colors.color9,
    },
  });
};

export default BaseProgressTab;
