import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { BottomSheet, useTheme, ListItem } from '@rneui/themed';

import { BaseText } from '../Text';
import { IconButton } from '../Touch';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const BaseBottomSheet = ({
  isVisible = false,
  items = [],
  label = '',
  onBackdropPress = function () {},
  onSelect = function () {},
  close = function () {},
  headerItems = [],
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderHeader = () => {
    headerItems.push(
      <IconButton
        iconName="cross"
        iconType="entypo"
        type="clear"
        buttonSize="sm"
        color="grey"
        onPress={close}
      />,
    );

    return headerItems.map((item, idx) => (
      <React.Fragment key={idx}>{item}</React.Fragment>
    ));
  };

  return (
    <BottomSheet
      fullScreen={true}
      scrollViewProps={{ style: { maxHeight: WINDOW_HEIGHT / 2 } }}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <>
        <ListItem>
          <ListItem.Content style={styles.closeBtnWrapper}>
            {renderHeader()}
          </ListItem.Content>
        </ListItem>
        {items.map((item, i) => (
          <ListItem
            key={i}
            onPress={() => onSelect(item)}
            containerStyle={styles.modalItem}>
            <ListItem.Content key={i}>
              <ListItem.Title>
                <BaseText>{item[label]}</BaseText>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
        <ListItem>
          <ListItem.Content />
        </ListItem>
      </>
    </BottomSheet>
  );
};

export default BaseBottomSheet;

const getStyles = _ =>
  StyleSheet.create({
    closeBtnWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    editBtn: {
      marginHorizontal: 18,
    },
    modalItem: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
  });
