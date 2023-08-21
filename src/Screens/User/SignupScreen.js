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
  BaseKeyboardAwareScrollView,
} from '../../Components';

import { signupHero } from '../../_shared/constant/asset';
import ROUTES from '../../_shared/constant/routes';
import { AuthContext } from '../../_shared/context';
import { useNavigation } from '@react-navigation/native';
import { validateSignUp } from '../../_shared/validator';
import { useError, useValidation, useDimension } from '../../_shared/hooks';

const SignupScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme);

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setFormErrors(validateSignUp(signupForm));
  }, [signupForm]);

  const onEmailChange = e => {
    setSignupForm({ ...signupForm, email: e });
  };

  const onPasswordChange = e => {
    setSignupForm({ ...signupForm, password: e });
  };

  const { signup, isSignupLoading, getSignupError } = useContext(AuthContext);
  const navigation = useNavigation();

  const onSignup = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;

    if (!isValidationPassed) {
      return;
    }
    signup(signupForm);
  };

  const signupError = getSignupError();
  useError([signupError]);

  return (
    <BaseScreen>
      <BaseKeyboardAwareScrollView
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
            width={'100%'}
            height={screenHeight * 0.25}
            source={signupHero}
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
            value={signupForm.email}
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
            value={signupForm.password}
            onChangeText={onPasswordChange}
            secureTextEntry
            errorMessage={showValidation && formErrors.password}
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
      marginBottom: 18,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
};

export default SignupScreen;
