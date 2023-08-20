import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  BaseButton,
  BaseProgressTab,
  BaseScreen,
  BaseText,
} from '../../Components';
import { OnboardingDataContext } from '../../_shared/context';
import { useDimension } from '../../_shared/hooks';
import AccountOnboarding from './AccountOnboarding';
import BudgetOnboarding from './BudgetOnboarding';
import CategoryOnboarding from './CategoryOnboarding';
import InvestmentOnboarding from './InvestmentOnboarding';

const tabs = ['category', 'budget', 'account', 'investment'];

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();
  const { commitData, rollbackData } = useContext(OnboardingDataContext);

  const [activeTab, setActiveTab] = useState(0);
  const onNext = () => {
    setActiveTab(activeTab + 1);
    commitData();
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
    rollbackData();
  };

  const onSubmit = () => {};

  const isLastTab = () => {
    return activeTab === tabs.length - 1;
  };

  const renderTabContent = () => {
    let tabValue = tabs[activeTab];
    switch (tabValue) {
      case 'category':
        return <CategoryOnboarding />;
      case 'budget':
        return <BudgetOnboarding />;
      case 'account':
        return <AccountOnboarding />;
      case 'investment':
        return <InvestmentOnboarding />;
      default:
        return <CategoryOnboarding />;
    }
  };

  return (
    <BaseScreen headerProps={{ allowBack: true, onBack: onBack }}>
      <BaseProgressTab numTab={4} activeTab={activeTab} />
      <View style={styles.body}>{renderTabContent()}</View>
      <View style={styles.footer}>
        <BaseButton
          title={isLastTab() ? 'Submit' : 'Next'}
          size="lg"
          width={200}
          onPress={isLastTab() ? onSubmit : onNext}
        />

        {!isLastTab() && (
          <TouchableOpacity onPress={onSkip}>
            <BaseText text2 style={styles.skipText}>
              Skip
            </BaseText>
          </TouchableOpacity>
        )}
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
      minHeight: screenHeight * 0.15,
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
