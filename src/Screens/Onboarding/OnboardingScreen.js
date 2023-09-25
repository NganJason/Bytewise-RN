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
import { UserMetaContext } from '../../_shared/context/UserMetaContext';
import { useDimension } from '../../_shared/hooks';
import AccountOnboarding from './AccountOnboarding';
import BudgetOnboarding from './BudgetOnboarding';
import CategoryOnboarding from './CategoryOnboarding';
import CurrencyOnboarding from './CurrencyOnboarding';
import InvestmentOnboarding from './InvestmentOnboarding';

const tabs = [
  { name: 'category', canSkip: false },
  { name: 'budget', canSkip: true },
  { name: 'account', canSkip: true },
  { name: 'investment', canSkip: true },
  { name: 'currency', canSkip: false },
];

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const { commitData, rollbackData, setupUser } = useContext(
    OnboardingDataContext,
  );
  const { setShowSetupSplashScreen } = useContext(UserMetaContext);
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState(0);
  const onButtonPress = () => {
    commitData();
    if (!isLastTab()) {
      nextPage();
    } else {
      setupUser();
      setShowSetupSplashScreen(true);
    }
  };

  const isLastTab = () => {
    return activeTab === tabs.length - 1;
  };

  const isFirstTab = () => {
    return activeTab === 0;
  };

  const nextPage = () => {
    if (isLastTab()) {
      return;
    }
    setActiveTab(activeTab + 1);
  };

  const prevPage = () => {
    if (isFirstTab()) {
      return;
    }
    setActiveTab(activeTab - 1);
  };

  const canSkip = () => {
    return !isLastTab() && tabs[activeTab].canSkip;
  };

  const onSkip = () => {
    if (!isLastTab()) {
      rollbackData();
      nextPage();
    }
  };

  const onBack = () => {
    if (isFirstTab()) {
      navigation.goBack();
      return;
    }
    prevPage();
  };

  const renderTabContent = () => {
    let tab = tabs[activeTab];
    switch (tab.name) {
      case 'category':
        return <CategoryOnboarding />;
      case 'budget':
        return <BudgetOnboarding />;
      case 'account':
        return <AccountOnboarding />;
      case 'investment':
        return <InvestmentOnboarding />;
      case 'currency':
        return <CurrencyOnboarding />;
      default:
        return <CategoryOnboarding />;
    }
  };

  return (
    <BaseScreen headerProps={{ allowBack: true, onBack: onBack }}>
      <View style={styles.screen}>
        <BaseProgressTab numTab={tabs.length} activeTab={activeTab} />
        <View style={styles.body}>{renderTabContent()}</View>
        <View style={styles.footer}>
          <BaseButton
            title={isLastTab() ? 'Submit' : 'Next'}
            size="lg"
            width={200}
            onPress={onButtonPress}
          />

          {canSkip() && (
            <TouchableOpacity onPress={onSkip}>
              <BaseText text2 style={styles.skipText}>
                Skip this
              </BaseText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenHeight) => {
  return StyleSheet.create({
    screen: {
      flex: 1,
    },
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
