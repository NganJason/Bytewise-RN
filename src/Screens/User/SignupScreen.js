import { useContext, useState, useEffect } from 'react';
import { Icon, useTheme, Divider } from '@rneui/themed';
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

import { signupHero } from '../../_shared/constant/asset';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { AuthContext } from '../../_shared/context/AuthContext';
import { renderErrorsToast } from '../../_shared/util/toast';
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
            value={signupForm.username}
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
            value={signupForm.password}
            onChangeText={onPasswordChange}
            secureTextEntry
            onBlur={onPasswordBlur}
            errorMessage={formInputsTouched.password && formErrors.password}
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
          <View style={styles.signupCtaContainer}>
            <BaseText>Already a user? </BaseText>
            <LinkText h4 route={ROUTES.login}>
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
    signupCtaContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
};

export default SignupScreen;
