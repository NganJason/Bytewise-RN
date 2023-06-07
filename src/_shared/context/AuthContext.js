import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLogin, useSignup } from '../mutations/user';
import { UserError } from '../apis/user';

const ACCESS_TOKEN = 'ACCESS_TOKEN';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const { isLoading: isLoginLoading } = loginMutation;
  const { isLoading: isSignupLoading } = signupMutation;

  const [isLogin, setIsLogin] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    async function getToken() {
      try {
        const at = await AsyncStorage.getItem(ACCESS_TOKEN);
        if (at !== null) {
          setAccessToken(at);
          setIsLogin(true);
        }
      } catch {
        throw new UserError('get access token error');
      }
    }

    getToken();
  }, []);

  const login = ({ username = '', password = '' }) => {
    // no-op if already logged in
    if (isLogin) {
      return;
    }

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: async data => {
          try {
            await AsyncStorage.setItem(ACCESS_TOKEN, data.access_token);
            setIsLogin(true);
            setAccessToken(data.access_token);
          } catch {
            throw new UserError('set access token error');
          }
        },
      },
    );
  };

  const logout = async () => {
    setIsLogin(false);
    // ignore error
    await AsyncStorage.removeItem(ACCESS_TOKEN);
  };

  const signup = ({ username = '', password = '' }) => {
    signupMutation.mutateAsync(
      { username, password: password },
      {
        onSuccess: () => {
          setIsLogin(true);
        },
      },
    );
  };

  const handleUnauthenticate = async () => {
    await logout();
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
        accessToken,
        handleUnauthenticate,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
