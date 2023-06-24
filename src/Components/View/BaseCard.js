import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BaseCard = ({
  color = '#FFF',
  children,
  onPress = null,
  containerStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity disabled={onPress === null} onPress={onPress}>
      <View
        style={{ ...styles.card, backgroundColor: color, ...containerStyle }}>
        {children}
      </View>
    </TouchableOpacity>
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
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.18,
      shadowRadius: 4.59,
      elevation: 5,
    },
  });

export default BaseCard;
