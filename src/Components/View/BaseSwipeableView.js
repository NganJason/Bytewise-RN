import { TabView, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const BaseSwipeableView = ({ items = [], enableDotIndicator = false }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [tabIdx, setTabIdx] = useState(0);

  return (
    <View style={styles.container}>
      {enableDotIndicator && items.length > 1 && (
        <View style={styles.dotContainer}>
          {items.map((_, idx) => {
            return <Dot key={idx} isActive={idx === tabIdx} />;
          })}
        </View>
      )}

      <TabView value={tabIdx} onChange={setTabIdx}>
        {items.map((item, idx) => (
          <TabView.Item style={styles.tabViewContainer} key={idx}>
            {item}
          </TabView.Item>
        ))}
      </TabView>
    </View>
  );
};

const Dot = ({ isActive = false }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return <View style={[styles.dot, isActive && styles.activeDot]} />;
};

const getStyles = theme =>
  StyleSheet.create({
    dotContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    dot: {
      height: 8,
      width: 8,
      borderRadius: 100,
      backgroundColor: theme.colors.color9,
      marginHorizontal: 8,
    },
    activeDot: {
      backgroundColor: theme.colors.color8,
    },
    container: {
      flex: 1,
    },
    tabViewContainer: {
      flex: 1,
    },
  });

export default BaseSwipeableView;
