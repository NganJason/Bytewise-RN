import { useNavigation } from '@react-navigation/native';
import { Dialog, useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
  BaseKeyboardAwareScrollView,
  BaseScreen,
  BaseText,
  TouchInput,
} from '../../../Components';
import { useValidation } from '../../../_shared/hooks/validation';
import {
  useCreateLot,
  useDeleteLot,
  useUpdateLot,
} from '../../../_shared/mutations/investment';
import { useGetLot } from '../../../_shared/query/investment';
import {
  getDateStringFromTs,
  renderCalendarTs,
} from '../../../_shared/util/date';
import { validateLot } from '../../../_shared/validator/investment';
import { useError } from '../../../_shared/hooks/error';

const LotForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const {
    account_id: accountID = '',
    holding_id: holdingID = '',
    symbol = '',
    lot_id: lotID = '',
  } = route?.params || {};
  const isAddLot = () => {
    return lotID === '';
  };

  const [lotForm, setLotForm] = useState({
    holding_id: String(holdingID),
    shares: 0,
    cost_per_share: 0,
    trade_date: new Date().valueOf(),
  });

  const getLot = useGetLot({ lot_id: lotID }, { enabled: lotID !== '' });
  useEffect(() => {
    if (getLot.data) {
      let { lot = {} } = getLot.data;
      setLotForm(lot);
    }
  }, [getLot.data]);

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateLot(lotForm));
  }, [lotForm]);

  const createLot = useCreateLot({
    onSuccess: () => {
      navigation.goBack();
    },
    meta: {
      account_id: accountID,
    },
  });

  const updateLot = useUpdateLot({
    onSuccess: () => {
      navigation.goBack();
    },
    meta: {
      account_id: accountID,
    },
  });

  const deleteLot = useDeleteLot({
    onSuccess: () => {
      navigation.goBack();
    },
    meta: {
      account_id: accountID,
      holding_id: holdingID,
    },
  });

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const onCostPerShareChange = e => {
    setLotForm({ ...lotForm, cost_per_share: e });
  };

  const onSharesChange = e => {
    setLotForm({ ...lotForm, shares: e });
  };

  const onTradeDateChange = e => {
    setLotForm({ ...lotForm, trade_date: e });
    toggleCalendarModal();
  };

  const onSave = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    if (isAddLot()) {
      createLot.mutate({
        ...lotForm,
        shares: String(lotForm.shares),
        cost_per_share: String(lotForm.cost_per_share),
      });
    } else {
      updateLot.mutate({
        ...lotForm,
        lot_id: lotID,
        shares: String(lotForm.shares),
        cost_per_share: String(lotForm.cost_per_share),
      });
    }
  };

  const onDelete = () => {
    deleteLot.mutate({
      lot_id: lotID,
    });
  };

  useError([createLot, updateLot, deleteLot]);

  return (
    <BaseScreen
      isLoading={getLot.isLoading}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>{symbol}</BaseText>
          </View>
        ),
      }}>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <BaseCurrencyInput
          label="Cost per share"
          value={lotForm.cost_per_share}
          onChangeText={onCostPerShareChange}
        />

        <BaseInput
          label="Number of shares"
          value={String(lotForm.shares)}
          keyboardType="numeric"
          onChangeText={onSharesChange}
          clearButtonMode="always"
          maxLength={120}
          errorMessage={showValidation && formErrors.shares}
        />

        <TouchInput
          label="Trading Date"
          value={renderCalendarTs(lotForm.trade_date)}
          onPress={toggleCalendarModal}
          errorMessage={showValidation && formErrors.trade_date}
        />
        <Dialog
          isVisible={isCalendarModalVisible}
          onBackdropPress={toggleCalendarModal}>
          <Calendar
            showSixWeeks
            initialDate={getDateStringFromTs(lotForm.trade_date)}
            hideExtraDays={false}
            onDayPress={obj => {
              onTradeDateChange(new Date(obj.timestamp).setHours(0, 0, 0, 0));
            }}
            markedDates={{
              [getDateStringFromTs(lotForm.trade_date)]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: theme.colors.primary,
              },
            }}
            theme={{
              todayTextColor: theme.colors.primary,
              arrowColor: theme.colors.primary,
            }}
          />
        </Dialog>

        {!isAddLot() && (
          <View style={styles.btnContainer}>
            <BaseButton
              title="Delete"
              size="lg"
              type="outline"
              width={200}
              onPress={onDelete}
              loading={deleteLot.isLoading}
            />
          </View>
        )}

        <View style={styles.btnContainer}>
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            onPress={onSave}
            loading={createLot.isLoading}
          />
        </View>
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    btnContainer: {
      marginTop: theme.spacing.lg,
    },
    securityName: {
      marginTop: 4,
      color: theme.colors.color8,
    },
  });

export default LotForm;
