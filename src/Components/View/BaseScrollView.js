import { ScrollView, Pressable } from 'react-native';

const BaseScrollView = ({ children, showsVerticalScrollIndicator }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
      <Pressable>{children}</Pressable>
    </ScrollView>
  );
};

export default BaseScrollView;
