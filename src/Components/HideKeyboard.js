import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const HideKeyboard = ({ children, ...props }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} {...props}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default HideKeyboard;
