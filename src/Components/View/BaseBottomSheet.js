import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet, useTheme } from '@rneui/themed';

import { BaseText } from '../Text';
import { BaseButton } from '../Touch';
import useDimension from '../../_shared/hooks/dimension';
import BaseRow from './BaseRow';

const BaseBottomSheet = ({
  isVisible = false,
  items = [],
  label = '',
  onBackdropPress = function () {},
  onSelect = function () {},
  close = function () {},
  renderEmptyItems = function () {},
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
          <BaseText text2>{item[label]}</BaseText>
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
          <BaseButton
            title="Done"
            type="clear"
            align="flex-end"
            size="md"
            onPress={close}
          />
        </View>
        <View style={styles.body}>{renderRows()}</View>
      </View>
    </BottomSheet>
  );
};

export default BaseBottomSheet;

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      minHeight: screenHeight * 0.3,
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
      paddingHorizontal: theme.spacing.lg,
    },
  });
