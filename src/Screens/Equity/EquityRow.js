import { useState } from 'react';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { AmountText, BaseText } from '../../Components';
import Collapsible from 'react-native-collapsible';

const EquityRow = ({ navigation, data }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  const getExpandedTextColor = () => {
    if (expanded) {
      return { color: theme.colors.primary };
    }

    return {};
  };

  const renderBreakdown = breakdown => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          breakdown.redirect !== undefined &&
          navigation.navigate(breakdown.redirect)
        }>
        <View style={styles.breakdown}>
          <BaseText h4 style={{ color: theme.colors.color4 }}>
            {breakdown.name}
          </BaseText>
          <View style={styles.breakdownInfo}>
            <AmountText h4 style={styles.breakdownInfoText}>
              {breakdown.amount}
            </AmountText>

            {breakdown.redirect !== undefined ? (
              <Icon
                name="chevron-right"
                type="entypo"
                color={theme.colors.color5}
              />
            ) : (
              <></>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.row}>
          <View style={styles.rowTitle}>
            <BaseText
              h2
              style={{
                color: theme.colors.color4,
                ...getExpandedTextColor(),
              }}>
              {data.title}
            </BaseText>
            {expanded ? (
              <Icon
                name="chevron-up"
                type="entypo"
                color={theme.colors.color1}
              />
            ) : (
              <Icon
                name="chevron-down"
                type="entypo"
                color={theme.colors.color5}
              />
            )}
          </View>

          <View style={styles.rowInfo}>
            <AmountText
              h1
              style={{ color: theme.colors.color4, ...getExpandedTextColor() }}>
              {data.amount}
            </AmountText>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {data.breakdown.map(breakdown => {
        return (
          <Collapsible key={breakdown.name} collapsed={!expanded}>
            {renderBreakdown(breakdown)}
          </Collapsible>
        );
      })}
    </>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    row: {
      paddingVertical: theme.spacing.xl,
      ...theme.borderBottom,
    },
    rowTitle: {
      marginBottom: theme.spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowInfo: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    breakdown: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.lg,
      paddingLeft: 40,
      justifyContent: 'space-between',
      ...theme.borderBottom,
    },
    breakdownInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    breakdownInfoText: {
      marginRight: theme.spacing.lg,
    },
  });
};

export default EquityRow;
