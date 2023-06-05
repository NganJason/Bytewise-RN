import React, { createContext, useState } from 'react';
import { useLogin, useSignup } from '../mutations/user';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const loginMutation = useLogin();
  const { isLoading: isLoginLoading } = loginMutation;
  const [isLogin, setIsLogin] = useState(false);

  const signupMutation = useSignup();
  const { isLoading: isSignupLoading } = signupMutation;

  const login = async ({ email = '', password = '' }) => {
    loginMutation.mutateAsync(
      { email: email, password: password },
      {
        onSuccess: () => {
          setIsLogin(true);
        },
      },
    );
  };

  const logout = () => {
    setIsLogin(false);
  };

  const signup = async ({ email = '', password = '' }) => {
    signupMutation.mutateAsync(
      { email: email, password: password },
      {
        onSuccess: () => {
          setIsLogin(true);
        },
      },
    );
  };

  const handleUnauthenticate = () => {
    logout();
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
        handleUnauthenticate,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
