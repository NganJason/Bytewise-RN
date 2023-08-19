import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  BaseButton,
  BaseProgressTab,
  BaseScreen,
  BaseText,
} from '../../Components';
import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';
import { useDimension } from '../../_shared/hooks';
import AccountOnboarding from './AccountOnboarding';
import BudgetOnboarding from './BudgetOnboarding';
import CategoryOnboarding from './CategoryOnboarding';
import InvestmentOnboarding from './InvestmentOnboarding';

const DefaultCategoryBudgets = [
  {
    category_name: 'Food',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Rental',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Entertainment',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Groceries',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Travel',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
];

const defaultData = {
  categoryBudgets: DefaultCategoryBudgets,
};

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

  const [data, setData] = useState(defaultData);
  const [committedData, setCommittedData] = useState(defaultData);

  const [activeTab, setActiveTab] = useState(0);
  const onNext = () => {
    setActiveTab(activeTab + 1);
    setCommittedData({ ...data });
  };
  const onBack = () => {
    if (activeTab === 0) {
      navigation.goBack();
    } else {
      setActiveTab(activeTab - 1);
    }
  };
  const onSkip = () => {
    setActiveTab(activeTab + 1);
    setData({ ...committedData });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CategoryOnboarding data={data} setData={setData} />;
      case 1:
        return <BudgetOnboarding data={data} setData={setData} />;
      case 2:
        return <AccountOnboarding data={data} setData={setData} />;
      case 3:
        return <InvestmentOnboarding data={data} setData={setData} />;
      default:
        return <CategoryOnboarding data={data} setData={setData} />;
    }
  };

  return (
    <BaseScreen headerProps={{ allowBack: true, onBack: onBack }}>
      <BaseProgressTab numTab={4} activeTab={activeTab} />
      <View style={styles.body}>{renderTabContent()}</View>
      <View style={styles.footer}>
        <BaseButton title="Next" size="lg" width={200} onPress={onNext} />
        <TouchableOpacity onPress={onSkip}>
          <BaseText text2 style={styles.skipText}>
            Skip
          </BaseText>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenHeight) => {
  return StyleSheet.create({
    body: {
      flex: 1,
      paddingTop: screenHeight * 0.015,
    },
    footer: {
      minHeight: screenHeight * 0.1,
      paddingTop: 20,
      paddingBottom: screenHeight * 0.025,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    skipText: {
      color: theme.colors.color1,
      marginTop: 10,
    },
  });
};

export default OnboardingScreen;
