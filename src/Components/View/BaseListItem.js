import { ListItem } from '@rneui/themed';

import BaseDivider from './BaseDivider';

const BaseListItem = ({
  children,
  showDivider = false,
  containerStyle = {},
  dividerMargin = 10,
}) => {
  return (
    <>
      <ListItem containerStyle={containerStyle}>
        <ListItem.Content>{children}</ListItem.Content>
      </ListItem>
      {showDivider && (
        <BaseDivider orientation="horizontal" margin={dividerMargin} />
      )}
    </>
  );
};

export default BaseListItem;
