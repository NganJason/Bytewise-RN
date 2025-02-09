import { USER_FLAG_NEW_USER } from '../apis/enum';

export const checkIsUserOnboarded = (userFlag = 0) => {
  return (userFlag & USER_FLAG_NEW_USER) <= 0;
};
