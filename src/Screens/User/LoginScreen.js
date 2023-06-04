import { useContext, useState } from 'react';
import { Divider, Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import { LinkText } from '../../Components/Text';
import {
  BaseButton,
  BaseInput,
  BaseScreen,
  BaseText,
  BaseImage,
} from '../../Components';

import { loginHero } from '../../_shared/constant/asset';
import { AuthContext } from '../../_shared/context/AuthContext';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { renderErrorsToast } from '../../_shared/util/toast';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
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
          <BaseText
            h1
            style={{ color: theme.colors.color1, ...styles.titleSpacing }}>
            Pocketeer
          </BaseText>
          <BaseText h3 style={styles.titleSpacing}>
            A personal financial companion
          </BaseText>
          <BaseImage
            width={screenWidth * 0.8}
            height={screenWidth * 0.6}
            source={loginHero}
            containerStyle={styles.img}
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
            title="Login"
            size="lg"
            width={200}
            onPress={onLogin}
            loading={isLoginLoading}
          />
          <Divider style={styles.divider} />
          <View style={styles.signUpCtaContainer}>
            <BaseText>Not a user? </BaseText>
            <LinkText h4 route={ROUTES.signup}>
              Sign up now
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
      marginBottom: 10,
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

export default LoginScreen;
