import { useNavigation } from '@react-navigation/native';
import { Dialog, useTheme } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  BaseButton,
  BaseMonetaryInput,
  BaseInput,
  BaseKeyboardAwareScrollView,
  BaseRow,
  BaseScreen,
  BaseText,
  SearchBottomSheetInput,
  TouchInput,
} from '../../Components';
import { HOLDING_TYPE_DEFAULT } from '../../_shared/apis/enum';
import { toolTipMessage } from '../../_shared/constant/message';
import { OnboardingDataContext } from '../../_shared/context';
import { useValidation } from '../../_shared/hooks';
import { useSearchSecurities } from '../../_shared/query';
import {
  CURRENCY_USD,
  getDateStringFromTs,
  renderCalendarTs,
} from '../../_shared/util';
import { validateOnboardingHolding } from '../../_shared/validator/investment';

const InvestmentOnboardingForm = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { addInvestmentHolding } = useContext(OnboardingDataContext);

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const [holdingForm, setHoldingForm] = useState({
    symbol: '',
    cost_per_share: 0,
    shares: 0,
    trade_date: new Date().valueOf(),
    holding_type: HOLDING_TYPE_DEFAULT,
  });
  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateOnboardingHolding(holdingForm));
  }, [holdingForm]);

  const onSymbolChange = e => {
    setHoldingForm({
      ...holdingForm,
      symbol: e,
    });
  };

  const onSharesChange = e => {
    setHoldingForm({ ...holdingForm, shares: e });
  };

  const onCostPerShareChange = e => {
    setHoldingForm({ ...holdingForm, cost_per_share: e });
  };

  const onTradeDateChange = e => {
    setHoldingForm({ ...holdingForm, trade_date: e });
    toggleCalendarModal();
  };

  const onAdd = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    addInvestmentHolding(holdingForm);
    navigation.goBack();
  };

  return (
    <BaseScreen
      scrollable
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Add holding</BaseText>
          </View>
        ),
      }}>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <SearchBottomSheetInput
          label="Symbol"
          tooltip={toolTipMessage.symbolDesc}
          itemLabel="symbol"
          onChangeText={onSymbolChange}
          useQuery={useSearchSecurities}
          processResp={resp => resp.securities}
          errorMessage={showValidation && formErrors.symbol}
          renderItem={(item, onPress) => (
            <BaseRow dividerMargin={2} onPress={onPress}>
              <View>
                <BaseText text3>{item.symbol}</BaseText>
                <BaseText
                  text4
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.securityName}>
                  {item.security_name}
                </BaseText>
              </View>
            </BaseRow>
          )}
        />

        <BaseInput
          label="Number of shares"
          value={String(holdingForm.shares)}
          keyboardType="numeric"
          onChangeText={onSharesChange}
          clearButtonMode="always"
          maxLength={120}
          errorMessage={showValidation && formErrors.shares}
        />

        <BaseMonetaryInput
          label="Cost per share"
          value={holdingForm.cost_per_share}
          onChangeText={onCostPerShareChange}
          currency={CURRENCY_USD}
        />

        <TouchInput
          label="Trading Date"
          value={renderCalendarTs(holdingForm.trade_date)}
          onPress={toggleCalendarModal}
          errorMessage={showValidation && formErrors.trade_date}
        />
        <Dialog
          isVisible={isCalendarModalVisible}
          onBackdropPress={toggleCalendarModal}>
          <Calendar
            showSixWeeks
            initialDate={getDateStringFromTs(holdingForm.trade_date)}
            hideExtraDays={false}
            onDayPress={obj => {
              onTradeDateChange(new Date(obj.timestamp).setHours(0, 0, 0, 0));
            }}
            markedDates={{
              [getDateStringFromTs(holdingForm.trade_date)]: {
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

        <BaseButton title="Add" size="lg" width={200} onPress={onAdd} />
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    formBody: {
      paddingVertical: theme.spacing.xl,
    },
  });

export default InvestmentOnboardingForm;
