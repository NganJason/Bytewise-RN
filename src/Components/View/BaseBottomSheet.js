import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet, useTheme, ListItem } from '@rneui/themed';

import { BaseText } from '../Text';
import { BaseButton, IconButton } from '../Touch';
import useDimension from '../../_shared/hooks/dimension';

const BaseBottomSheet = ({
  isVisible = false,
  items = [],
  label = '',
  onBackdropPress = function () {},
  onSelect = function () {},
  close = function () {},
  headerItems = [],
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

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
      scrollViewProps={{ style: { maxHeight: screenHeight / 2 } }}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BaseButton
            title="Done"
            type="clear"
            align="flex-end"
            size="sm"
            onPress={close}
          />
        </View>
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
      </View>
    </BottomSheet>
  );
};

export default BaseBottomSheet;

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      height: screenHeight * 0.3,
      backgroundColor: 'white',
      borderRadius: 15,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: theme.spacing.lg,
    },
    editBtn: {
      marginHorizontal: 18,
    },
    modalItem: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
  });
