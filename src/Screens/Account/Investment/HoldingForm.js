import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  BaseButton,
  BaseRow,
  BaseScreen,
  BaseText,
  SearchBottomSheetInput,
} from '../../../Components';
import { HOLDING_TYPE_DEFAULT } from '../../../_shared/apis/enum';
import { useValidation } from '../../../_shared/hooks/validation';
import { useCreateHolding } from '../../../_shared/mutations/investment';
import { useSearchSecurities } from '../../../_shared/query/investment';
import { validateHolding } from '../../../_shared/validator/investment';

const HoldingForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const accountID = route.params?.account_id || '';

  const [holdingForm, setHoldingForm] = useState({
    account_id: accountID,
    symbol: '',
    holding_type: HOLDING_TYPE_DEFAULT,
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

  const onSymbolChange = e => {
    setHoldingForm({ ...holdingForm, symbol: e });
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
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <SearchBottomSheetInput
          label="Symbol"
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
  });

export default HoldingForm;
