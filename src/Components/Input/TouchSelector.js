import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, useTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BaseText } from '../Text';
import { BaseBottomSheet } from '../View';

const TouchSelector = ({
  title = '',
  value = '',
  label = '',
  items = [],
  onSelect = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onSelectItem = e => {
    onSelect(e);
    toggleModal();
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal} style={styles.container}>
        <View style={styles.textGroup}>
          <View style={styles.textTitle}>
            <Icon
              name="chevron-right"
              type="entypo"
              color={theme.colors.color6}
            />
            <BaseText h4>{title}</BaseText>
          </View>
          <View>
            <BaseText h4>{value}</BaseText>
          </View>
        </View>
      </TouchableOpacity>

      <BaseBottomSheet
        isVisible={isModalVisible}
        label={label}
        items={items}
        onSelect={onSelectItem}
        onBackdropPress={toggleModal}
        close={toggleModal}
      />
    </>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    textGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default TouchSelector;
