import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BaseGrid = ({
  items = [],
  colNum = 2,
  spacingPercentage = 2,
  renderItem = function (item) {},
  onItemPress = null,
  containerStyle = {},
}) => {
  const styles = getStyles();

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

  const getItemWidth = () => {
    let buffer = 0.5;
    let spacing = 2 * spacingPercentage * colNum + buffer;
    return (100 - spacing) / colNum + '%';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {items.map((item, idx) => (
        <View
          style={{ width: getItemWidth(), margin: spacingPercentage + '%' }}
          key={idx}>
          {renderContent(item)}
        </View>
      ))}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    touchable: {
      flex: 1,
    },
    container: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

export default BaseGrid;
