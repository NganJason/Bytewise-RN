import { Container, Row, Col } from 'react-native-flex-grid';
import React from 'react';

import BaseDivider from './BaseDivider';
import { useTheme } from '@rneui/themed';

const FlexRow = ({
  showDivider = true,
  bottomBorder = false,
  items = [],
  itemFlexDirection = 'column',
  itemAlign = 'center',
  itemJustify = 'center',
  rowStyle = {},
}) => {
  const { theme } = useTheme();

  const getBottomBorderStyle = () => {
    if (!bottomBorder) {
      return {};
    }

    return theme.borderBottom;
  };

  return (
    <Container>
      <Row
        style={{
          ...getBottomBorderStyle(),
          ...rowStyle,
        }}>
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

export default React.memo(FlexRow);
