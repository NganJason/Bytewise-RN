import React from 'react';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import BaseDivider from '../View/BaseDivider';
import BaseText from '../Text/BaseText';

const TextGroup = ({
  texts = [{ label: '', value: '' }],
  LabelComponent = BaseText,
  ValueComponent = BaseText,
  containerStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.textGroup, containerStyle]}>
      {texts.map((text, i) => (
        <React.Fragment key={i}>
          <View style={styles.textWrapper}>
            <LabelComponent h4>{text.label}</LabelComponent>
            <ValueComponent h4>{text.value}</ValueComponent>
          </View>
          {i < texts.length - 1 && <BaseDivider orientation="vertical" />}
        </React.Fragment>
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
