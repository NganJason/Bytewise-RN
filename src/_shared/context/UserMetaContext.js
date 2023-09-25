import { useQueryClient } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';
import { useUpdateUserMeta } from '../mutations';
import { queryKeys, useGetUser } from '../query';
import { checkIsUserOnboarded } from '../util/user';

// const USER_META = 'USER_META';
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
    updateMetaMutation.mutate({
      hide_info: !shouldHideSensitiveInfo(),
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

  // const save = async meta => {
  //   try {
  //     await AsyncStorage.setItem(USER_META, JSON.stringify(meta));
  //   } catch {
  //     throw new UserError('set user meta error');
  //   }
  // };

  // useEffect(() => {
  //   async function getMeta() {
  //     try {
  //       const metaStr = await AsyncStorage.getItem(USER_META);
  //       const meta = JSON.parse(metaStr);
  //       if (meta !== null) {
  //         setUserMeta({
  //           ...userMeta,
  //           onboardingCompleted: meta.onboardingCompleted,
  //         });
  //       }
  //     } catch {
  //       throw new UserError('get user meta error');
  //     }
  //   }
  //   getMeta();
  // }, []);

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
