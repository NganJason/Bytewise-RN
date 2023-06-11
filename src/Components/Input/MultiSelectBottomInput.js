import { BottomSheet, useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useDimension from '../../_shared/hooks/dimension';
import { BaseButton } from '../Touch';
import BaseCheckbox from './BaseCheckbox';
import TouchInput from './TouchInput';
import { capitalizeWords } from '../../_shared/util/string';
import { BaseDivider } from '../View';

const MultiSelectBottomInput = ({
  label = '',
  items = [], // [{id: '', name: ''}]
  initialSelected = [],
  onChange = function () {},
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
      allNames.push(capitalizeWords(val.name));
    });

    return allNames.join(', ');
  };

  const renderRows = () => {
    let rows = [];

    items.map((item, idx) => {
      rows.push(
        <View key={idx} style={styles.row}>
          <BaseCheckbox
            title={capitalizeWords(item.name)}
            value={item}
            onPress={onSelect}
            checked={isSelected(item)}
          />
          <BaseDivider />
        </View>,
      );
    });

    return rows;
  };

  return (
    <>
      <TouchInput label={label} value={renderInput()} onPress={toggleModal} />
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
              size="sm"
              onPress={onDone}
            />
            <BaseButton
              title={isSelectAll() ? 'Deselect All' : 'Select All'}
              type="clear"
              align="flex-end"
              size="sm"
              onPress={onSelectAll}
            />
          </View>
          <View>{renderRows()}</View>
        </View>
      </BottomSheet>
    </>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      minHeight: screenHeight * 0.8,
      backgroundColor: 'white',
      borderRadius: 15,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    row: {
      marginVertical: theme.spacing.md,
    },
  });

export default MultiSelectBottomInput;
