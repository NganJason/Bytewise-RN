import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { BaseText } from '../Text';
import { IconButton } from '../Touch';

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
    <View style={[styles.container, containerStyle]}>
      <IconButton
        iconName={checked ? 'radio-button-checked' : 'radio-button-unchecked'}
        iconType="material"
        color={checked ? 'green' : 'grey'}
        iconSize={20}
        iconStyle={styles.icon}
        onPress={onCheck}
      />
      <BaseText text3 style={styles.checkBoxText} adjustsFontSizeToFit>
        {title}
      </BaseText>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'flex-start',
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
