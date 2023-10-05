import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import {
  groupDatesByMonth,
  getMonthStr,
  getYear,
  parseDateStringWithoutDelim,
} from '../../_shared/util';
import DailyTransactions from './DailyTransactions';
import { BaseText } from '../Text';
import EmptyContent from './EmptyContent';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import { Amount } from '../../_shared/object';

const Transactions = ({
  transactionGroups = [],
  showMonthLabel = false,
  emptyContentConfig,
}) => {
  const processTransactions = () => {
    let dateToSum = {};
    let dates = [];
    let dateToTransactions = {};

    transactionGroups.sort((a, b) => b.date - a.date);
    transactionGroups.map(group => {
      if (!group) {
        return;
      }
      dates.push(group.date);
      dateToTransactions[group.date] = group.transactions;
      dateToSum[group.date] = new Amount(group.sum, group.currency);
    });

    let { months: transactionMonths = [], monthToDates = {} } =
      groupDatesByMonth(dates);

    return {
      dateToSum,
      transactionMonths,
      monthToDates,
      dateToTransactions,
    };
  };

  const renderRows = () => {
    let rows = [];
    let {
      dateToSum = {},
      transactionMonths = [],
      monthToDates = {},
      dateToTransactions = {},
    } = processTransactions() || {};

    transactionMonths.map(month => {
      let dates = monthToDates[month] || [];
      if (showMonthLabel) {
        rows.push(<MonthLabel key={month} ts={month} />);
      }

      dates.map(date => {
        let dailyTransactions = dateToTransactions[date] || [];
        rows.push(
          <DailyTransactions
            key={date}
            transactions={dailyTransactions}
            dailyTotal={dateToSum[date]}
            timestamp={parseDateStringWithoutDelim(date).valueOf()}
          />,
        );
      });
    });

    if (rows.length === 0) {
      if (rows.length === 0) {
        return (
          <EmptyContent
            item={
              emptyContentConfig
                ? emptyContentConfig
                : EmptyContentConfig.transaction
            }
            route={ROUTES.transactionForm}
          />
        );
      }
    }
    return rows;
  };

  return <>{renderRows()}</>;
};

const MonthLabel = ({ ts = 0 }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getLabelText = () => {
    return `${getMonthStr(new Date(ts))} ${getYear(new Date(ts))}`;
  };

  return (
    <View style={styles.monthLabelContainer}>
      <View style={styles.monthLabel}>
        <BaseText text4 style={styles.monthLabelText}>
          {getLabelText()}
        </BaseText>
      </View>
    </View>
  );
};

export default Transactions;

const getStyles = theme =>
  StyleSheet.create({
    monthLabelContainer: {
      alignItems: 'center',
      marginTop: 4,
      marginBottom: 18,
    },
    monthLabel: {
      alignItems: 'center',
      backgroundColor: 'white',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 20,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    monthLabelText: { color: theme.colors.color6, fontSize: 12 },
  });
