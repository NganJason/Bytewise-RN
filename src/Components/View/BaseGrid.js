import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SimpleGrid } from 'react-native-super-grid';

const BaseGrid = ({
  items = [],
  colNum = 2,
  spacing = 20,
  renderItem = function (item) {},
  onItemPress = null,
  containerStyle = {},
}) => {
  const styles = getStyles();
  const [containerWidth, setContainerWidth] = useState(300);

  const onLayout = event => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const getItemWidth = () => {
    return (containerWidth - 2 * spacing) / colNum;
  };

  const renderContent = item => {
    if (onItemPress !== null) {
      return (
        <TouchableOpacity
          onPress={() => onItemPress(item)}
          containerStyle={styles.touchable}>
          {renderItem(item)}
        </TouchableOpacity>
      );
    }
    return renderItem(item);
  };

  return (
    <View onLayout={onLayout}>
      <SimpleGrid
        itemDimension={getItemWidth()}
        data={items}
        style={{ margin: -1 * spacing, ...containerStyle }}
        spacing={spacing}
        renderItem={({ item }) => {
          return renderContent(item);
        }}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    touchable: {
      flex: 1,
    },
  });

export default BaseGrid;
