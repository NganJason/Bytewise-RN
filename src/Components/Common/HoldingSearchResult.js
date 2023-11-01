import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { BaseRow } from '../View';
import { BaseText } from '../Text';

const HoldingSearchResult = ({
  item = { symbol: '', desc: '' },
  onPress = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseRow dividerMargin={2} onPress={onPress}>
      <View>
        <BaseText text3>{item.symbol}</BaseText>
        <BaseText
          text4
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.securityName}>
          {item.desc}
        </BaseText>
      </View>
    </BaseRow>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    securityName: {
      marginTop: 4,
      color: theme.colors.color8,
    },
  });

export default HoldingSearchResult;
