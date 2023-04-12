import { Container, Row, Col } from 'react-native-flex-grid';
import React from 'react';

import BaseDivider from './BaseDivider';

const FlexRow = ({
  showDivider = true,
  items = [],
  itemFlexDirection = 'column',
  itemAlign = 'center',
  itemJustify = 'center',
  rowStyle = {},
}) => {
  return (
    <Container>
      <Row style={rowStyle}>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <Col
              style={{
                alignItems: itemAlign,
                flexDirection: itemFlexDirection,
                justifyContent: itemJustify,
              }}>
              {item}
            </Col>
            {i < items.length - 1 && showDivider && (
              <BaseDivider orientation="vertical" />
            )}
          </React.Fragment>
        ))}
      </Row>
    </Container>
  );
};

export default FlexRow;
