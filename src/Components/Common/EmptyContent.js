import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { paper } from '../../_shared/constant/asset';
import { useDimension } from '../../_shared/hooks';
import { BaseText, LinkText } from '../Text';
import { BaseImage } from '../View';

const EmptyContent = ({
  item = {
    text: ['No data'],
    image: paper,
  },
  route = '',
  routeParam = {},
  onRedirect = function () {},
}) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const onPress = () => {
    onRedirect();
    navigation.navigate(route, routeParam);
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseImage
          width={screenWidth * 0.4}
          height={'80%'}
          maxHeight={screenHeight * 0.15}
          source={item.image}
        />

        <View style={styles.textContainer}>
          {item.text.map(d => (
            <BaseText key={d} text3 style={styles.text}>
              {d}
            </BaseText>
          ))}
          {route !== '' && (
            <LinkText text4 onPress={onPress}>
              Add now!
            </LinkText>
          )}
        </View>
      </View>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flex: 1,
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
