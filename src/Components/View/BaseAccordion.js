import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, useTheme } from '@rneui/themed';

import BaseListItem from './BaseListItem';
import BaseText from '../Text/BaseText';

const BaseAccordion = ({
  title = '',
  isExpanded = true,
  onPress = function () {},
  items = [],
  showDivider = true,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <ListItem.Accordion
      containerStyle={styles.container}
      leftRotate
      isExpanded={isExpanded}
      onPress={onPress}
      content={
        <ListItem.Content>
          {typeof title === 'string' ? <BaseText>{title}</BaseText> : title}
        </ListItem.Content>
      }>
      {items.map((item, i) => (
        <BaseListItem key={i} showDivider={showDivider}>
          {item}
        </BaseListItem>
      ))}
    </ListItem.Accordion>
  );
};

export default BaseAccordion;

const getStyles = _ => StyleSheet.create({});
