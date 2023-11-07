import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { paper } from '../../_shared/constant/asset';
import useDimension from '../../_shared/hooks/useDimension';
import { BaseText, LinkText } from '../Text';
import BaseImage from '../View/BaseImage';

const EmptyContent = ({
  item = {
    text: ['No data'],
    linkText: '',
    image: paper,
    italic: false,
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
            <BaseText
              key={d}
              text3
              color={theme.colors.color7}
              italic={item.italic || false}>
              {d}
            </BaseText>
          ))}
          {route !== '' && (
            <LinkText text3 onPress={onPress} margin={{ top: 8 }}>
              {item.linkText !== undefined ? item.linkText : 'Add now!'}
            </LinkText>
          )}
        </View>
      </View>
    </View>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      alignItems: 'center',
    },
  });
};

export default EmptyContent;
