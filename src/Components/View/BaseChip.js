import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseText } from '../Text';

const BaseChip = ({
  containerStyle = {},
  titleStyle = {},
  radius = 15,
  children,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={{
        ...styles.chip,
        ...containerStyle,
        borderRadius: radius,
      }}>
      <BaseText style={{ ...styles.chipText, ...titleStyle }}>
        {children}
      </BaseText>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    chip: {
      marginLeft: 10,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 15,
      backgroundColor: theme.colors.color3,
    },
    chipText: {
      ...theme.fontStyles.text4,
      color: theme.colors.color1,
    },
  });

export default BaseChip;
