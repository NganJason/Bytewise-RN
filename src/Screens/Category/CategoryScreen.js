import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';

import { BaseScreen, BaseText, FlexRow, IconButton } from '../../Components';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../_shared/constant/routes';
import { CATEGORIES } from '../../_shared/api/data/mock/category';
import { ScrollView } from 'react-native-gesture-handler';

const CategoryScreen = () => {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {CATEGORIES.map(d => (
          <FlexRow
            key={d.cat_id}
            itemFlexDirection="row"
            itemJustify="flex-start"
            bottomBorder={true}
            showDivider={false}
            rowStyle={styles.row}
            items={[
              <BaseText h4>{d.cat_name}</BaseText>,
              <View style={styles.iconContainer}>
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
              </View>,
            ]}
          />
        ))}
      </ScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    row: {
      paddingVertical: theme.spacing.xl,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
    },
  });
};

export default CategoryScreen;
