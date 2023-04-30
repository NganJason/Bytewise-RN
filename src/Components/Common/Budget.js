import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AmountText, BaseText } from '../Text';
import { useTheme } from '@rneui/themed';
import { BaseListItem } from '../View';
import { BaseCurrencyInput } from '../Input';
import { BaseButton } from '../Touch';
import BaseBottomSheetModal from '../View/BaseBottomSheetModal';

const Budget = ({
  title = 'Default Budget',
  year = 2023,
  label = '',
  amount = 0,
  highlight = false,
  onValChange = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  const onBudgetChange = e => {
    onValChange(label, e);
  };

  return (
    <>
      <BaseListItem showDivider={true}>
        <TouchableOpacity style={styles.container} onPress={toggleBottomSheet}>
          <View style={styles.textGroup}>
            <BaseText h4 style={highlight && styles.highlightText}>
              {title}
            </BaseText>
            <AmountText style={highlight && styles.highlightText}>
              {amount}
            </AmountText>
          </View>
        </TouchableOpacity>
      </BaseListItem>

      <BaseBottomSheetModal
        isVisible={isBottomSheetVisible}
        close={toggleBottomSheet}
        headerProps={{
          leftComponent: <BaseText h2>{`${title} ${year}`}</BaseText>,
          leftComponentStyle: styles.bottomSheetHeader,
        }}>
        <BaseCurrencyInput value={amount} onChangeText={onBudgetChange} />
        <BaseButton
          title="Done"
          size="lg"
          width={200}
          onPress={toggleBottomSheet}
        />
      </BaseBottomSheetModal>
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
