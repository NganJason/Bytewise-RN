import { Dimensions, StyleSheet } from 'react-native';
import { BottomSheet, useTheme, ListItem } from '@rneui/themed';

import BaseText from './BaseText';
import BaseButton from './BaseButton';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const BaseBottomSheet = ({
  isVisible = false,
  items = [],
  label = '',
  onBackdropPress = function () {},
  onSelect = function () {},
  onButtonPress = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BottomSheet
      scrollViewProps={{ style: { maxHeight: WINDOW_HEIGHT / 2 } }}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
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
      <BaseButton
        title="Close"
        fullWidth
        size="lg"
        activeOpacity={1}
        onPress={onButtonPress}
      />
    </BottomSheet>
  );
};

export default BaseBottomSheet;

const getStyles = _ =>
  StyleSheet.create({
    modalItem: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
  });
