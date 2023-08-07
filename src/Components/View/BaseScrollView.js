import { ScrollView, Pressable, StyleSheet } from 'react-native';

const BaseScrollView = ({
  children,
  showsVerticalScrollIndicator,
  onScrollEndDrag,
}) => {
  const styles = getStyles();

  return (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      onScrollEndDrag={onScrollEndDrag}>
      <Pressable style={styles.container}>{children}</Pressable>
    </ScrollView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      // marginBottom: 50,
    },
  });

export default BaseScrollView;
