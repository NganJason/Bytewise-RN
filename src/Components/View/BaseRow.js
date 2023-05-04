import React from 'react';

import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BaseListItem from './BaseListItem';

const BaseRow = ({ disabled = false, onPress = function () {}, children }) => {
  const styles = getStyles();

  return (
    <BaseListItem showDivider={true}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={disabled}>
        <View style={styles.textGroup}>{children}</View>
      </TouchableOpacity>
    </BaseListItem>
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
