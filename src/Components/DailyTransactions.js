import { View, Text } from 'react-native';
import { ListItem } from '@rneui/themed';

import BaseText from './BaseText';
import BaseButton from './BaseButton';
import AmountText from './AmountText';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../_shared/api/data/model';

const DailyTransactions = ({
  timestamp = 0,
  transactions = [
    {
      id: 0,
      note: '',
      category_id: 0,
      amount: 0,
      transaction_type: TRANSACTION_TYPE_EXPENSE,
    },
  ],
}) => {
  return (
    <View>
      <Text>DailyTransactions</Text>
    </View>
  );
};

export default DailyTransactions;
