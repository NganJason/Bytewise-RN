import { StyleSheet } from 'react-native';
import { Icon, useTheme } from '@rneui/themed';
import { BaseText } from '../Text';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BaseCheckbox = ({
  checked = false,
  title = '',
  value = {},
  onPress = function () {},
  containerStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const onCheck = () => {
    onPress(value);
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onCheck}>
      <Icon
        name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
        type="material-community"
        color={checked ? theme.colors.color1 : theme.colors.color8}
        size={22}
        style={styles.icon}
      />
      <BaseText text2 style={styles.checkBoxText} adjustsFontSizeToFit>
        {title}
      </BaseText>
    </TouchableOpacity>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkBoxText: {
      flex: 1,
      color: theme.colors.color6,
      flexWrap: 'wrap',
      marginLeft: 8,
    },
  });
};

export default BaseCheckbox;
