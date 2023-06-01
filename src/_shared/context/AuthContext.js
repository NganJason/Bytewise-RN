import React, { createContext, useContext, useEffect } from 'react';
import { useLogin, useSignup } from '../mutations/user';
import { UserContext } from './UserContext';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const loginMutation = useLogin();
  const { data: user, isLoading: isLoginLoading } = loginMutation;
  const isLogin = !!user;

  const signupMutation = useSignup();
  const { isLoading: isSignupLoading } = signupMutation;

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
