import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import FlexRow from '../View/FlexRow';
import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';

const AggrSummary = ({ aggrs = [] }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderAggrs = () => {
    const comps = [];

    aggrs.forEach(aggr => {
      comps.push(
        <>
          <BaseText h4 center style={styles.label}>
            {aggr.label}:
          </BaseText>
          <AmountText h4 showColor showSymbol>
            {aggr.amount}
          </AmountText>
        </>,
      );
    });

    return comps;
  };

  return (
    <FlexRow
      itemPositions={[
        {
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      rowStyle={styles.textGroupWrapper}
      showDivider
      items={renderAggrs()}
    />
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    textGroupWrapper: {
      marginBottom: 16,
    },
    label: {
      marginBottom: 4,
    },
  });
};

export default AggrSummary;
