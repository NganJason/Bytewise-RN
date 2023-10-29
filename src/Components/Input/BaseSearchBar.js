import { SearchBar, useTheme } from '@rneui/themed';
import { Platform, StyleSheet } from 'react-native';

const BaseSearchBar = ({
  onChangeText = function () {},
  value = '',
  isLoading = false,
  autoFocus = false,
  onCancel = null,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const platform = Platform.OS;

  return (
    <SearchBar
      autoFocus={autoFocus}
      platform={platform}
      round={true}
      cancelButtonTitle={onCancel === null ? '' : 'Cancel'}
      onCancel={onCancel}
      inputContainerStyle={styles.inputContainer}
      cancelButtonProps={styles.cancelBtn}
      placeholder="Type here..."
      showLoading={isLoading}
      onChangeText={onChangeText}
      value={value}
      showCancel
    />
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    inputContainer: {
      height: 8,
      backgroundColor: theme.colors.color9,
    },
    cancelBtn: {
      color: theme.colors.color1,
    },
  });
};

export default BaseSearchBar;
