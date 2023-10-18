import { useContext, useState, useEffect } from 'react';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseInput,
  BaseScreen,
  BaseText,
  BaseImage,
  LinkText,
  BaseKeyboardAwareScrollView,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import { loginHero } from '../../_shared/constant/asset';
import { AuthContext } from '../../_shared/context';
import { validateLogin } from '../../_shared/validator';
import { useNavigation } from '@react-navigation/native';
import { useError, useValidation, useDimension } from '../../_shared/hooks';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setFormErrors(validateLogin(loginForm));
  }, [loginForm]);

  const onEmailChange = e => {
    setLoginForm({ ...loginForm, email: e });
  };

  const onPasswordChange = e => {
    setLoginForm({ ...loginForm, password: e });
  };

  const { login, isLoginLoading, getLoginError } = useContext(AuthContext);

  const onLogin = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    login(loginForm);
  };

  useError([getLoginError()]);

  return (
    <BaseScreen scrollable>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screen}>
        <View>
          <View>
            <BaseText h2 style={styles.title}>
              Bytewise
            </BaseText>
            <BaseText h4 style={styles.tagline}>
              Organise Your Money In One Place
            </BaseText>
            <BaseImage
              width={'100%'}
              height={screenHeight * 0.25}
              source={loginHero}
            />
          </View>

          <View>
            <BaseInput
              placeholder="Email"
              leftIcon={
                <Icon
                  name="email-outline"
                  type="material-community"
                  color={theme.colors.color8}
                />
              }
              value={loginForm.email}
              onChangeText={onEmailChange}
              maxLength={60}
              errorMessage={showValidation && formErrors.email}
              containerStyle={styles.input}
            />
            <BaseInput
              placeholder="Password"
              leftIcon={
                <Icon name="lock" type="feather" color={theme.colors.color8} />
              }
              value={loginForm.password}
              onChangeText={onPasswordChange}
              secureTextEntry
              errorMessage={showValidation && formErrors.password}
              containerStyle={styles.input}
            />
          </View>

          <View>
            <View style={styles.btnContainer}>
              <BaseButton
                title="Log In"
                size="lg"
                width={200}
                onPress={onLogin}
                loading={isLoginLoading}
              />
            </View>
            <View style={styles.signUpContainer}>
              <BaseText style={{ color: theme.colors.color7 }} text2>
                Not a user?{' '}
              </BaseText>
              <LinkText
                text2
                onPress={() => navigation.navigate(ROUTES.signup)}>
                Sign up now
              </LinkText>
            </View>
          </View>
        </View>
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      justifyContent: 'center',
      height: '100%',
    },
    title: {
      marginBottom: 6,
      color: theme.colors.color1,
    },
    tagline: {
      marginBottom: 6,
      color: theme.colors.color7,
    },
    input: {
      marginBottom: 0,
    },
    btnContainer: {
      marginBottom: 16,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
};

export default LoginScreen;
