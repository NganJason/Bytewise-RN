import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem, useTheme } from '@rneui/themed';

import BaseDivider from './BaseDivider';
import { BaseText } from '../Text';

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
        <React.Fragment key={i}>
          <ListItem containerStyle={styles.container}>
            <ListItem.Content>{item}</ListItem.Content>
          </ListItem>
          {i < items.length - 1 && showDivider && (
            <View style={styles.container}>
              <BaseDivider orientation="vertical" margin={10} />
            </View>
          )}
        </React.Fragment>
      ))}
    </ListItem.Accordion>
  );
};

export default BaseAccordion;

const getStyles = _ =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 10,
    },
  });
