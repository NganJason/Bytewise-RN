import { ListItem } from '@rneui/themed';

import BaseText from '../Text/BaseText';

const BaseAccordion = ({
  title = '',
  isExpanded = true,
  onPress = function () {},
  items = [],
}) => {
  return (
    <ListItem.Accordion
      leftRotate
      isExpanded={isExpanded}
      onPress={onPress}
      content={
        <>
          <ListItem.Content>
            <BaseText>{title}</BaseText>
          </ListItem.Content>
        </>
      }>
      {items.map((item, i) => (
        <ListItem>
          <ListItem.Content>{item}</ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ListItem.Accordion>
  );
};

export default BaseAccordion;
