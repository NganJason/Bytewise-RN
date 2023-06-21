import { useContext, useState, useEffect } from 'react';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  BaseButton,
  BaseInput,
  BaseScreen,
  BaseText,
  BaseImage,
  LinkText,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { loginHero } from '../../_shared/constant/asset';
import { AuthContext } from '../../_shared/context/AuthContext';
import { renderErrorsToast } from '../../_shared/util/toast';
import { validateUser } from '../../_shared/apis/user';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { screenWidth } = useDimension();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [formErrors, setFormErrors] = useState({});

  const [formInputsTouched, setFormInputsTouched] = useState({
    username: false,
    password: false,
  });

  const [loginForm, setLoginForm] = useState({
    username: 'Jon',
    password: 'Hello123',
  });

  useEffect(() => {
    setFormErrors(validateUser(loginForm));
  }, [formInputsTouched, loginForm]);

  const onUsernameChange = e => {
    setLoginForm({ ...loginForm, username: e });
  };

  const onUsernameBlur = () => {
    setFormInputsTouched({ ...formInputsTouched, username: true });
  };

  const onPasswordChange = e => {
    setLoginForm({ ...loginForm, password: e });
  };

  const onPasswordBlur = () => {
    setFormInputsTouched({ ...formInputsTouched, password: true });
  };

  const { login, isLoginLoading, getLoginError } = useContext(AuthContext);

  const onLogin = () => {
    login(loginForm);
  };

  return (
    <BaseScreen errorToast={renderErrorsToast([getLoginError()])}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screen}>
        <View>
          <View>
            <BaseText h2 style={styles.title}>
              Pocketeer
            </BaseText>
            <BaseText h4 style={styles.tagline}>
              Your personal financial companion
            </BaseText>
            <BaseImage
              width={screenWidth * 0.7}
              height={screenWidth * 0.6}
              source={loginHero}
            />
          </View>

          <View>
            <BaseInput
              placeholder="Username"
              leftIcon={
                <Icon
                  name="email-outline"
                  type="material-community"
                  color={theme.colors.color8}
                />
              }
              value={loginForm.username}
              onChangeText={onUsernameChange}
              maxLength={60}
              onBlur={onUsernameBlur}
              errorMessage={formInputsTouched.username && formErrors.username}
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
              onBlur={onPasswordBlur}
              errorMessage={formInputsTouched.password && formErrors.password}
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
                disabled={Object.keys(formErrors).length !== 0}
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
      </KeyboardAwareScrollView>
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
      marginBottom: 20,
    },
    btnContainer: { marginVertical: 20 },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
};

export default LoginScreen;
