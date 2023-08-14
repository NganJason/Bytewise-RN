import { Icon, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDimension } from '../../_shared/hooks';
import { BaseText } from '../Text';
import BaseBottomSheet from './BaseBottomSheet';

const BaseBottomSelectTab = ({
  items = [{ name: '', value: '' }],
  currTabText = '',
  onSelect = function (item) {},
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onPress = item => {
    onSelect(item);
    toggleModal();
  };

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={toggleModal} style={styles.tab}>
        <Icon
          name="chevron-down"
          type="entypo"
          containerStyle={styles.icon}
          color={theme.colors.color6}
          size={17}
        />
        <BaseText text4 style={styles.tabText}>
          {currTabText}
        </BaseText>
      </TouchableOpacity>
      <BaseBottomSheet
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        close={toggleModal}
        onSelect={onPress}
        items={items}
        label="name"
      />
    </View>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    tabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    icon: { marginRight: 6 },
    tabText: {
      color: theme.colors.color6,
    },
    container: {
      minHeight: screenHeight * 0.3,
      backgroundColor: theme.colors.white,
      borderRadius: 15,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
  });

export default BaseBottomSelectTab;
