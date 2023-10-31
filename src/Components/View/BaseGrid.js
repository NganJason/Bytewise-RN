import { SimpleGrid } from 'react-native-super-grid';

const BaseGrid = ({
  items = [],
  itemDimension = 120,
  spacing = 20,
  renderItem = function (item) {},
  containerStyle = {},
}) => {
  return (
    <SimpleGrid
      itemDimension={itemDimension}
      data={items}
      style={{ margin: -1 * spacing, ...containerStyle }}
      spacing={spacing}
      renderItem={({ item }) => {
        return renderItem(item);
      }}
    />
  );
};

export default BaseGrid;
