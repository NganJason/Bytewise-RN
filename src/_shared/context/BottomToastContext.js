import { createContext, useState } from 'react';

export const ToastTypeInfo = 1;

const BottomToastContext = createContext();
const BottomToastProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    toastType: 1,
    text: '',
  });

  const info = (text = '') => {
    setToastInfo({
      toastType: ToastTypeInfo,
      text: text,
    });
    setIsVisible(true);
  };

  const close = () => {
    setIsVisible(false);
  };

  return (
    <BottomToastContext.Provider
      value={{
        isVisible,
        close,
        toastInfo,
        toast: {
          info,
        },
      }}>
      {children}
    </BottomToastContext.Provider>
  );
};

export { BottomToastProvider, BottomToastContext };
