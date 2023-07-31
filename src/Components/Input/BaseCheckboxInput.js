import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { InfoToolTip } from '../Common';
import { BaseText } from '../Text';
import BaseCheckbox from './BaseCheckbox';

const BaseCheckboxInput = ({
  label = '',
  items = [],
  value = '',
  desc = {
    title: '',
    text: '',
  },
  onChange = function (value) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <View style={styles.label}>
        <BaseText h4 margin={{ right: 6 }}>
          {label}
        </BaseText>
        {desc.text !== '' && (
          <InfoToolTip title={desc.title} message={desc.text} />
        )}
      </View>

      {items.map((item, idx) => (
        <BaseCheckbox
          key={idx}
          title={item.title}
          checked={value === item.value}
          value={item.value}
          onPress={onChange}
        />
      ))}
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    label: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
  });
};

export default BaseCheckboxInput;
