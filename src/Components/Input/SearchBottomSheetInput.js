import React from 'react';
import { BottomSheet, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDimension } from '../../_shared/hooks';

import { debounce } from '../../_shared/util';
import BaseSearchBar from './BaseSearchBar';
import TouchInput from './TouchInput';
import { BaseScrollView } from '../View';
import { EmptyContent } from '../Common';
import { EmptyContentConfig } from '../../_shared/constant/constant';

const SearchBottomSheetInput = ({
  label = '',
  itemLabel = '',
  onChangeText = function () {},
  useQuery = function () {},
  processResp = function (resp) {},
  renderItem = function (item, onPress) {},
  ...props
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

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

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debouncedSearch = debounce(e => {
    setDebouncedSearchTerm(e);
  }, 0.5);

  const onSearchTermChange = e => {
    setSearchTerm(e);
    if (e !== '') {
      debouncedSearch(e);
    }
  };

  const { data = {}, isLoading = false } = useQuery(
    { keyword: debouncedSearchTerm },
    {
      enabled: debouncedSearchTerm !== '',
      staleTime: 60 * 60 * 1000, // 24 hour (in ms)
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours (in ms)
    },
  );

  const onCancel = () => {
    toggleModal();
  };

  const renderRows = () => {
    let rows = [];
    let items = processResp(data) || [];

    items.map((d, idx) => {
      const onPress = () => {
        onItemPress(d);
      };

      rows.push(
        <React.Fragment key={idx}>{renderItem(d, onPress)}</React.Fragment>,
      );
    });

    if (rows.length === 0 && !isLoading) {
      return (
        <EmptyContent
          item={
            debouncedSearchTerm === ''
              ? EmptyContentConfig.emptySearchText
              : EmptyContentConfig.noSearchDataFound
          }
        />
      );
    }

    return rows;
  };

  return (
    <>
      <TouchInput
        label={label}
        value={inputVal}
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
          <BaseSearchBar
            autoFocus
            value={searchTerm}
            onChangeText={onSearchTermChange}
            isLoading={isLoading}
            onCancel={onCancel}
          />
          <BaseScrollView
            style={styles.body}
            showsVerticalScrollIndicator={false}>
            {renderRows()}
          </BaseScrollView>
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
    body: {
      flex: 1,
      padding: 10,
    },
  });

export default SearchBottomSheetInput;
