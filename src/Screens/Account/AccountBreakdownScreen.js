import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmountText, BaseImage, BaseScreen, BaseText } from '../../Components';
import {
  DailyTransactions,
  DateNavigator,
  EmptyContent,
} from '../../Components/Common';
import { BaseLoadableView } from '../../Components/View';
import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';
import { coin } from '../../_shared/constant/asset';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';

const mockData = [
  {
    transaction_id: '1',
    category: {
      category_id: '1',
      category_name: 'food',
    },
    amount: '12',
    note: 'lunch',
    transaction_time: 1687598233,
    transaction_type: TRANSACTION_TYPE_EXPENSE,
  },
  {
    transaction_id: '2',
    category: {
      category_id: '2',
      category_name: 'transport',
    },
    amount: '3',
    note: 'mrt',
    transaction_time: 1687598233,
    transaction_type: TRANSACTION_TYPE_EXPENSE,
  },
];

const AccountBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);

  const account_id = route.params?.account_id || '';

  const renderRows = () => {
    let rows = [];

    rows.push(
      <DailyTransactions
        key={mockData[0].transaction_id}
        transactions={mockData}
        timestamp={mockData[0].transaction_time}
      />,
    );

    if (rows.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <EmptyContent
            item={EmptyContentConfig.transaction}
            route={ROUTES.transactionForm}
          />
        </View>
      );
    }

    return rows;
  };

  return (
    <BaseScreen enablePadding={false}>
      <SafeAreaView style={styles.header}>
        <View style={styles.title}>
          <BaseText h1>OCBC</BaseText>
          <AmountText style={styles.titleText} h2 decimal={0}>
            21000
          </AmountText>
          <BaseText text4>Saving Account</BaseText>
        </View>
        <BaseImage source={coin} containerStyle={styles.image} />
      </SafeAreaView>

      <View style={styles.body}>
        <View style={styles.dataNavigator}>
          <DateNavigator />
        </View>
        <BaseLoadableView scrollable={true}>{renderRows()}</BaseLoadableView>
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    header: {
      minHeight: screenHeight * 0.25,
      marginTop: theme.spacing.lg,
      paddingHorizontal: 26,
      flexDirection: 'row',
      justifyContent: 'left',
      alignItems: 'center',
      backgroundColor: theme.colors.color4,
    },
    image: {
      width: screenHeight * 0.2,
      height: screenHeight * 0.18,
      position: 'absolute',
      right: screenWidth * -0.1,
    },
    titleText: {
      marginVertical: theme.spacing.md,
    },
    dataNavigator: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    body: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: 26,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    emptyContent: {
      marginTop: '30%',
    },
  });

export default AccountBreakdownScreen;
