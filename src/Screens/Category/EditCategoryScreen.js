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
import { CATEGORIES } from '../../_shared/api/data/mock/category';

const EditCategoryScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

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
        {CATEGORIES.map((d, i) => (
          <BaseListItem key={i} showDivider>
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
        ))}
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

export default EditCategoryScreen;
