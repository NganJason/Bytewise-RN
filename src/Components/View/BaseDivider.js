import { StyleSheet } from 'react-native';
import { Divider, useTheme } from '@rneui/themed';

const HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical';

const BaseDivider = ({ orientation = HORIZONTAL, margin = 0, width = 2 }) => {
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
      color={theme.colors.color4}
      style={styles.divider}
      width={width}
    />
  );
};

export default BaseDivider;
