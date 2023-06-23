import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const BaseCard = ({ color = '#FFF', children, onPress = null }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableWithoutFeedback disabled={onPress === null} onPress={onPress}>
      <View style={{ ...styles.card, backgroundColor: color }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    card: {
      width: '100%',
      paddingVertical: 16,
      borderRadius: 15,
      paddingHorizontal: 12,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
  });

export default BaseCard;
