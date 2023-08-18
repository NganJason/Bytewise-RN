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
  containerStyle = {},
}) => {
  const styles = getStyles();

  return (
    <RowContainer
      disabled={disabled}
      containerStyle={containerStyle}
      onPress={onPress}>
      <BaseListItem showDivider={showDivider} dividerMargin={dividerMargin}>
        <View style={styles.textGroup}>{children}</View>
      </BaseListItem>
    </RowContainer>
  );
};

const RowContainer = ({ disabled, containerStyle, onPress, children }) => {
  const styles = getStyles();
  // If use disabled property in TouchableOpacity,
  // it will affect ScrollableView
  if (disabled) {
    return <View>{children}</View>;
  }

  return (
    <TouchableOpacity
      style={{ ...styles.container, ...containerStyle }}
      onPress={onPress}>
      {children}
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
