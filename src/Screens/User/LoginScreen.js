import { useContext, useState, useEffect } from 'react';
import { Divider, Icon, useTheme } from '@rneui/themed';
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

const LoginScreen = () => {
  const { theme } = useTheme();
  const { screenWidth } = useDimension();
  const styles = getStyles(theme);

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
          <BaseText
            h1
            style={{ color: theme.colors.color1, ...styles.titleSpacing }}>
            Pocketeer
          </BaseText>
          <BaseText h3 style={styles.titleSpacing}>
            Your personal financial companion
          </BaseText>
          <BaseImage
            width={screenWidth * 0.7}
            height={screenWidth * 0.5}
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
                color={theme.colors.color5}
              />
            }
            value={loginForm.username}
            onChangeText={onUsernameChange}
            maxLength={60}
            onBlur={onUsernameBlur}
            errorMessage={formInputsTouched.username && formErrors.username}
          />
          <BaseInput
            placeholder="Password"
            leftIcon={
              <Icon name="lock" type="feather" color={theme.colors.color5} />
            }
            value={loginForm.password}
            onChangeText={onPasswordChange}
            secureTextEntry
            onBlur={onPasswordBlur}
            errorMessage={formInputsTouched.password && formErrors.password}
          />
        </View>

        <View>
          <BaseButton
            title="Log In"
            size="lg"
            width={200}
            onPress={onLogin}
            loading={isLoginLoading}
            disabled={Object.keys(formErrors).length !== 0}
          />
          <Divider style={styles.divider} />
          <View style={styles.loginCtaContainer}>
            <BaseText>Not a user? </BaseText>
            <LinkText h4 route={ROUTES.signup}>
              Sign up now
            </LinkText>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    titleSpacing: {
      marginBottom: 14,
    },
    screen: {
      justifyContent: 'center',
      rowGap: theme.spacing.xs,
      paddingVertical: 20,
      height: '100%',
    },
    divider: {
      marginVertical: 24,
    },
    loginCtaContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
};

export default LoginScreen;
