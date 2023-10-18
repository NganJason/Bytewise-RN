import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseButton } from '../Touch';

const DeleteSaveButton = ({
  onSave = function () {},
  isSaveLoading = false,
  onDelete = function () {},
  isDeleteLoading = false,
  allowDelete = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={[
        styles.btnContainer,
        allowDelete ? styles.spaceBetweenContainer : styles.centerContainer,
      ]}>
      {allowDelete && (
        <BaseButton
          title="Delete"
          size="lg"
          type="outline"
          width={'48%'}
          onPress={onDelete}
          loading={isDeleteLoading}
        />
      )}
      <BaseButton
        title="Save"
        size="lg"
        width={allowDelete ? '48%' : 200}
        onPress={onSave}
        loading={isSaveLoading}
      />
    </View>
  );
};

export default DeleteSaveButton;

const getStyles = _ =>
  StyleSheet.create({
    btnContainer: {
      flexDirection: 'row',
    },
    centerContainer: {
      justifyContent: 'center',
    },
    spaceBetweenContainer: {
      justifyContent: 'space-between',
    },
  });
