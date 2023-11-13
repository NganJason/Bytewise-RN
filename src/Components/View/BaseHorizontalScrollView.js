import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const BaseHorizontalScrollView = ({ children }) => {
  const styles = getStyles();
  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
};

const getStyles = () =>
  StyleSheet.create({
    scrollView: {
      paddingVertical: 10,
    },
  });

export default BaseHorizontalScrollView;
