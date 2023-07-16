import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
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
import { useCreateHolding } from '../../../_shared/mutations/investment';
import { useSearchSecurities } from '../../../_shared/query/investment';
import { validateHolding } from '../../../_shared/validator/investment';

const scrollableTabs = [
  { name: 'Common stocks', iconName: 'line-graph', iconType: 'entypo' },
  { name: 'Custom', iconName: 'edit', iconType: 'entypo' },
];

const HoldingForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const accountID = route.params?.account_id || '';

  const [activeTab, setActiveTab] = useState(scrollableTabs[0]);
  const onTabChange = tab => {
    setActiveTab(tab);
    let holdingType = HOLDING_TYPE_DEFAULT;
    if (tab.name === 'Custom') {
      holdingType = HOLDING_TYPE_CUSTOM;
    }

    setHoldingForm({
      ...holdingForm,
      symbol: '',
      holding_type: holdingType,
    });
  };

  const [holdingForm, setHoldingForm] = useState({
    account_id: accountID,
    symbol: '',
    holding_type: HOLDING_TYPE_DEFAULT,
    latest_value: 0,
    avg_cost: 0,
  });

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateHolding(holdingForm));
  }, [holdingForm]);

  const createHolding = useCreateHolding({
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

  const onAvgCostChange = e => {
    setHoldingForm({
      ...holdingForm,
      avg_cost: e,
    });
  };

  const onSave = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    createHolding.mutate(holdingForm);
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Add holding</BaseText>
          </View>
        ),
      }}>
      <View>
        <BaseScrollableTab
          tabs={scrollableTabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        {activeTab.name === scrollableTabs[0].name ? (
          <SearchBottomSheetInput
            label="Symbol"
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
              label="Custom symbol"
              value={holdingForm.symbol}
              onChangeText={onCustomSymbolChange}
              clearButtonMode="always"
              maxLength={120}
              errorMessage={showValidation && formErrors.symbol}
            />

            <BaseCurrencyInput
              label="Latest price"
              value={holdingForm.latest_value}
              onChangeText={onLatestValueChange}
              errorMessage={showValidation && formErrors.budget_amount}
            />

            <BaseCurrencyInput
              label="Total invested amount"
              value={holdingForm.avg_cost}
              onChangeText={onAvgCostChange}
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
            loading={createHolding.isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
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
