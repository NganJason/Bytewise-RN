import { ScrollView, Pressable, StyleSheet } from 'react-native';

const BaseScrollView = ({
  children,
  showsVerticalScrollIndicator,
  onScrollEndDrag,
}) => {
  const styles = getStyles();

  return (
    <ScrollView
      contentContainerStyle={{ minHeight: '100%' }}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      onScrollEndDrag={onScrollEndDrag}>
      <Pressable style={styles.container}>{children}</Pressable>
    </ScrollView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 20,
    },
  });

export default BaseScrollView;
