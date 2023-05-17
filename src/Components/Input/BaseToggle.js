import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@rneui/themed';

import { BaseText } from '../Text';

const BaseToggle = ({
  label = '',
  value = '',
  items = [],
  onToggle = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getSpecialSelectedStyles = index => {
    switch (index) {
      case 0:
        return styles.leftSelected;
      case items.length - 1:
        return styles.rightSelected;
      default:
        return {};
    }
  };

  const isSelected = item => {
    return item.value === value;
  };

  return (
    <View style={styles.container}>
      <BaseText h3>{label}</BaseText>
      <View style={styles.toggle}>
        {items.map((item, i) => (
          <TouchableOpacity key={i} onPress={() => onToggle(item)}>
            <View
              style={[
                styles.item,
                isSelected(item) && {
                  ...styles.selected,
                  ...getSpecialSelectedStyles(i),
                },
              ]}>
              <BaseText style={isSelected(item) && styles.selectedLabel}>
                {item.label}
              </BaseText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BaseToggle;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 0,
      marginBottom: 28,
    },
    toggle: {
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: theme.colors.color1,
      borderRadius: '10%',
      alignSelf: 'flex-start',
      marginTop: 14,
    },
    item: {
      minWidth: 100,
      paddingVertical: 8,
      alignItems: 'center',
    },
    selected: {
      backgroundColor: theme.colors.color1,
    },
    leftSelected: {
      borderTopLeftRadius: '5%',
      borderBottomLeftRadius: '5%',
    },
    rightSelected: {
      borderTopRightRadius: '5%',
      borderBottomRightRadius: '5%',
    },
    selectedLabel: {
      color: theme.colors.white,
    },
  });
