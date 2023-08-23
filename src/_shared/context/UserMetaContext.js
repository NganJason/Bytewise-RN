import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { UserError } from '../apis/user';
import { useInitUser } from '../mutations/user';
import { checkIsUserNew } from '../util';
import { useGetUser } from '../query';

const USER_META = 'USER_META';
const UserMetaContext = createContext();

const UserMetaProvider = ({ children }) => {
  const [isUserNew, setIsUserNew] = useState(false);
  // const getUser = useGetUser();
  const initUser = useInitUser();

  // useEffect(() => {
  //   const { user = null } = getUser?.data || {};
  //   if (user !== null) {
  //     console.log(checkIsUserNew(user.user_flag));
  //     setIsUserNew(checkIsUserNew(user.user_flag));
  //   }
  // }, [getUser.data]);

  const markUserOnboarded = () => {
    initUser.mutate(
      {},
      {
        onSuccess: () => {
          setIsUserNew(false);
        },
      },
    );
  };

  return (
    <UserMetaContext.Provider
      value={{
        isUserNew,
        markUserOnboarded,
      }}>
      {children}
    </UserMetaContext.Provider>
  );
};

export { UserMetaContext, UserMetaProvider };
