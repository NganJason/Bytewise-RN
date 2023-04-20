import { Dimensions, StyleSheet } from 'react-native';
import { BottomSheet, useTheme, ListItem, Icon } from '@rneui/themed';

import BaseText from '../Text/BaseText';
import { useNavigation } from '@react-navigation/native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const BaseBottomSheet = ({
  isVisible = false,
  items = [],
  label = '',
  onBackdropPress = function () {},
  onSelect = function () {},
  close = function () {},
  editRoute = '',
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const onEdit = () => {
    close();
    navigation.navigate(editRoute);
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
            {editRoute !== '' && (
              <Icon
                name="edit"
                type="fontawesome"
                color="grey"
                style={styles.editBtn}
                onPress={onEdit}
              />
            )}
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
