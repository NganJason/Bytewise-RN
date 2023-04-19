import React from 'react';
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme } from '@rneui/themed';

import BaseDivider from './BaseDivider';

const FlexRow = ({
  showDivider = true,
  bottomBorder = false,
  items = [],
  itemPositions = [
    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  ],
  rowStyle = {},
}) => {
  const { theme } = useTheme();

  const getBottomBorderStyle = () => {
    if (!bottomBorder) {
      return {};
    }

    return theme.borderBottom;
  };

  const getItemPositions = index => {
    if (itemPositions.length === 1) {
      return itemPositions[0];
    }
    if (itemPositions.length === items.length) {
      return itemPositions[index];
    }
    throw new Error(
      'itemPositions must have either one element or same length as items',
    );
  };

  return (
    <Container>
      <Row style={[getBottomBorderStyle(), rowStyle]}>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <Col style={getItemPositions(i)}>{item}</Col>
            {i < items.length - 1 && showDivider && (
              <BaseDivider orientation="vertical" />
            )}
          </React.Fragment>
        ))}
      </Row>
    </Container>
  );
};

export default React.memo(FlexRow);
