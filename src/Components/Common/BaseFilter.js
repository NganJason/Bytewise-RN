import { BottomSheet, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDimension } from '../../_shared/hooks';
import BaseCheckbox from '../Input/BaseCheckbox';
import { BaseButton, IconButton } from '../Touch';
import { BaseScrollableTab, BaseScrollView } from '../View';

const BaseFilter = ({
  options = [
    {
      name: 'Default',
      iconName: 'filetext1',
      iconType: 'ant-design',
      items: [{ name: 'item1' }, { name: 'item2' }],
      emptyContentWithCallback: onPress => {},
    },
  ],
  selectedItems = {},
  onChange = function (selectedItems) {},
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    const isClosing = isModalVisible;
    setIsModalVisible(!isModalVisible);
    if (isClosing) {
      onChange(selected);
    }
  };

  const [selected, setSelected] = useState(selectedItems);

  const onSelect = item => {
    let newSelected = { ...selected };
    let activeTab = options[activeTabIdx];
    newSelected[activeTab.name] = [...(newSelected[activeTab.name] || [])];

    if (isSelected(item)) {
      newSelected[activeTab.name] = newSelected[activeTab.name].filter(
        val => val.name !== item.name,
      );
    } else {
      newSelected[activeTab.name].push(item);
    }

    setSelected(newSelected);
  };

  const isSelected = item => {
    let activeTab = options[activeTabIdx];
    if (!(activeTab.name in selected)) {
      return false;
    }
    return selected[activeTab.name].some(d => d.name === item.name);
  };

  const isFiltered = () => {
    for (const key of Object.keys(selected)) {
      if (selected[key].length > 0) {
        return true;
      }
    }
    return false;
  };

  const onReset = () => {
    let newSelected = { ...selected };
    for (const key of Object.keys(newSelected)) {
      newSelected[key] = [];
    }
    setSelected(newSelected);
  };

  const renderRows = () => {
    const rows = [];
    const activeTab = options[activeTabIdx];

    activeTab.items.map((d, idx) => {
      rows.push(
        <BaseCheckbox
          key={idx}
          title={d.name}
          value={d}
          onPress={onSelect}
          checked={isSelected(d)}
        />,
      );
    });

    if (rows.length === 0) {
      return activeTab.emptyContentWithCallback(toggleModal);
    }
    return rows;
  };

  return (
    <View>
      <IconButton
        iconType="feather"
        iconName="filter"
        type="clear"
        color={isFiltered() ? theme.colors.color1 : theme.colors.color7}
        iconSize={20}
        align="flex-end"
        onPress={toggleModal}
      />
      <BottomSheet
        fullScreen={true}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        close={toggleModal}>
        <View style={styles.container}>
          <View style={{ ...styles.header }}>
            <BaseButton
              title="Reset"
              type="clear"
              align="flex-end"
              size="md"
              onPress={onReset}
            />
            <BaseButton
              title="Done"
              type="clear"
              align="flex-end"
              size="md"
              onPress={toggleModal}
            />
          </View>
          <BaseScrollableTab
            tabs={options}
            activeTabIdx={activeTabIdx}
            onTabChange={setActiveTabIdx}
          />
          <BaseScrollView
            containerStyle={styles.rows}
            showsVerticalScrollIndicator={false}>
            {renderRows()}
          </BaseScrollView>
        </View>
      </BottomSheet>
    </View>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      minHeight: screenHeight * 0.5,
      maxHeight: screenHeight * 0.5,
      backgroundColor: theme.colors.white,
      borderRadius: 15,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    rows: {
      paddingTop: 16,
      paddingHorizontal: 10,
    },
  });

export default BaseFilter;
