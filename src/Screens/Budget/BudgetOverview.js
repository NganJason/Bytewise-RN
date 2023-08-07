import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AmountText, BaseButton, BaseText, IconButton } from '../../Components';
import { EmptyContent, InfoToolTip } from '../../Components/Common';
import {
  BaseDivider,
  BaseLoadableView,
  BaseScrollView,
} from '../../Components/View';
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

  const [isEdit, setIsEdit] = useState(false);
  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const { categoriesWithBudget, isLoading, getQueries } =
    useGetCategoriesHelper({
      budgetDate: activeDate,
    });

  const getBudgetSum = (type = BUDGET_TYPE_MONTHLY) => {
    let sum = 0;
    categoriesWithBudget.map(category => {
      const { budget_type: budgetType = BUDGET_TYPE_MONTHLY, amount = 0 } =
        category?.budget || {};

      if (budgetType === type) {
        sum += Number(amount);
      }
    });
    return sum;
  };

  const getTotalUsedAmount = (type = BUDGET_TYPE_MONTHLY) => {
    let sum = 0;
    categoriesWithBudget.map(category => {
      const {
        budget_type: budgetType = BUDGET_TYPE_MONTHLY,
        used_amount: usedAmount = 0,
      } = category?.budget || {};

      if (budgetType === type) {
        sum += Number(usedAmount);
      }
    });
    return sum;
  };

  const renderRows = (type = BUDGET_TYPE_MONTHLY) => {
    let rows = [];

    categoriesWithBudget.map(category => {
      const { budget = {}, category_id: categoryID = '' } = category || {};
      const { budget_type: budgetType = BUDGET_TYPE_MONTHLY } = budget || {};

      if (budgetType !== type) {
        return;
      }
      rows.push(
        <BudgetOverviewRow
          key={categoryID}
          categoryWithBudget={category}
          activeDate={activeDate}
          isEdit={isEdit}
          toggleEdit={toggleEdit}
        />,
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

  const renderBudgetTypeContainer = (
    type = BUDGET_TYPE_MONTHLY,
    desc = { title: '', text: '' },
  ) => {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.textWithToolTip}>
            <BaseText h3 margin={{ right: 8 }}>
              {type === BUDGET_TYPE_MONTHLY ? 'Monthly' : 'Annual'}
            </BaseText>
            {desc.text !== '' && (
              <InfoToolTip title={desc.title} message={desc.text} />
            )}
          </View>

          {isEdit ? (
            <IconButton
              iconSize={22}
              type="clear"
              iconName="plus"
              iconType="entypo"
              color={theme.colors.color8}
              onPress={() => {
                navigation.navigate(ROUTES.budgetForm, {
                  active_date: activeDate.valueOf(),
                  budget_type: type,
                });
                toggleEdit();
              }}
            />
          ) : (
            <View style={styles.aggr}>
              <AmountText
                text4
                decimal={0}
                style={{ color: theme.colors.color7 }}>
                {getTotalUsedAmount(type)}
              </AmountText>
              <BaseDivider orientation={'vertical'} margin={5} />
              <AmountText
                text4
                decimal={0}
                style={{ color: theme.colors.color7 }}>
                {getBudgetSum(type)}
              </AmountText>
            </View>
          )}
        </View>

        <BaseLoadableView isLoading={isLoading()}>
          {renderRows(type)}
        </BaseLoadableView>
      </View>
    );
  };

  useError(getQueries());

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <BaseButton
          title={isEdit ? 'Done' : 'Edit'}
          type={isEdit ? 'tertiary' : 'secondary'}
          align="flex-end"
          size="sm"
          onPress={toggleEdit}
        />
      </View>

      <BaseScrollView showsVerticalScrollIndicator={false}>
        <View>
          {renderBudgetTypeContainer(BUDGET_TYPE_MONTHLY)}
          {renderBudgetTypeContainer(
            BUDGET_TYPE_ANNUAL,
            toolTipMessage.annualBudgetDesc,
          )}
        </View>
      </BaseScrollView>
    </View>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      marginBottom: theme.spacing.xl,
      minHeight: screenHeight * 0.28,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    textWithToolTip: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    aggr: {
      flexDirection: 'row',
    },
  });

export default BudgetOverview;
