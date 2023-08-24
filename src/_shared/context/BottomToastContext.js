import { createContext, useState } from 'react';

export const ToastTypeInfo = 1;
export const ToastTypeCustom = 2;

const BottomToastContext = createContext();
const BottomToastProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    toastType: 1,
    title: '',
    text: '',
    customChildren: null,
  });

  const info = (text = '', title = '') => {
    setToastInfo({
      toastType: ToastTypeInfo,
      title: title,
      text: text,
    });
    setIsVisible(true);
  };

  const custom = (childrenComponent = null) => {
    setToastInfo({
      toastType: ToastTypeCustom,
      customChildren: childrenComponent,
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
          custom,
        },
      }}>
      {children}
    </BottomToastContext.Provider>
  );
};

export { BottomToastProvider, BottomToastContext };
