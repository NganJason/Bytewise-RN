import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useGetCategories } from '../query';
import { useGetAccounts } from '../query/account';

const useInitApp = () => {
  const { isLogin } = useContext(AuthContext);
  useGetAccounts({}, { enabled: isLogin });
  useGetCategories({}, { enabled: isLogin });

  return {};
};

export default useInitApp;
