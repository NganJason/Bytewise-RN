import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import BaseHorizontalScrollView from './BaseHorizontalScrollView';
import BaseCard from './BaseCard';
import IconButton from '../Touch/IconButton';
import { useDimension } from '../../_shared/hooks';
import { BaseText } from '../Text';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BaseHoriScrollableItems = ({
  onAdd = function () {},
  onPress = function () {},
  items = [],
  renderItem = function (item) {},
  addItemMsg = 'Add',
}) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);

  const isItemsEmpty = () => {
    return items.length === 0;
  };

  const renderContent = () => {
    if (!isItemsEmpty()) {
      return items.map((d, idx) => (
        <View style={styles.card} key={idx}>
          <BaseCard
            width={screenWidth / 3.2}
            containerStyle={styles.cardContainer}
            onPress={function () {
              onPress(d);
            }}>
            {renderItem(d)}
          </BaseCard>
        </View>
      ));
    }
    return renderEmptyContent();
  };

  const renderEmptyContent = () => {
    return (
      <TouchableOpacity onPress={onAdd}>
        <View style={styles.emptyContent}>
          <Icon type="entypo" name="plus" color={theme.colors.color8} />
          <BaseText text5 color={theme.colors.color8}>
            {addItemMsg}
          </BaseText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.contentBody}>
      {!isItemsEmpty() && (
        <IconButton
          iconType="entypo"
          iconName="plus"
          iconSize={20}
          color={theme.colors.color8}
          containerStyle={styles.btnContainer}
          onPress={onAdd}
        />
      )}

      <BaseHorizontalScrollView>{renderContent()}</BaseHorizontalScrollView>
    </View>
  );
};

export default BaseHoriScrollableItems;

const getStyles = theme =>
  StyleSheet.create({
    contentBody: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnContainer: {
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginRight: 14,
      borderWidth: 1.5,
      borderRadius: 6,
      borderColor: theme.colors.color7,
      borderStyle: 'dotted',
    },
    card: {
      marginRight: 20,
    },
    cardContainer: {
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    emptyContent: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: 10,
      borderStyle: 'dotted',
      borderColor: theme.colors.color7,
    },
  });
