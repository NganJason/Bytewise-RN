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

const OtpExpirationTime = 60;
const OtpScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { email = 'your email', password = '' } = route?.params || {};
  const {
    signup,
    isSignupLoading,
    getSignupError,
    verifyEmail,
    isVerifyEmailLoading,
    getVerifyEmailError,
  } = useContext(AuthContext);

  // Set loading longer to prevent flickering
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

  const [expirationSecond, setExpirationSecond] = useState(OtpExpirationTime);
  const resetTimer = () => {
    setExpirationSecond(OtpExpirationTime);
  };
  useEffect(() => {
    let id = setInterval(() => {
      setExpirationSecond(prev => {
        if (prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  const onResend = () => {
    signup(
      {
        email: email,
        password: password,
      },
      resp => {
        resetTimer();
      },
    );
  };

  useError([getVerifyEmailError(), getSignupError()]);

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

        {expirationSecond > 0 ? (
          <BaseText margin={{ top: 10 }} color={theme.colors.color7}>
            Resend OTP in {expirationSecond}s
          </BaseText>
        ) : (
          <BaseButton
            type="clear"
            title="Resend"
            loading={isSignupLoading}
            onPress={onResend}
          />
        )}
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
