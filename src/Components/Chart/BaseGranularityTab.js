import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BaseText } from '../Text';

const BaseGranularityTab = ({
  items = [],
  activeIdx = 0,
  onPress = function (idx) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isActive = idx => {
    return activeIdx === idx;
  };

  return (
    <View style={styles.container}>
      {items.map((d, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onPress(i)}
            style={[styles.item, isActive(i) && styles.activeItem]}>
            <BaseText
              text4
              style={[styles.text, isActive(i) && styles.activeText]}>
              {d.name}
            </BaseText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    item: {
      borderRadius: 10,
      paddingHorizontal: 18,
      alignItems: 'center',
      paddingVertical: 2,
    },
    activeItem: {
      backgroundColor: theme.colors.color8,
    },
    text: {
      color: theme.colors.color8,
    },
    activeText: {
      color: theme.colors.white,
    },
  });
};

export default BaseGranularityTab;
