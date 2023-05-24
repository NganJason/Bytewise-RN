import { ScrollView, Pressable } from 'react-native';

const BaseScrollView = ({
  children,
  showsVerticalScrollIndicator,
  onScrollEndDrag,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      onScrollEndDrag={onScrollEndDrag}>
      <Pressable>{children}</Pressable>
    </ScrollView>
  );
};

export default BaseScrollView;
