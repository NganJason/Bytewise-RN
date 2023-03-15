import { StyleSheet } from 'react-native';
import { Divider, useTheme } from '@rneui/themed';

const HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical';

const BaseDivider = ({ orientation = HORIZONTAL, margin = 0 }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    divider: {
      marginHorizontal: orientation === VERTICAL && margin,
      marginVertical: orientation === HORIZONTAL && margin,
    },
  });

  return (
    <Divider
      orientation={orientation}
      color={theme.colors.grey3}
      style={styles.divider}
    />
  );
};

export default BaseDivider;
