import { StyleSheet } from 'react-native';
import { useTheme, CheckBox } from '@rneui/themed';

const BaseCheckbox = ({
  right = false,
  checked = false,
  title = '',
  onPress = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <CheckBox
      right={right}
      title={title}
      checked={checked}
      containerStyle={styles.checkbox}
      textStyle={styles.checkBoxText}
      onPress={onPress}
    />
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    checkbox: {
      padding: 0,
    },
    checkBoxText: {
      ...theme.fontStyles.h3,
      alignSelf: 'center',
      color: theme.colors.color4,
    },
  });
};

export default BaseCheckbox;
