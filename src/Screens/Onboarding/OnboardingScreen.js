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
import { useDimension, useError } from '../../_shared/hooks';
import { useInitUser } from '../../_shared/mutations/user';
import AccountOnboarding from './AccountOnboarding';
import BudgetOnboarding from './BudgetOnboarding';
import CategoryOnboarding from './CategoryOnboarding';
import InvestmentOnboarding from './InvestmentOnboarding';

const tabs = [
  { name: 'category', canSkip: false },
  { name: 'budget', canSkip: true },
  { name: 'account', canSkip: true },
  { name: 'investment', canSkip: true },
];

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const { commitCategories, commitBudgets, commitAccounts, commitInvestment } =
    useContext(OnboardingDataContext);
  const { setOnboardingStatus } = useContext(UserMetaContext);
  const initUser = useInitUser();

  const [activeTab, setActiveTab] = useState(0);
  const onButtonPress = () => {
    let tab = tabs[activeTab];
    switch (tab.name) {
      case 'category':
        commitCategories(nextPage);
        break;
      case 'budget':
        commitBudgets(nextPage);
        break;
      case 'account':
        commitAccounts(nextPage);
        break;
      case 'investment':
        commitInvestment(markUserOnboarded);
        break;
      default:
        break;
    }
  };

  const onSkip = () => {
    nextPage();
  };

  const isLastTab = () => {
    return activeTab === tabs.length - 1;
  };

  const nextPage = () => {
    if (isLastTab()) {
      return;
    }
    setActiveTab(activeTab + 1);
  };

  const markUserOnboarded = () => {
    initUser.mutate(
      {},
      {
        onSuccess: () => {
          setOnboardingStatus(true);
        },
      },
    );
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
      default:
        return <CategoryOnboarding />;
    }
  };

  const canSkip = () => {
    return !isLastTab() && tabs[activeTab].canSkip;
  };

  const isSubmitButtonLoading = () => {
    return false;
  };

  return (
    <BaseScreen>
      <View style={styles.screen}>
        <BaseProgressTab numTab={4} activeTab={activeTab} />
        <View style={styles.body}>{renderTabContent()}</View>
        <View style={styles.footer}>
          <BaseButton
            title={isLastTab() ? 'Submit' : 'Next'}
            size="lg"
            width={200}
            onPress={onButtonPress}
            // isLoading={
            //   isLastTab() ? isSubmitButtonLoading() : isNextButtonLoading()
            // }
          />

          {canSkip() && (
            <TouchableOpacity onPress={onSkip}>
              <BaseText text2 style={styles.skipText}>
                Skip
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
      paddingTop: screenHeight * 0.12,
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
