import React from 'react';
import { BottomSheet, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useDimension from '../../_shared/hooks/dimension';

import { debounce } from '../../_shared/util/common';
import BaseSearchBar from './BaseSearchBar';
import TouchInput from './TouchInput';

const SearchBottomSheetInput = ({
  label = '',
  itemLabel = '',
  onChangeText = function () {},
  query = {
    mutate: function () {},
    isLoading: false,
    reset: function () {},
  },
  data = [],
  renderItem = function (item, onPress) {},
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

  const debouncedSearch = debounce(query.mutate, 0.5);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const [inputVal, setInputVal] = useState('');
  const onItemPress = item => {
    setInputVal(item[itemLabel]);
    onChangeText(item[itemLabel]);
    toggleModal();
  };

  const [searchText, setSearchText] = useState('');
  const onSearchTextChange = e => {
    setSearchText(e);
    if (e !== '') {
      debouncedSearch({ keyword: e });
    }
  };

  const onCancel = () => {
    toggleModal();
    query.reset();
  };

  const renderRows = () => {
    let rows = [];
    data.map((d, idx) => {
      const onPress = () => {
        onItemPress(d);
      };

      rows.push(
        <React.Fragment key={idx}>{renderItem(d, onPress)}</React.Fragment>,
      );
    });

    return rows;
  };

  return (
    <>
      <TouchInput label={label} value={inputVal} onPress={toggleModal} />

      <BottomSheet
        fullScreen={true}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}>
        <View style={styles.container}>
          <BaseSearchBar
            autoFocus
            value={searchText}
            onChangeText={onSearchTextChange}
            isLoading={query.isLoading}
            onCancel={onCancel}
          />
          <View style={styles.body}>{renderRows()}</View>
        </View>
      </BottomSheet>
    </>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      height: screenHeight * 0.85,
      backgroundColor: theme.colors.white,
      borderRadius: 15,
      paddingTop: 28,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.md,
    },
    body: {
      flex: 1,
      padding: 10,
    },
  });

export default SearchBottomSheetInput;
