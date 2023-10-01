import { useQueryClient } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';
import { useUpdateUserMeta } from '../mutations';
import { queryKeys, useGetUser } from '../query';
import { checkIsUserOnboarded } from '../util/user';

const UserMetaContext = createContext();
const defaultMeta = {
  user: {
    email: '',
    meta: {
      currency: 'SGD',
      hide_info: false,
    },
    username: '',
  },
  appMeta: {
    showSetupSplashScreen: false,
  },
};

const UserMetaProvider = ({ children }) => {
  const [isLogin, setIsUserLogin] = useState(false);
  const [userMeta, setUserMeta] = useState(defaultMeta);

  const getUser = useGetUser({ enabled: isLogin });
  useEffect(() => {
    const { user = null } = getUser?.data || {};
    if (user === null) {
      return;
    }
    updateUserMeta(user);
  }, [getUser.data]);

  const updateUserMeta = user => {
    setUserMeta({
      ...userMeta,
      user: user,
    });
  };

  const queryClient = useQueryClient();
  const clearUserMeta = () => {
    setUserMeta(defaultMeta);
    queryClient.removeQueries(queryKeys.user);
  };

  const setShowSetupSplashScreen = status => {
    setUserMeta(prev => {
      return {
        ...prev,
        appMeta: { ...(prev?.appMeta || {}), showSetupSplashScreen: status },
      };
    });
  };

  const updateMetaMutation = useUpdateUserMeta();
  const toggleHideUserInfo = () => {
    let hideInfo = !shouldHideSensitiveInfo();
    setUserMeta(prev => {
      let newMeta = { ...prev };
      newMeta.user.meta.hide_info = hideInfo;

      return newMeta;
    });

    updateMetaMutation.mutate({
      hide_info: hideInfo,
    });
  };

  const isUserOnboarded = () => {
    const { user_flag: userFlag = 0 } = userMeta?.user || {};
    return checkIsUserOnboarded(userFlag);
  };

  const showSetupSplashScreen = () => {
    return userMeta?.appMeta?.showSetupSplashScreen || false;
  };

  const shouldHideSensitiveInfo = () => {
    return userMeta?.user?.meta?.hide_info || false;
  };

  const getUserBaseCurrency = () => {
    return userMeta?.user?.meta?.currency || 'SGD';
  };

  return (
    <UserMetaContext.Provider
      value={{
        setIsUserLogin,
        updateUserMeta,
        clearUserMeta,
        toggleHideUserInfo,
        isUserOnboarded,
        showSetupSplashScreen,
        setShowSetupSplashScreen,
        shouldHideSensitiveInfo,
        getUserBaseCurrency,
      }}>
      {children}
    </UserMetaContext.Provider>
  );
};

export { UserMetaContext, UserMetaProvider };
