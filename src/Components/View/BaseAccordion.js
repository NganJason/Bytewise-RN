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
            <BaseText h4>{title}</BaseText>
          </ListItem.Content>
        </>
      }>
      {items.map((item, i) => (
        <ListItem key={i}>
          <ListItem.Content>{item}</ListItem.Content>
        </ListItem>
      ))}
    </ListItem.Accordion>
  );
};

export default BaseAccordion;
