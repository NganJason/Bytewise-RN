import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import {
  BaseScreen,
  BaseText,
  FlexRow,
  IconButton,
  BaseScrollView,
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
        {CATEGORIES.map(d => (
          <FlexRow
            key={d.cat_id}
            itemPositions={[
              { flexDirection: 'row', justifyContent: 'flex-start' },
              { flexDirection: 'row', justifyContent: 'flex-end' },
            ]}
            bottomBorder={true}
            showDivider={false}
            rowStyle={styles.row}
            items={[
              <BaseText h4>{d.cat_name}</BaseText>,
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
              />,
            ]}
          />
        ))}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    row: {
      paddingVertical: 22,
    },
  });
};

export default EditCategoryScreen;
