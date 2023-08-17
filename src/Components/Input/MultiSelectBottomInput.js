import { BottomSheet, useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDimension } from '../../_shared/hooks';
import { BaseButton } from '../Touch';
import BaseCheckbox from './BaseCheckbox';
import TouchInput from './TouchInput';
import { capitalize } from '../../_shared/util';
import { BaseDivider } from '../View';

const MultiSelectBottomInput = ({
  label = '',
  items = [], // [{id: '', name: ''}]
  initialSelected = [],
  onChange = function () {},
  renderEmptyItems = function (toggleModal) {},
  ...props
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const isSelected = item => {
    return selected.some(obj => obj.id === item.id);
  };

  const isSelectAll = () => {
    if (items.length === 0) {
      return false;
    }

    return selected.length === items.length;
  };

  const onSelect = item => {
    if (isSelected(item)) {
      setSelected(selected.filter(val => val.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const onDone = () => {
    toggleModal();
  };

  const onSelectAll = () => {
    if (!isSelectAll()) {
      setSelected(items);
    } else {
      setSelected([]);
    }
  };

  const renderInput = () => {
    let allNames = [];
    selected.map(val => {
      allNames.push(capitalize(val.name));
    });

    return allNames.join(', ');
  };

  const renderRows = () => {
    let rows = [];

    items.map((item, idx) => {
      rows.push(
        <View key={idx} style={styles.row}>
          <BaseCheckbox
            title={capitalize(item.name)}
            value={item}
            onPress={onSelect}
            checked={isSelected(item)}
          />
          <BaseDivider />
        </View>,
      );
    });

    if (rows.length === 0) {
      return renderEmptyItems(toggleModal);
    }

    return rows;
  };

  return (
    <>
      <TouchInput
        label={label}
        value={renderInput()}
        onPress={toggleModal}
        {...props}
      />
      <BottomSheet
        fullScreen={true}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BaseButton
              title="Done"
              type="clear"
              align="flex-end"
              size="md"
              onPress={onDone}
            />
            <BaseButton
              title={isSelectAll() ? 'Deselect All' : 'Select All'}
              type="clear"
              align="flex-end"
              size="md"
              onPress={onSelectAll}
            />
          </View>
          <View style={styles.body}>{renderRows()}</View>
        </View>
      </BottomSheet>
    </>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      minHeight: screenHeight * 0.8,
      backgroundColor: theme.colors.white,
      borderRadius: 15,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    body: {
      flex: 1,
    },
    row: {
      marginVertical: theme.spacing.md,
    },
  });

export default MultiSelectBottomInput;
