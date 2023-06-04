import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, useTheme, Divider } from '@rneui/themed';

import {
  BaseButton,
  BaseInput,
  BaseScreen,
  BaseText,
  BaseImage,
  LinkText,
} from '../../Components';

import { signupHero } from '../../_shared/constant/asset';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { AuthContext } from '../../_shared/context/AuthContext';
import { renderErrorsToast } from '../../_shared/util/toast';

const SignupScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const { signup, isSignupLoading, getSignupError } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const onUsernameChange = e => {
    setUsername(e);
  };

  const [password, setPassword] = useState('');
  const onPasswordChange = e => {
    setPassword(e);
  };

  const onSignup = () => {
    signup({ username, password });
  };

  return (
    <BaseScreen errorToast={renderErrorsToast([getSignupError()])}>
      <View style={styles.screen}>
        <View>
          <BaseText
            h1
            style={{ color: theme.colors.color1, ...styles.titleSpacing }}>
            Join us!
          </BaseText>
          <BaseText h3 style={styles.titleSpacing}>
            Achieve your financial goals
          </BaseText>
          <BaseImage
            width={screenWidth * 0.8}
            height={screenWidth * 0.6}
            source={signupHero}
          />
        </View>

        <View>
          <BaseInput
            placeholder="Username"
            leftIcon={
              <Icon
                name="email-outline"
                type="material-community"
                color={theme.colors.color5}
              />
            }
            value={username}
            onChangeText={onUsernameChange}
          />
          <BaseInput
            placeholder="Password"
            leftIcon={
              <Icon name="lock" type="feather" color={theme.colors.color5} />
            }
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry
          />
        </View>

        <View>
          <BaseButton
            title="Sign Up"
            size="lg"
            width={200}
            onPress={onSignup}
            loading={isSignupLoading}
          />
          <Divider style={styles.divider} />
          <View style={styles.signUpCtaContainer}>
            <BaseText>Already a user? </BaseText>
            <LinkText h4 route={ROUTES.login}>
              Log in now
            </LinkText>
          </View>
        </View>
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenHeight) => {
  return StyleSheet.create({
    titleSpacing: {
      marginBottom: 14,
    },
    screen: {
      justifyContent: 'center',
      rowGap: theme.spacing.md,
      height: screenHeight * 0.8,
    },
    img: {
      alignSelf: 'center',
      backgroundColor: 'red',
    },
    divider: {
      marginVertical: 24,
    },
    signUpCtaContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
};

export default SignupScreen;
