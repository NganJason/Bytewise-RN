import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseRow,
  BaseScrollView,
  BaseText,
  IconButton,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';

const CategoryOnboarding = ({ data = {}, setData = function () {} }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { categories = [] } = data;

  const onDelete = idx => {
    const newCategories = categories.filter((_, index) => index !== idx);

    console.log(newCategories);
    setData({ ...data, categories: newCategories });
  };

  const renderRows = () => {
    let rows = [];

    categories.map((category, idx) => {
      rows.push(
        <BaseRow key={idx} disabled>
          <BaseText>{category}</BaseText>
          <IconButton
            iconName="circle-with-minus"
            iconType="entypo"
            type="clear"
            color={theme.colors.lightRed}
            iconSize={20}
            align="flex-start"
            onPress={() => {
              onDelete(idx);
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
        <BaseText h1>Customise your</BaseText>
        <BaseText h1>categories</BaseText>
        <BaseText text2 style={styles.subtitle}>
          Categories group and track your daily transactions
        </BaseText>
      </View>

      <View style={styles.buttonContainer}>
        <BaseButton
          title="Add more"
          type="secondary"
          align="flex-end"
          size="sm"
          onPress={() => navigation.navigate(ROUTES.categoryForm)}
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
