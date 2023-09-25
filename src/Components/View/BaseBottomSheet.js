import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet, useTheme } from '@rneui/themed';

import { BaseText } from '../Text';
import { BaseButton } from '../Touch';
import { useDimension } from '../../_shared/hooks';
import BaseRow from './BaseRow';
import BaseScrollView from './BaseScrollView';

const BaseBottomSheet = ({
  isVisible = false,
  items = [],
  label = '',
  onBackdropPress = function () {},
  onSelect = function (item) {},
  close = function () {},
  renderEmptyItems = function () {},
  showDone = true,
  headerProps = {
    leftComponent: null,
  },
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

  const getHeaderJustify = () => {
    if (headerProps.leftComponent) {
      return {
        justifyContent: 'space-between',
      };
    }

    return {
      justifyContent: 'flex-end',
    };
  };

  const renderRows = () => {
    let rows = [];

    items.map((item, i) =>
      rows.push(
        <BaseRow key={i} onPress={() => onSelect(item)} dividerMargin={5}>
          <View style={styles.rowLeftContent}>
            {item.leftIcon && (
              <View style={styles.rowIcon}>{item.leftIcon}</View>
            )}
            <BaseText text2>{item[label]}</BaseText>
          </View>
        </BaseRow>,
      ),
    );

    if (rows.length === 0) {
      return renderEmptyItems();
    }

    return rows;
  };

  return (
    <BottomSheet
      fullScreen={true}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
      }}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        <View style={{ ...styles.header, ...getHeaderJustify() }}>
          {headerProps.leftComponent && headerProps.leftComponent}
          {showDone && (
            <BaseButton
              title="Done"
              type="clear"
              align="flex-end"
              size="md"
              onPress={close}
            />
          )}
        </View>
        <BaseScrollView
          containerStyle={styles.body}
          showsVerticalScrollIndicator={false}>
          {renderRows()}
        </BaseScrollView>
      </View>
    </BottomSheet>
  );
};

export default BaseBottomSheet;

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      minHeight: screenHeight * 0.3,
      maxHeight: screenHeight * 0.5,
      backgroundColor: theme.colors.white,
      borderRadius: 15,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    body: {
      flex: 1,
      paddingHorizontal: 6,
    },
    rowLeftContent: {
      flexDirection: 'row',
    },
    rowIcon: {
      marginRight: 10,
    },
  });
