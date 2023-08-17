import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLogin, useSignup } from '../mutations';
import { UserError } from '../apis/user';
import {
  setAxiosAccessToken,
  setAxiosResponseInterceptors,
  unsetAxiosAccessToken,
} from '../apis/http';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const { isLoading: isLoginLoading } = loginMutation;
  const { isLoading: isSignupLoading } = signupMutation;

  const [isLogin, setIsLogin] = useState(false);

  const login = ({ username = '', password = '' }) => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: async data => {
          try {
            await AsyncStorage.setItem(ACCESS_TOKEN, data.access_token);
            onLoginSuccess(data.access_token);
          } catch {
            throw new UserError('set access token error');
          }
        },
      },
    );
  };

  const signup = ({ username = '', password = '' }) => {
    signupMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          login({ username, password });
        },
      },
    );
  };

  const logout = async () => {
    unsetAxiosAccessToken();
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
