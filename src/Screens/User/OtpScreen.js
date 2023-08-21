import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseNumInputBox,
  BaseScreen,
  BaseText,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';

const OtpScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { email = 'jason.ngan@hotmail.com' } = route?.params || {};

  const [otp, setOtp] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const onOtpChange = e => {
    setOtp(e);
    if (e.length === 4) {
      setIsOtpLoading(true);
      setTimeout(() => {
        navigation.navigate(ROUTES.welcome);
      }, 2000);
    }
  };

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const onResend = () => {
    // Visual cue to indicate that users have successfully pressed resend
    setIsButtonLoading(true);
    setTimeout(() => {
      setIsButtonLoading(false);
    }, 2000);
  };

  const onBack = () => {
    navigation.navigate(ROUTES.signup);
  };

  return (
    <BaseScreen headerProps={{ allowBack: true, onBack: onBack }}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <BaseText h3>Let's verify your</BaseText>
          <BaseText h3>email address</BaseText>

          <BaseText text3 margin={{ top: 10 }} color={theme.colors.color7}>
            Please input the 4-digit code sent to
          </BaseText>
          <BaseText text3 color={theme.colors.color7} bold>
            {email}
          </BaseText>
        </View>

        <View style={styles.otpContainer}>
          <BaseNumInputBox
            numDigit={4}
            onChange={onOtpChange}
            isLoading={isOtpLoading}
          />
        </View>

        <BaseButton
          type="clear"
          title="Resend"
          loading={isButtonLoading}
          onPress={onResend}
        />
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center',
      marginTop: '30%',
    },
    header: {
      alignItems: 'center',
    },
    otpContainer: {
      marginTop: 24,
      marginBottom: 10,
    },
  });
};

export default OtpScreen;
