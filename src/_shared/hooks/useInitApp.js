import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useGetAccounts, useGetCategories, useGetCurrencies } from '../query';

const useInitApp = () => {
  const { isLogin } = useContext(AuthContext);
  useGetAccounts({}, { enabled: isLogin });
  useGetCategories({}, { enabled: isLogin });
  useGetCurrencies({}, { enabled: isLogin });

  return {};
};

export default useInitApp;
