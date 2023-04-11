import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme, LinearProgress, Icon } from '@rneui/themed';
import {
  BaseDivider,
  BaseText,
  BaseScreen,
  DailyTransactions,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';

const BUDGET = {
  category: 'Food',
  budgetType: 1,
  budget: '200',
  used: '100',
  currency: 'SGD',
  ctime: 1673153014,
  mtime: 1673153014,
};

const BudgetBreakdownScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen
      headerProps={{
        show: true,
        allowBack: false,
        leftComponent: (
          <BaseText h1 style={{ color: theme.colors.color1 }}>
            Food
          </BaseText>
        ),
        rightComponent: (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(ROUTES.setCategory, {
                isEdit: true,
                data: BUDGET,
              });
            }}>
            <Icon name="edit-2" type="feather" color={theme.colors.color6} />
          </TouchableWithoutFeedback>
        ),
      }}>
      <View style={styles.header}>
        <BaseText h4 style={{ color: theme.colors.color4 }}>
          Monthly budget
        </BaseText>
        <View style={styles.aggr}>
          <BaseText h4 style={{ color: theme.colors.color4 }}>
            Budget: {100}
          </BaseText>
          <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
          <BaseText h4 style={{ color: theme.colors.color4 }}>
            Used: {200}
          </BaseText>
        </View>

        <LinearProgress
          trackColor={theme.colors.secondary}
          color={theme.colors.primary}
          style={styles.progressBar}
          value={0.2}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {TRANSACTIONS.map((t, i) => (
          <DailyTransactions
            key={i}
            transactions={t.transactions}
            timestamp={t.timestamp}
          />
        ))}
      </ScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    header: {
      marginBottom: theme.spacing.xl,
    },
    aggr: {
      flexDirection: 'row',
      marginVertical: theme.spacing.xl,
    },
    progressBar: {
      width: '100%',
      marginVertical: theme.spacing.md,
    },
  });
};

export default BudgetBreakdownScreen;
