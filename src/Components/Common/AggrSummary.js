import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { Container, Row, Col } from 'react-native-flex-grid';

import BaseDivider from '../View/BaseDivider';
import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';

const AggrSummary = ({ aggrs = [] }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Container>
      <Row style={styles.aggrs}>
        {aggrs.map((aggr, i) => (
          <React.Fragment key={i}>
            <Col style={styles.aggr}>
              <BaseText text3 center style={styles.label}>
                {aggr.label}:
              </BaseText>
              <AmountText text5 sensitive={aggr.sensitive}>
                {aggr.amount}
              </AmountText>
            </Col>
            {i < aggrs.length - 1 && <BaseDivider orientation="vertical" />}
          </React.Fragment>
        ))}
      </Row>
    </Container>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    aggrs: {
      marginBottom: 0,
    },
    label: {
      marginBottom: 4,
    },
    aggr: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default AggrSummary;
