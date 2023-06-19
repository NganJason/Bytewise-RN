import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, useTheme } from '@rneui/themed';

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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { validateUser } from '../../_shared/apis/user';

const SignupScreen = () => {
  const { theme } = useTheme();
  const { screenWidth } = useDimension();
  const styles = getStyles(theme);

  const [formErrors, setFormErrors] = useState({});

  const [formInputsTouched, setFormInputsTouched] = useState({
    username: false,
    password: false,
  });

  const [signupForm, setSignupForm] = useState({
    username: 'Jon',
    password: 'Hello123',
  });

  useEffect(() => {
    setFormErrors(validateUser(signupForm));
  }, [formInputsTouched, signupForm]);

  const onUsernameChange = e => {
    setSignupForm({ ...signupForm, username: e });
  };

  const onUsernameBlur = () => {
    setFormInputsTouched({ ...formInputsTouched, username: true });
  };

  const onPasswordChange = e => {
    setSignupForm({ ...signupForm, password: e });
  };

  const onPasswordBlur = () => {
    setFormInputsTouched({ ...formInputsTouched, password: true });
  };

  const { signup, isSignupLoading, getSignupError } = useContext(AuthContext);
  const navigation = useNavigation();

  const onSignup = () => {
    signup(signupForm);
  };

  return (
    <BaseScreen errorToast={renderErrorsToast([getSignupError()])}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screen}>
        <View>
          <BaseText h2 style={styles.title}>
            Join us
          </BaseText>
          <BaseText h4 style={styles.tagline}>
            Achieve your financial goals
          </BaseText>
          <BaseImage
            width={screenWidth * 0.7}
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
                color={theme.colors.color8}
              />
            }
            value={signupForm.username}
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
            value={signupForm.password}
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
              title="Sign Up"
              size="lg"
              width={200}
              onPress={onSignup}
              loading={isSignupLoading}
            />
          </View>
          <View style={styles.signUpContainer}>
            <BaseText style={{ color: theme.colors.color7 }} text2>
              Already a user?{' '}
            </BaseText>
            <LinkText text2 onPress={() => navigation.navigate(ROUTES.login)}>
              Log in now
            </LinkText>
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

export default SignupScreen;
