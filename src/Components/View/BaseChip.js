import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseText } from '../Text';

const BaseChip = ({
  containerStyle = {},
  titleStyle = {},
  radius = 15,
  type = 'primary', // primary, secondary
  children,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getBackgroundColor = () => {
    switch (type) {
      case 'primary':
        return { backgroundColor: theme.colors.color3 };
      case 'secondary':
        return { backgroundColor: theme.colors.color13 };
      default:
        return { backgroundColor: theme.colors.color3 };
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'primary':
        return { color: theme.colors.color1 };
      case 'secondary':
        return { color: theme.colors.color12 };
      default:
        return { color: theme.colors.color1 };
    }
  };

  return (
    <View
      style={{
        ...styles.chip,
        ...getBackgroundColor(),
        ...containerStyle,
        borderRadius: radius,
      }}>
      <BaseText
        style={{ ...styles.chipText, ...getTextColor(), ...titleStyle }}>
        {children}
      </BaseText>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    chip: {
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 15,
      alignSelf: 'flex-start',
    },
    chipText: {
      ...theme.fontStyles.text4,
    },
  });

export default BaseChip;
