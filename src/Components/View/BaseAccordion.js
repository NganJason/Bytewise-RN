import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, useTheme } from '@rneui/themed';

import { BaseText } from '../Text';
import BaseListItem from './BaseListItem';

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
      containerStyle={styles.accordionTitle}
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

const getStyles = _ =>
  StyleSheet.create({
    accordionTitle: {
      paddingHorizontal: 0,
    },
  });
