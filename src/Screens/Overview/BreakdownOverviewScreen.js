import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AmountText, BaseImage, BaseText } from '../../Components';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import { expenseIcon, incomeIcon } from '../../_shared/constant/asset';
import ROUTES from '../../_shared/constant/routes';
import { useAggrTransactions } from '../../_shared/query';
import {
  getMonth,
  getUnixRangeOfMonth,
  getYear,
} from '../../_shared/util/date';

const BreakdownOverviewScreen = ({ activeDate = new Date() }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [monthRange, setMonthRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );
  useEffect(() => {
    setMonthRange(
      getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
    );
  }, [activeDate]);

  const aggrTransactionsByTypeQuery = useAggrTransactions({
    transaction_types: [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME],
    transaction_time: {
      gte: monthRange[0],
      lte: monthRange[1],
    },
  });

  const getTotalAmountByCategoryType = (type = TRANSACTION_TYPE_EXPENSE) => {
    return aggrTransactionsByTypeQuery?.data?.results?.[type]?.sum || 0;
  };

  const getItemCard = (
    title = '',
    subtitle = '',
    imgSource = '',
    route = '',
    routeParam = {},
  ) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate(route, routeParam);
        }}>
        <View>
          <BaseText text3>{title}</BaseText>
          <AmountText h2 margin={{ top: 10 }}>
            {subtitle}
          </AmountText>
        </View>
        <BaseImage source={imgSource} width={50} height={50} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      {getItemCard(
        'Expense',
        getTotalAmountByCategoryType(TRANSACTION_TYPE_EXPENSE),
        expenseIcon,
        ROUTES.categoriesOverview,
        {
          category_type: TRANSACTION_TYPE_EXPENSE,
          active_date: activeDate.valueOf(),
        },
      )}

      {getItemCard(
        'Income',
        getTotalAmountByCategoryType(TRANSACTION_TYPE_INCOME),
        incomeIcon,
        ROUTES.categoriesOverview,
        {
          category_type: TRANSACTION_TYPE_INCOME,
          active_date: activeDate.valueOf(),
        },
      )}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      minHeight: '100%',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 18,
      marginTop: 30,
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.18,
      shadowRadius: 4.59,
      elevation: 5,
    },
  });

export default BreakdownOverviewScreen;
