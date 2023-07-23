import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
  BaseKeyboardAwareScrollView,
  BaseRow,
  BaseScreen,
  BaseScrollableTab,
  BaseText,
  SearchBottomSheetInput,
} from '../../../Components';
import {
  HOLDING_TYPE_CUSTOM,
  HOLDING_TYPE_DEFAULT,
} from '../../../_shared/apis/enum';
import { useValidation } from '../../../_shared/hooks/validation';
import {
  useCreateHolding,
  useUpdateHolding,
} from '../../../_shared/mutations/investment';
import {
  useGetHolding,
  useSearchSecurities,
} from '../../../_shared/query/investment';
import { useError } from '../../../_shared/hooks/error';
import { validateHolding } from '../../../_shared/validator/investment';
import { toolTipMessage } from '../../../_shared/constant/message';

const scrollableTabs = [
  { name: 'Common stocks', iconName: 'line-graph', iconType: 'entypo' },
  { name: 'Custom symbol', iconName: 'edit', iconType: 'entypo' },
];

const HoldingForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { account_id: accountID = '', holding_id: holdingID = '' } =
    route?.params || {};
  const isAddHolding = () => {
    return holdingID === '';
  };

  const [activeTab, setActiveTab] = useState(
    isAddHolding() ? scrollableTabs[0] : scrollableTabs[1],
  );
  const onTabChange = tab => {
    setActiveTab(tab);

    setHoldingForm({
      ...holdingForm,
      symbol: '',
      holding_type:
        tab.Name === 'Custom symbol'
          ? HOLDING_TYPE_CUSTOM
          : HOLDING_TYPE_DEFAULT,
      total_cost: 0,
      latest_value: 0,
    });
  };

  const [holdingForm, setHoldingForm] = useState({
    account_id: accountID,
    symbol: '',
    holding_type: HOLDING_TYPE_DEFAULT,
    total_cost: 0,
    latest_value: 0,
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
      let { holding } = getHolding?.data || {};
      setHoldingForm({ ...holding });
    }
  }, [getHolding.data]);

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

  const onDefaultSymbolChange = e => {
    setHoldingForm({
      ...holdingForm,
      symbol: e,
      holding_type: HOLDING_TYPE_DEFAULT,
    });
  };

  const onCustomSymbolChange = e => {
    setHoldingForm({
      ...holdingForm,
      symbol: e,
      holding_type: HOLDING_TYPE_CUSTOM,
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

  useError([createHolding, updateHolding]);

  return (
    <BaseScreen
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
      <View>
        <BaseScrollableTab
          tabs={scrollableTabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          disableNonActive={!isAddHolding()}
        />
      </View>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        {activeTab.name === scrollableTabs[0].name ? (
          <SearchBottomSheetInput
            label="Symbol"
            desc={toolTipMessage.symbolDesc}
            itemLabel="symbol"
            onChangeText={onDefaultSymbolChange}
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
        ) : (
          <View>
            <BaseInput
              label="Custom Symbol"
              desc={toolTipMessage.customSymbolDesc}
              value={holdingForm.symbol}
              onChangeText={onCustomSymbolChange}
              clearButtonMode="always"
              maxLength={120}
              errorMessage={showValidation && formErrors.symbol}
            />

            <BaseCurrencyInput
              label="Latest Total Market Value"
              desc={toolTipMessage.totalLatestMarketValueDesc}
              value={holdingForm.latest_value}
              onChangeText={onLatestValueChange}
              errorMessage={showValidation && formErrors.budget_amount}
            />

            <BaseCurrencyInput
              label="Total Invested Amount"
              desc={toolTipMessage.totalInvestedAmount}
              value={holdingForm.total_cost}
              onChangeText={onTotalCostChange}
              errorMessage={showValidation && formErrors.budget_amount}
            />
          </View>
        )}

        <View style={styles.btnContainer}>
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            onPress={onSave}
            loading={createHolding.isLoading || updateHolding.isLoading}
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
