import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

const BaseHeader = ({
  leftComponent,
  centerComponent,
  rightComponent,
  leftContainerStyle,
  centerContainerStyle,
  rightContainerStyle,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.header}>
      <View style={{ ...styles.container, ...leftContainerStyle }}>
        {leftComponent}
      </View>
      <View style={centerContainerStyle}>{centerComponent}</View>
      <View style={{ ...styles.container, ...rightContainerStyle }}>
        {rightComponent}
      </View>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    container: {
      minWidth: '1%',
      maxWidth: '33%',
    },
  });
};

export default BaseHeader;
