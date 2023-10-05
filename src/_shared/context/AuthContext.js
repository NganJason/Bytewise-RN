import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLogin, useSignup } from '../mutations';
import { UserError } from '../apis/user';
import {
  isAxiosTokenSet,
  setAxiosAccessToken,
  setAxiosResponseInterceptors,
  unsetAxiosAccessToken,
} from '../apis/http';
import { useVerifyEmail } from '../mutations/user';
import { UserMetaContext } from './UserMetaContext';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const verifyEmailMutation = useVerifyEmail();
  const { clearUserMeta, setIsUserLogin, updateUserMeta } =
    useContext(UserMetaContext);

  const { isLoading: isLoginLoading } = loginMutation;
  const { isLoading: isSignupLoading } = signupMutation;
  const { isLoading: isVerifyEmailLoading } = verifyEmailMutation;

  const [isLogin, setIsLogin] = useState(isAxiosTokenSet());
  useEffect(() => {
    setIsUserLogin(isLogin);
  }, [isLogin]);

  const login = ({ email = '', password = '' }) => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: async resp => {
          try {
            await AsyncStorage.setItem(ACCESS_TOKEN, resp.access_token);
            onLoginSuccess(resp.access_token);
            updateUserMeta(resp?.user || {});
          } catch {
            throw new UserError('set access token error');
          }
        },
      },
    );
  };

  const signup = (
    { email = '', password = '' },
    onSuccess = function () {},
  ) => {
    signupMutation.mutate(
      { email, password },
      {
        onSuccess: resp => {
          onSuccess(resp);
        },
      },
    );
  };

  const verifyEmail = ({ email = '', code = '' }) => {
    verifyEmailMutation.mutate(
      { email, code },
      {
        onSuccess: async resp => {
          try {
            await AsyncStorage.setItem(ACCESS_TOKEN, resp.access_token);
            updateUserMeta(resp?.user || {});
            onLoginSuccess(resp.access_token);
          } catch {
            throw new UserError('set access token error');
          }
        },
      },
    );
  };

  const logout = async () => {
    unsetAxiosAccessToken();
    clearUserMeta();
    // ignore error
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    setIsLogin(false);
  };

  useEffect(() => {
    async function getToken() {
      try {
        const at = await AsyncStorage.getItem(ACCESS_TOKEN);
        if (at !== null) {
          onLoginSuccess(at);
        }
      } catch {
        throw new UserError('get access token error');
      }
    }

    getToken();

    setAxiosResponseInterceptors({ on401: logout });
  }, []);

  const onLoginSuccess = (accessToken = '') => {
    setAxiosAccessToken(accessToken);
    setIsLogin(true);
  };

  const getLoginError = () => {
    return {
      isError: loginMutation.isError,
      error: loginMutation.error,
      reset: loginMutation.reset,
    };
  };

  const getSignupError = () => {
    return {
      isError: signupMutation.isError,
      error: signupMutation.error,
      reset: signupMutation.reset,
    };
  };

  const getVerifyEmailError = () => {
    return {
      isError: verifyEmailMutation.isError,
      error: verifyEmailMutation.error,
      reset: verifyEmailMutation.reset,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLogin,
        isLoginLoading,
        getLoginError,
        signup,
        isSignupLoading,
        getSignupError,
        verifyEmail,
        isVerifyEmailLoading,
        getVerifyEmailError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
