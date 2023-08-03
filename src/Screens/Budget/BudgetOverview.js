import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseButton, BaseText } from '../../Components';
import { EmptyContent, InfoToolTip } from '../../Components/Common';
import { BaseLoadableView, BaseScrollView } from '../../Components/View';
import {
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/apis/enum';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { toolTipMessage } from '../../_shared/constant/message';
import ROUTES from '../../_shared/constant/routes';
import { useDimension, useGetCategoriesHelper } from '../../_shared/hooks';
import { useError } from '../../_shared/hooks/error';
import BudgetOverviewRow from './BudgetOverviewRow';

const BudgetOverview = ({ activeDate = new Date() }) => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

  const { categoriesWithBudget, isLoading, getQueries } =
    useGetCategoriesHelper({
      budgetDate: activeDate,
    });
  useError(getQueries());

  const renderRows = (type = BUDGET_TYPE_MONTHLY) => {
    let rows = [];

    categoriesWithBudget.map(category => {
      const { budget = {}, category_id: categoryID = '' } = category || {};
      const { budget_type: budgetType = BUDGET_TYPE_MONTHLY } = budget || {};

      if (budgetType !== type) {
        return;
      }
      rows.push(
        <BudgetOverviewRow key={categoryID} categoryWithBudget={category} />,
      );
    });

    if (rows.length === 0 && !isLoading()) {
      return (
        <EmptyContent
          item={
            type === BUDGET_TYPE_MONTHLY
              ? EmptyContentConfig.monthlyBudget
              : EmptyContentConfig.annualBudget
          }
          route={ROUTES.budgetForm}
          routeParam={{ budget_type: type }}
          height="80%"
        />
      );
    }

    return rows;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <BaseButton
          title="Edit"
          type="secondary"
          align="flex-end"
          size="sm"
          onPress={() => navigation.navigate(ROUTES.budgetList)}
        />
      </View>

      <BaseScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.container}>
            <View style={styles.title}>
              <BaseText h3>Monthly</BaseText>
            </View>
            <BaseLoadableView isLoading={isLoading()}>
              {renderRows(BUDGET_TYPE_MONTHLY)}
            </BaseLoadableView>
          </View>

          <View style={styles.container}>
            <View style={styles.title}>
              <BaseText h3 margin={{ right: 8 }}>
                Annual
              </BaseText>
              <InfoToolTip
                title={toolTipMessage.annualBudgetDesc.title}
                message={toolTipMessage.annualBudgetDesc.text}
              />
            </View>
            <BaseLoadableView isLoading={isLoading()}>
              {renderRows(BUDGET_TYPE_ANNUAL)}
            </BaseLoadableView>
          </View>
        </View>
      </BaseScrollView>
    </View>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    screen: {
      minHeight: '100%',
    },
    container: {
      marginBottom: theme.spacing.xl,
      minHeight: screenHeight * 0.25,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    row: {
      marginBottom: 10,
    },
    rowInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    aggr: {
      flexDirection: 'row',
    },
    progress: {
      marginTop: 16,
      marginBottom: 20,
    },
  });

export default BudgetOverview;
