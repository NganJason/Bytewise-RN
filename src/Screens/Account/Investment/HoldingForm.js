import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DeleteSaveButton,
  BaseMonetaryInput,
  BaseKeyboardAwareScrollView,
  BaseScreen,
  BaseText,
  SearchBottomSheetInput,
  BaseInput,
  HoldingSearchResult,
} from '../../../Components';
import {
  HOLDING_TYPE_CUSTOM,
  HOLDING_TYPE_DEFAULT,
} from '../../../_shared/apis/enum';
import { useCreateHolding, useUpdateHolding } from '../../../_shared/mutations';
import {
  queryKeys,
  useGetHolding,
  useSearchSecurities,
} from '../../../_shared/query';
import { useError, useValidation } from '../../../_shared/hooks';
import { validateHolding } from '../../../_shared/validator';
import { useDeleteHolding } from '../../../_shared/mutations/investment';

const HoldingForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    account_id: accountID = '',
    holding_id: holdingID = '',
    currency: accountCurrency = '',
  } = route?.params || {};

  const isAddHolding = () => {
    return holdingID === '';
  };

  const [holdingForm, setHoldingForm] = useState({
    holding_id: holdingID,
    account_id: accountID,
    currency: accountCurrency,
    symbol: '',
    holding_type: 0,
    total_cost: 0,
    latest_value: 0,
    lots: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateHolding(holdingForm));
  }, [holdingForm]);

  const getHolding = useGetHolding(
    { holding_id: holdingID },
    {
      enabled: !isAddHolding(),
    },
  );
  useEffect(() => {
    if (getHolding.data) {
      const { holding } = getHolding?.data || {};
      setHoldingForm({ ...holding });
    }
  }, [getHolding?.data]);

  const createHolding = useCreateHolding({
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const updateHolding = useUpdateHolding({
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const deleteHolding = useDeleteHolding({
    onSuccess: () => {
      navigation.goBack();
    },
    meta: {
      account_id: holdingForm.account_id,
    },
  });

  const onHoldingSelect = (symbol, holdingType, symbolCurrency) => {
    let lots = [];
    if (holdingType === HOLDING_TYPE_DEFAULT) {
      lots.push({ shares: 0, cost_per_share: 0 });
    }
    setHoldingForm({
      ...holdingForm,
      symbol: symbol,
      holding_type: holdingType,
      currency: symbolCurrency === '' ? accountCurrency : symbolCurrency,
      lots: lots,
    });
  };

  const onSymbolChange = e => {
    setHoldingForm({
      ...holdingForm,
      symbol: e,
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

  const onSave = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    let form = { ...holdingForm };
    if (holdingForm.holding_type === HOLDING_TYPE_DEFAULT) {
      form.total_cost = null;
      form.latest_value = null;
    }

    if (isAddHolding()) {
      createHolding.mutate(form);
    } else {
      updateHolding.mutate(form);
    }
  };

  const onDelete = () => {
    deleteHolding.mutate({
      holding_id: holdingForm.holding_id,
    });
  };

  useError([createHolding, updateHolding, deleteHolding]);

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
    isAddHolding() && holdingForm.holding_type !== HOLDING_TYPE_DEFAULT;

  const renderSymbolInput = () => {
    if (isAddHolding()) {
      return (
        <SearchBottomSheetInput
          label="Symbol"
          queryKey={queryKeys.securities}
          inputVal={holdingForm.symbol}
          placeholder="Search (e.g. TSLA) or add custom"
          useQuery={useSearchSecurities}
          processResp={resp => resp.securities}
          errorMessage={showValidation && formErrors.symbol}
          disabled={
            !isAddHolding() && holdingForm.holding_type === HOLDING_TYPE_DEFAULT
          }
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
    } else {
      return (
        <BaseInput
          label="Symbol"
          value={holdingForm.symbol}
          onChangeText={onSymbolChange}
          errorMessage={showValidation && formErrors.symbol}
          disabled={holdingForm.holding_type !== HOLDING_TYPE_CUSTOM}
        />
      );
    }
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
      isLoading={getHolding.isLoading}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>
              {isAddHolding() ? 'Add Holding' : 'Edit Holding'}
            </BaseText>
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
        <DeleteSaveButton
          onSave={onSave}
          isSaveLoading={createHolding.isLoading || updateHolding.isLoading}
          onDelete={onDelete}
          isDeleteLoading={deleteHolding.isLoading}
          allowDelete={!isAddHolding()}
        />
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    btnContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    securityName: {
      marginTop: 4,
      color: theme.colors.color8,
    },
    formBody: {
      marginTop: 20,
    },
    searchHeader: {
      marginVertical: 10,
    },
    searchHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default HoldingForm;
