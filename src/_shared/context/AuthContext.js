import React, { createContext, useContext, useEffect } from 'react';
import { useLogin, useSignup, useVerifyAuth } from '../mutations/user';
import { UserContext } from './UserContext';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const loginMutation = useLogin();
  const { data: user, isLoading: isLoginLoading } = loginMutation;
  const isLogin = !!user;

  const signupMutation = useSignup();
  const { isLoading: isSignupLoading } = signupMutation;

  const verifyAuthMutation = useVerifyAuth();

  const { updateUser } = useContext(UserContext);
  useEffect(() => {
    updateUser(user);
  }, [updateUser, user]);

  const login = async ({ email = '', password = '' }) => {
    loginMutation.mutateAsync({ email: email, password: password });
  };

  const logout = () => {
    loginMutation.reset();
  };

  const signup = async ({ email = '', password = '' }) => {
    signupMutation.mutateAsync(
      { email: email, password: password },
      {
        onSuccess: signupUser => {
          loginMutation.mutate(signupUser);
        },
      },
    );
  };

  const checkAuth = async () => {
    verifyAuthMutation.mutateAsync(
      {},
      {
        onError: () => {
          logout();
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

  const getCheckAuthError = () => {
    return {
      isError: verifyAuthMutation.isError,
      error: verifyAuthMutation.error,
      reset: verifyAuthMutation.reset,
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
        checkAuth,
        getCheckAuthError,
        handleUnauthenticate,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
