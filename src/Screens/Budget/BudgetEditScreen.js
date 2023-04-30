import { useNavigation } from '@react-navigation/native';
import {
  BaseButton,
  BaseCurrencyInput,
  BaseScreen,
  BaseText,
} from '../../Components';
import { getCurrYear } from '../../_shared/util/date';

const BudgetEditScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    year = getCurrYear(),
    title = '',
    amount = 0,
    label = '',
    onChange = function () {},
  } = route.params;

  const onDone = () => {
    navigation.goBack();
  };

  const onChangeText = e => {
    onChange(label, e);
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: <BaseText h2>{`${title} ${year}`}</BaseText>,
      }}>
      <BaseCurrencyInput value={amount} onChangeText={onChangeText} />
      <BaseButton title="Done" size="lg" width={200} onPress={onDone} />
    </BaseScreen>
  );
};

export default BudgetEditScreen;
