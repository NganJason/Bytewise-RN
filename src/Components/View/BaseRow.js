import React from 'react';

import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BaseListItem from './BaseListItem';

const BaseRow = ({
  disabled = false,
  onPress = function () {},
  children,
  dividerMargin = 10,
  showDivider = true,
}) => {
  const styles = getStyles();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}>
      <BaseListItem showDivider={showDivider} dividerMargin={dividerMargin}>
        <View style={styles.textGroup}>{children}</View>
      </BaseListItem>
    </TouchableOpacity>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    textGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
};

export default BaseRow;
