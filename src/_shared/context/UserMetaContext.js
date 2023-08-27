import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { UserError } from '../apis/user';

const USER_META = 'USER_META';
const UserMetaContext = createContext();

const UserMetaProvider = ({ children }) => {
  const [userMeta, setUserMeta] = useState({
    onboardingCompleted: true,
    showSetupSplashScreen: false,
  });

  const isUserOnboarded = () => {
    return userMeta.onboardingCompleted;
  };

  const setOnboardingStatus = status => {
    setUserMeta(prev => {
      let newMeta = { ...prev, onboardingCompleted: status };
      save(newMeta);
      return newMeta;
    });
  };

  const showSetupSplashScreen = () => {
    return userMeta.showSetupSplashScreen;
  };

  const setShowSetupSplashScreen = status => {
    setUserMeta(prev => ({ ...prev, showSetupSplashScreen: status }));
  };

  const save = async meta => {
    try {
      await AsyncStorage.setItem(USER_META, JSON.stringify(meta));
    } catch {
      throw new UserError('set user meta error');
    }
  };

  useEffect(() => {
    async function getMeta() {
      try {
        const metaStr = await AsyncStorage.getItem(USER_META);
        const meta = JSON.parse(metaStr);
        if (meta !== null) {
          setUserMeta({
            ...userMeta,
            onboardingCompleted: meta.onboardingCompleted,
          });
        }
      } catch {
        throw new UserError('get user meta error');
      }
    }
    getMeta();
  }, []);

  return (
    <UserMetaContext.Provider
      value={{
        isUserOnboarded,
        setOnboardingStatus,
        showSetupSplashScreen,
        setShowSetupSplashScreen,
      }}>
      {children}
    </UserMetaContext.Provider>
  );
};

export { UserMetaContext, UserMetaProvider };
