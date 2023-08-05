import { Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useKeyboard } from '../../_shared/hooks';

const BaseKeyboardAwareScrollView = ({ children, ...props }) => {
  const { keyboardHeight } = useKeyboard();

  return (
    <KeyboardAwareScrollView
      {...props}
      onTouchStart={e => {
        const touchY = e.nativeEvent.pageY;
        const swipeThreshold = 50 + keyboardHeight;
        if (keyboardHeight > 0 && touchY > swipeThreshold) {
          Keyboard.dismiss();
        }
      }}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default BaseKeyboardAwareScrollView;
