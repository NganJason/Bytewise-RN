import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseRow,
  BaseScrollView,
  BaseText,
  IconButton,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { OnboardingDataContext } from '../../_shared/context';

const CategoryOnboarding = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { data, deleteCategory } = useContext(OnboardingDataContext);
  const { categoryBudgets = [] } = data;

  const renderRows = () => {
    let rows = [];

    categoryBudgets.map((cb, idx) => {
      rows.push(
        <BaseRow key={idx} disabled>
          <BaseText>{cb.category_name}</BaseText>
          <IconButton
            iconName="circle-with-minus"
            iconType="entypo"
            type="clear"
            color={theme.colors.lightRed}
            iconSize={20}
            align="flex-start"
            onPress={() => {
              deleteCategory(idx);
            }}
          />
        </BaseRow>,
      );
    });

    return rows;
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Create categories</BaseText>
        <BaseText text2 style={styles.subtitle} numberOfLines={0}>
          Categorise your daily transactions
        </BaseText>
      </View>

      <View style={styles.buttonContainer}>
        <BaseButton
          title="Add more"
          type="secondary"
          align="flex-end"
          size="sm"
          onPress={() =>
            navigation.navigate(ROUTES.categoryForm, { isOnboarding: true })
          }
        />
      </View>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {renderRows()}
      </BaseScrollView>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    subtitle: {
      marginTop: 10,
      marginBottom: 12,
      color: theme.colors.color8,
    },
    buttonContainer: {
      marginBottom: 8,
    },
  });
};

export default CategoryOnboarding;
