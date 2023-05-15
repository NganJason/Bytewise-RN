import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import {
  BaseScreen,
  BaseText,
  IconButton,
  BaseScrollView,
  BaseListItem,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import { CATEGORIES } from '../../_shared/mock_data/category';
import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';

const CategoryEditScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { params: { categoryType = TRANSACTION_TYPE_EXPENSE } = {} } = route;

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: <BaseText h2>Category</BaseText>,
        rightComponent: (
          <IconButton
            iconName="add"
            type="clear"
            buttonSize="sm"
            onPress={() => {
              navigation.navigate(ROUTES.categoryForm);
            }}
          />
        ),
      }}>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((d, i) => {
          if (d.cat_type !== categoryType) {
            return;
          }
          return (
            <BaseListItem key={i} showDivider dividerMargin={6}>
              <View style={styles.row}>
                <BaseText h4>{d.cat_name}</BaseText>
                <IconButton
                  iconSize={20}
                  iconName="edit"
                  iconType="entypo"
                  color={theme.colors.color5}
                  type="clear"
                  buttonSize="xs"
                  onPress={() => {
                    navigation.navigate(ROUTES.categoryForm, { category: d });
                  }}
                />
              </View>
            </BaseListItem>
          );
        })}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });
};

export default CategoryEditScreen;
