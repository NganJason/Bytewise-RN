import { Dimensions, StyleSheet } from 'react-native';
import { BottomSheet, useTheme, ListItem, Icon } from '@rneui/themed';

import BaseText from '../Text/BaseText';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const BaseBottomSheet = ({
  isVisible = false,
  items = [],
  label = '',
  onBackdropPress = function () {},
  onSelect = function () {},
  close = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BottomSheet
      fullScreen
      scrollViewProps={{ style: { maxHeight: WINDOW_HEIGHT / 2 } }}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <>
        <ListItem>
          <ListItem.Content style={styles.closeBtnWrapper}>
            <Icon name="cross" type="entypo" color="grey" onPress={close} />
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
      </>
    </BottomSheet>
  );
};

export default BaseBottomSheet;

const getStyles = _ =>
  StyleSheet.create({
    closeBtnWrapper: {
      alignItems: 'flex-end',
    },
    modalItem: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
  });
