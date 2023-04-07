import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import BaseText from './BaseText';

const TextGroup = ({
  texts = [{ label: '', value: '' }],
  LabelComponent = BaseText,
  ValueComponent = BaseText,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.textGroup}>
      {texts.map((text, i) => (
        <View key={i} style={styles.textWrapper}>
          <LabelComponent>{text.label}</LabelComponent>
          <ValueComponent>{text.value}</ValueComponent>
        </View>
      ))}
    </View>
  );
};

export default TextGroup;

const getStyles = _ =>
  StyleSheet.create({
    textGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    textWrapper: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'row',
    },
  });
