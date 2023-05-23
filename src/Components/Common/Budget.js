import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { AmountText, BaseText } from '../Text';
import { useTheme } from '@rneui/themed';
import { BaseOverlay, BaseRow } from '../View';
import { BaseCurrencyInput } from '../Input';
import { BaseButton } from '../Touch';
import { getCurrYear } from '../../_shared/util/date';

const Budget = ({
  title = 'Default Budget',
  year = getCurrYear(),
  label = '',
  amount = 0,
  highlight = false,
  onSubmit = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [budget, setBudget] = useState(amount);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  useEffect(() => {
    setBudget(amount);
  }, [amount]);

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  const onBudgetChange = e => {
    setBudget(e);
  };

  const onBtnPress = () => {
    onSubmit(label, budget);
    toggleBottomSheet();
  };

  return (
    <>
      <BaseRow onPress={toggleBottomSheet}>
        <BaseText h4 style={highlight && styles.highlightText}>
          {title}
        </BaseText>
        <AmountText style={highlight && styles.highlightText}>
          {amount}
        </AmountText>
      </BaseRow>

      <BaseOverlay
        isVisible={isBottomSheetVisible}
        onBackdropPress={toggleBottomSheet}
        onClose={toggleBottomSheet}>
        <BaseText h3>{`${title} ${year}`}</BaseText>
        <BaseCurrencyInput value={budget} onChangeText={onBudgetChange} />
        <BaseButton
          title="Done"
          size="lg"
          width={200}
          onPress={onBtnPress}
          marginVertical={20}
        />
      </BaseOverlay>
    </>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    textGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    highlightText: {
      color: theme.colors.primary,
    },
    bottomSheetHeader: {
      flex: 10,
    },
  });

export default Budget;
