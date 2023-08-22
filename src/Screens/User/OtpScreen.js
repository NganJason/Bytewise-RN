import { useTheme } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseNumInputBox,
  BaseScreen,
  BaseText,
} from '../../Components';
import { AuthContext } from '../../_shared/context';
import { useError } from '../../_shared/hooks';

const OtpScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { email = 'your email' } = route?.params || {};
  const { verifyEmail, isVerifyEmailLoading, getVerifyEmailError } =
    useContext(AuthContext);

  // Make the loading longer to enhance UI
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const onOtpChange = e => {
    if (e.length === 6) {
      setIsOtpLoading(true);
      setTimeout(() => {
        verifyEmail({ email: email, code: e });
      }, 2000);
    }
  };
  useEffect(() => {
    if (!isVerifyEmailLoading) {
      setIsOtpLoading(false);
    }
  }, [isVerifyEmailLoading]);

  // Visual cue to indicate that users have successfully pressed resend
  const [isResendLoading, setIsResendLoading] = useState(false);
  const onResend = () => {
    setIsResendLoading(true);
    setTimeout(() => {
      setIsResendLoading(false);
    }, 1000);
  };

  const verifyEmailError = getVerifyEmailError();
  useError([verifyEmailError]);

  return (
    <BaseScreen headerProps={{ allowBack: true }}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <BaseText h3>Let's verify your</BaseText>
          <BaseText h3>email address</BaseText>

          <BaseText text3 margin={{ top: 10 }} color={theme.colors.color7}>
            Please enter the 6-digit code sent to
          </BaseText>
          <BaseText text3 color={theme.colors.color7} bold>
            {email}
          </BaseText>
        </View>

        <View style={styles.otpContainer}>
          <BaseNumInputBox
            numDigit={6}
            onChange={onOtpChange}
            isLoading={isVerifyEmailLoading || isOtpLoading}
          />
        </View>

        <BaseButton
          type="clear"
          title="Resend"
          loading={isResendLoading}
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
