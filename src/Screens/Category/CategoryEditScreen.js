import { useState } from 'react';
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
import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';
import { useGetCategories } from '../../_shared/query';

const CategoryEditScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { category_type = TRANSACTION_TYPE_EXPENSE } = route.params || {};

  const [categories, setCategories] = useState([]);

  const getCategoriesQuery = useGetCategories(
    {
      category_type: category_type,
    },
    {
      queryOnChange: [category_type],
      onSuccess: function (data) {
        setCategories(data.categories);
      },
    },
  );

  const renderErrorToast = () => {
    if (getCategoriesQuery.isError) {
      return {
        show: getCategoriesQuery.isError,
        message1: getCategoriesQuery.error.message,
        onHide: getCategoriesQuery.reset,
      };
    }

    return {};
  };

  return (
    <BaseScreen
      isLoading={getCategoriesQuery.isLoading}
      errorToast={renderErrorToast()}
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
        {categories.map((category, i) => {
          return (
            <BaseListItem key={i} showDivider dividerMargin={6}>
              <View style={styles.row}>
                <BaseText h4>{category.category_name}</BaseText>
                <IconButton
                  iconSize={20}
                  iconName="edit"
                  iconType="entypo"
                  color={theme.colors.color5}
                  type="clear"
                  buttonSize="xs"
                  onPress={() => {
                    navigation.navigate(ROUTES.categoryForm, {
                      category_id: category.category_id,
                    });
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
