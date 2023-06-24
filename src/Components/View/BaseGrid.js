import { StyleSheet } from 'react-native';
import { SimpleGrid } from 'react-native-super-grid';

const BaseGrid = ({
  items = [],
  itemDimension = 120,
  spacing = 20,
  renderItem = function (item) {},
  containerStyle = {},
}) => {
  const styles = getStyles();

  return (
    <SimpleGrid
      itemDimension={itemDimension}
      data={items}
      style={{ ...styles.gridView, margin: -1 * spacing, ...containerStyle }}
      spacing={spacing}
      renderItem={({ item }) => {
        return renderItem(item);
      }}
    />
  );
};

const getStyles = () =>
  StyleSheet.create({
    gridView: {
      flex: 1,
    },
  });

export default BaseGrid;
