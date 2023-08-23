import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { UserError } from '../apis/user';

const USER_META = 'USER_META';
const UserMetaContext = createContext();

const UserMetaProvider = ({ children }) => {
  const [userMeta, setUserMeta] = useState({ onboardingCompleted: false });

  const isUserOnboarded = () => {
    return userMeta.onboardingCompleted;
  };

  const setOnboardingStatus = status => {
    let newMeta = { ...userMeta, onboardingCompleted: status };
    setUserMeta(newMeta);
    save(newMeta);
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
        const meta = await AsyncStorage.getItem(USER_META);
        if (meta !== null) {
          setUserMeta(JSON.parse(meta));
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
      }}>
      {children}
    </UserMetaContext.Provider>
  );
};

export { UserMetaContext, UserMetaProvider };
