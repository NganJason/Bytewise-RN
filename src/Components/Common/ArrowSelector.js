import { StyleSheet, View } from 'react-native';
import { useTheme, Button } from '@rneui/themed';
import { Icon } from '@rneui/themed';

const ArrowSelector = ({
  children = '',
  contentSpacing = 0,
  marginVertical = 0,
  onNext = function () {},
  onPrev = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getContentSpacing = () => {
    if (contentSpacing !== 0) {
      return contentSpacing;
    }

    return theme.spacing.lg;
  };

  const getMarginVertical = () => {
    if (marginVertical !== 0) {
      return contentSpacing;
    }

    return theme.spacing.sm;
  };

  return (
    <View
      style={{
        ...styles.container,
        marginVertical: getMarginVertical(),
      }}>
      <Button type="clear" onPress={onPrev}>
        <Icon name="chevron-left" type="entypo" color={theme.colors.grey4} />
      </Button>

      <View
        style={{
          marginHorizontal: getContentSpacing(),
        }}>
        {children}
      </View>

      <Button type="clear" onPress={onNext}>
        <Icon name="chevron-right" type="entypo" color={theme.colors.grey4} />
      </Button>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
  });

export default ArrowSelector;
