import { useContext, useState } from 'react';
import { Icon, Image, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseButton, BaseInput, BaseScreen, BaseText } from '../../Components';
import { loginHero } from '../../_shared/constant/asset';
import { AuthContext } from '../../_shared/context/AuthContext';
import { LinkText } from '../../Components/Text';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { renderErrorsToast } from '../../_shared/util/toast';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const { login, isLoginLoading, getLoginError } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const onUsernameChange = e => {
    setUsername(e);
  };

  const [password, setPassword] = useState('');
  const onPasswordChange = e => {
    setPassword(e);
  };

  const onLogin = () => {
    login({ username: username, password: password });
  };

  return (
    <BaseScreen errorToast={renderErrorsToast([getLoginError()])}>
      <View style={styles.screen}>
        <View>
          <BaseText h2 style={{ color: theme.colors.color1 }}>
            Pocketeer
          </BaseText>
          <BaseText h2>Your personal finance app</BaseText>
        </View>

        <View style={styles.imgContainer}>
          <Image style={styles.heroImg} source={loginHero} />
        </View>

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
        <LinkText h4 route={ROUTES.signup}>
          Sign up now
        </LinkText>

        <View style={styles.buttonContainer}>
          <BaseButton
            title="Login"
            size="lg"
            width={200}
            onPress={onLogin}
            loading={isLoginLoading}
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
    imgContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    heroImg: {
      width: screenWidth * 0.8,
      height: screenWidth * 0.6,
    },
    passwordInput: {
      marginBottom: 5,
    },
    buttonContainer: {
      marginTop: 30,
    },
  });
};

export default LoginScreen;
