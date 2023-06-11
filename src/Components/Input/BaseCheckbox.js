import { StyleSheet } from 'react-native';
import { useTheme, CheckBox, Icon } from '@rneui/themed';

const BaseCheckbox = ({
  right = false,
  checked = false,
  title = '',
  value = {},
  onPress = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const onCheck = () => {
    onPress(value);
  };

  return (
    <CheckBox
      right={right}
      title={title}
      checked={checked}
      containerStyle={styles.checkbox}
      textStyle={styles.checkBoxText}
      onPress={onCheck}
      checkedIcon={
        <Icon
          name="radio-button-checked"
          type="material"
          color="green"
          size={20}
          iconStyle={styles.icon}
        />
      }
      uncheckedIcon={
        <Icon
          name="radio-button-unchecked"
          type="material"
          color="grey"
          size={20}
          iconStyle={styles.icon}
        />
      }
    />
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    checkbox: {
      // padding: 0,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    checkBoxText: {
      ...theme.fontStyles.h3,
      alignSelf: 'center',
      color: theme.colors.color4,
    },
  });
};

export default BaseCheckbox;
