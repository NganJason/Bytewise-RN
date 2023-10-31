import { useState } from 'react';
import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import {
  BaseScreen,
  DateNavigator,
  AggrSummary,
  BaseLoadableView,
  Transactions,
  IconButton,
} from '../../Components';
import { getUnixRangeOfMonth, getYear, getMonth } from '../../_shared/util';
import ROUTES from '../../_shared/constant/routes';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';
import {
  useError,
  useDimension,
  useTransactionGroups,
} from '../../_shared/hooks';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { BaseFilter } from '../../Components/Common';

const TODAY = new Date();

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);

  const [activeDate, setActiveDate] = useState(TODAY);
  const {
    setTimeRange,
    transactionGroups,
    getMonthlyTotalIncome,
    getMonthlyTotalExpense,
    selectedFilters,
    getFilterOptions,
    onFilterChange,
    isLoading,
    getErrors,
  } = useTransactionGroups(activeDate);

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const renderRows = () => {
    return (
      <Transactions
        transactionGroups={transactionGroups}
        emptyContentConfig={EmptyContentConfig.transactionv2}
      />
    );
  };

  useError(getErrors());

  return (
    <BaseScreen
      allowLoadable={false}
      backgroundColor={theme.colors.color11}
      enablePadding={false}
      headerProps={{
        allowBack: false,
        allowDrawer: true,
        rightComponent: (
          <IconButton
            iconName="calendar"
            iconType="font-awesome"
            iconSize={22}
            onPress={() => navigation.navigate(ROUTES.transactionCalendar)}
            color={theme.colors.color7}
          />
        ),
        centerComponent: (
          <DateNavigator
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
            enablePicker
          />
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <View style={styles.aggrContainer}>
        <AggrSummary
          aggrs={[
            {
              label: TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
              amount: getMonthlyTotalIncome(),
              sensitive: true,
            },
            {
              label: TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
              amount: getMonthlyTotalExpense(),
              sensitive: true,
            },
          ]}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.filter}>
          <BaseFilter
            options={getFilterOptions()}
            selectedItems={selectedFilters}
            onChange={onFilterChange}
          />
        </View>
        <BaseLoadableView scrollable={true} isLoading={isLoading}>
          {renderRows()}
        </BaseLoadableView>
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    aggrContainer: {
      marginBottom: 22,
    },
    body: {
      flex: 1,
      padding: theme.spacing.xl,
      paddingTop: 16,
      backgroundColor: theme.colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    filter: {
      marginBottom: 8,
    },
  });
};

export default TransactionScreen;
