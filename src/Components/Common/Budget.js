import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AmountText, BaseText } from '../Text';
import { useTheme } from '@rneui/themed';
import { BaseListItem } from '../View';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../_shared/constant/routes';

const Budget = ({
  title = 'Default Budget',
  amount = 0,
  highlight = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <BaseListItem showDivider={true}>
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          navigation.navigate(ROUTES.budgetEdit, {
            title: title,
          })
        }>
        <View style={styles.textGroup}>
          <BaseText h4 style={highlight && styles.highlightText}>
            {title}
          </BaseText>
          <AmountText style={highlight && styles.highlightText}>
            {amount}
          </AmountText>
        </View>
      </TouchableOpacity>
    </BaseListItem>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    textGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    highlightText: {
      color: theme.colors.primary,
    },
  });

export default Budget;
