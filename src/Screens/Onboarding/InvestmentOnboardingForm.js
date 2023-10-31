import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseMonetaryInput,
  BaseInput,
  BaseKeyboardAwareScrollView,
  BaseScreen,
  BaseText,
  SearchBottomSheetInput,
  HoldingSearchResult,
  DeleteSaveButton,
} from '../../Components';
import {
  HOLDING_TYPE_CUSTOM,
  HOLDING_TYPE_DEFAULT,
} from '../../_shared/apis/enum';
import { OnboardingDataContext } from '../../_shared/context';
import { useValidation } from '../../_shared/hooks';
import { useSearchSecurities } from '../../_shared/query';
import { queryKeys } from '../../_shared/query';
import { validateOnboardingHolding } from '../../_shared/validator/investment';

const InvestmentOnboardingForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const {
    addInvestmentHolding,
    updateInvestmentHolding,
    deleteInvestmentHolding,
    data: { currency: baseCurrency = '' },
  } = useContext(OnboardingDataContext);

  const {
    idx = -1,
    symbol: selectedSymbol = '',
    holding_type: selectedHoldingType = 0,
    lots: selectedLots = [],
    total_cost: totalCost = 0,
    latest_value: latestValue = 0,
    currency = baseCurrency,
  } = route?.params || {};

  const [holdingForm, setHoldingForm] = useState({
    currency: currency,
    symbol: selectedSymbol,
    holding_type: selectedHoldingType,
    total_cost: totalCost,
    latest_value: latestValue,
    lots: selectedLots,
  });
  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateOnboardingHolding(holdingForm));
  }, [holdingForm]);

  const onHoldingSelect = (symbol, holdingType, symbolCurrency) => {
    let lots = [];
    if (holdingType === HOLDING_TYPE_DEFAULT) {
      lots.push({ shares: 0, cost_per_share: 0 });
    }
    setHoldingForm({
      ...holdingForm,
      symbol: symbol,
      holding_type: holdingType,
      currency: symbolCurrency === '' ? baseCurrency : symbolCurrency,
      lots: lots,
    });
  };

  const onLatestValueChange = e => {
    setHoldingForm({
      ...holdingForm,
      latest_value: e,
    });
  };

  const onTotalCostChange = e => {
    setHoldingForm({
      ...holdingForm,
      total_cost: e,
    });
  };

  const onCurrencyChange = e => {
    setHoldingForm({
      ...holdingForm,
      currency: e.code,
    });
  };

  const onSharesChange = e => {
    setHoldingForm({
      ...holdingForm,
      lots: [{ ...holdingForm.lots[0], shares: e }],
    });
  };

  const onCostPerShareChange = e => {
    setHoldingForm({
      ...holdingForm,
      lots: [{ ...holdingForm.lots[0], cost_per_share: e }],
    });
  };

  const onAdd = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    addInvestmentHolding(stringifyHolding());
    navigation.goBack();
  };

  const onDelete = () => {
    deleteInvestmentHolding(idx);
    navigation.goBack();
  };

  const onSave = () => {
    updateInvestmentHolding(idx, stringifyHolding());
    navigation.goBack();
  };

  const stringifyHolding = () => ({
    currency: holdingForm.currency,
    symbol: holdingForm.symbol,
    holding_type: holdingForm.holding_type,
    total_cost:
      holdingForm.holding_type === HOLDING_TYPE_DEFAULT
        ? null
        : String(holdingForm.total_cost),
    latest_value:
      holdingForm.holding_type === HOLDING_TYPE_DEFAULT
        ? null
        : String(holdingForm.latest_value),
    lots:
      holdingForm.lots.length > 0
        ? [
            {
              shares: String(holdingForm.lots[0].shares),
              cost_per_share: String(holdingForm.lots[0].cost_per_share),
            },
          ]
        : [],
  });

  const renderHoldingSearchResult = e => {
    let item;
    if (e.item === null) {
      item = { symbol: e.searchTerm, desc: 'Add as custom symbol' };
    } else {
      item = { symbol: e.item.symbol, desc: e.item.security_name };
    }
    return <HoldingSearchResult item={item} />;
  };

  const allowSelectCurrency = () =>
    holdingForm.holding_type !== HOLDING_TYPE_DEFAULT;

  const renderSymbolInput = () => {
    return (
      <SearchBottomSheetInput
        label="Symbol"
        queryKey={queryKeys.securities}
        inputVal={holdingForm.symbol}
        placeholder="Search (e.g. TSLA) or add custom"
        useQuery={useSearchSecurities}
        processResp={resp => resp.securities}
        errorMessage={showValidation && formErrors.symbol}
        onSelect={e => {
          if (e.item === null) {
            onHoldingSelect(e.searchTerm, HOLDING_TYPE_CUSTOM, '');
          } else {
            onHoldingSelect(
              e.item.symbol,
              HOLDING_TYPE_DEFAULT,
              e.item.currency,
            );
          }
        }}
        renderItem={e => renderHoldingSearchResult(e)}
      />
    );
  };

  const renderOtherInputs = () => {
    if (holdingForm.holding_type === HOLDING_TYPE_CUSTOM) {
      return (
        <View>
          <BaseMonetaryInput
            label="Latest Value"
            value={holdingForm.latest_value}
            onChangeText={onLatestValueChange}
            errorMessage={showValidation && formErrors.budget_amount}
            currency={holdingForm.currency}
            allowSelectCurrency={() => allowSelectCurrency()}
            onChangeCurrency={onCurrencyChange}
          />
          <BaseMonetaryInput
            label="Invested Amount"
            value={holdingForm.total_cost}
            onChangeText={onTotalCostChange}
            errorMessage={showValidation && formErrors.budget_amount}
            currency={holdingForm.currency}
            allowSelectCurrency={() => allowSelectCurrency()}
            onChangeCurrency={onCurrencyChange}
          />
        </View>
      );
    } else if (holdingForm.holding_type === HOLDING_TYPE_DEFAULT) {
      return (
        <View>
          <BaseInput
            label="Number of shares"
            value={String(holdingForm.lots[0].shares)}
            keyboardType="numeric"
            onChangeText={onSharesChange}
            errorMessage={showValidation && formErrors.lots}
          />
          <BaseMonetaryInput
            label="Cost per share"
            value={holdingForm.lots[0].cost_per_share}
            onChangeText={onCostPerShareChange}
            currency={holdingForm.currency}
          />
        </View>
      );
    }
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
        {renderSymbolInput()}
        {renderOtherInputs()}
        {idx > -1 ? (
          <DeleteSaveButton
            onSave={onSave}
            onDelete={onDelete}
            allowDelete={true}
          />
        ) : (
          <BaseButton title="Add" size="lg" width={200} onPress={onAdd} />
        )}
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
