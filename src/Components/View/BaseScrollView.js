import { ScrollView, Pressable, StyleSheet, View } from 'react-native';

const BaseScrollView = ({
  children,
  showsVerticalScrollIndicator,
  onScrollEndDrag,
  containerStyle = {},
  ...props
}) => {
  const styles = getStyles();

  return (
    <ScrollView
      {...props}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      onScrollEndDrag={onScrollEndDrag}>
      <View style={[styles.container, containerStyle]}>{children}</View>
    </ScrollView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    scrollContainer: { minHeight: '100%' },
    container: {
      flex: 1,
      marginBottom: 20,
    },
  });

export default BaseScrollView;
