import { StyleSheet } from 'react-native';
import { ListItem, useTheme } from '@rneui/themed';

import BaseDivider from './BaseDivider';

const BaseListItem = ({
  children,
  showDivider = false,
  dividerMargin = 10,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <>
      <ListItem containerStyle={styles.listItem}>
        <ListItem.Content>{children}</ListItem.Content>
      </ListItem>
      {showDivider && (
        <BaseDivider orientation="horizontal" margin={dividerMargin} />
      )}
    </>
  );
};

export default BaseListItem;

const getStyles = _ =>
  StyleSheet.create({
    listItem: {
      paddingHorizontal: 0,
    },
  });
