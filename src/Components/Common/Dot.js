import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

const Dot = ({
  radius = 6,
  color = 'green',
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={{
        width: radius,
        height: radius,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginTop: marginTop,
        marginBottom: marginBottom,
        backgroundColor: color,
        ...styles.dot,
      }}
    />
  );
};

const getStyles = _ =>
  StyleSheet.create({
    dot: {
      borderRadius: 100,
    },
  });

export default Dot;
