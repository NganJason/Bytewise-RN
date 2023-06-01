import { Icon, useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseButton, BaseInput, BaseScreen, BaseText } from '../../Components';
import { signupHero } from '../../_shared/constant/asset';
import { LinkText } from '../../Components/Text';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { AuthContext } from '../../_shared/context/AuthContext';
import { renderErrorsToast } from '../../_shared/util/toast';
import { BaseImage } from '../../Components/View';

const SignupScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
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
          <BaseText h2 style={{ color: theme.colors.color1 }}>
            Join us!
          </BaseText>
          <BaseText h2>Manage your finances today</BaseText>
        </View>

        <BaseImage
          width={screenWidth * 0.8}
          height={screenWidth * 0.6}
          source={signupHero}
          containerStyle={styles.img}
        />

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
          containerStyle={styles.passwordInput}
        />
        <LinkText h4 route={ROUTES.login}>
          Login here
        </LinkText>

        <View style={styles.buttonContainer}>
          <BaseButton
            title="Signup"
            size="lg"
            width={200}
            onPress={onSignup}
            loading={isSignupLoading}
          />
        </View>
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenWidth, screenHeight) => {
  return StyleSheet.create({
    screen: {
      flexDirection: 'column',
      justifyContent: 'center',
      rowGap: theme.spacing.md,

      height: screenHeight * 0.8,
      paddingHorizontal: theme.spacing.xl,
    },
    img: {
      alignSelf: 'center',
    },
    passwordInput: {
      marginBottom: 5,
    },
    buttonContainer: {
      marginTop: 30,
    },
  });
};

export default SignupScreen;
