import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { paper } from '../../_shared/constant/asset';
import useDimension from '../../_shared/hooks/dimension';
import { BaseText, LinkText } from '../Text';
import { BaseImage } from '../View';

const EmptyContent = ({
  item = {
    text: 'No data',
    image: paper,
  },
  route = '',
  onRedirect = function () {},
  marginVertical = '0%',
  height = '',
}) => {
  const { theme } = useTheme();
  const { screenWidth } = useDimension();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const onPress = () => {
    onRedirect();
    navigation.navigate(route);
  };

  return (
    <View style={{ ...styles.container, marginVertical: marginVertical }}>
      <BaseImage
        width={screenWidth * 0.4}
        height={height === '' ? screenWidth * 0.4 : height}
        source={item.image}
      />

      <View style={styles.textContainer}>
        <BaseText text3 style={styles.text}>
          {item.text}
        </BaseText>
        {route !== '' && (
          <LinkText text4 onPress={onPress}>
            Add now!
          </LinkText>
        )}
      </View>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      alignItems: 'center',
    },
    text: {
      marginBottom: theme.spacing.md,
      color: theme.colors.color7,
    },
  });
};

export default EmptyContent;
