import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import BaseText from './BaseText';

const TextGroup = ({
  texts = [{ label: '', value: '' }],
  LabelComponent = BaseText,
  ValueComponent = BaseText,
  justifyContent = 'space-around',
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={[
        {
          ...styles.textGroup,
          justifyContent: justifyContent,
        },
      ]}>
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
    },
    textWrapper: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'row',
    },
  });
