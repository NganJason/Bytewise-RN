import React from 'react';
import { BottomSheet, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useDimension } from '../../_shared/hooks';
import { debounce } from 'lodash';

import BaseSearchBar from './BaseSearchBar';
import TouchInput from './TouchInput';
import { BaseScrollView } from '../View';
import { useQueryClient } from '@tanstack/react-query';
import { EmptyContent } from '../Common';
import { EmptyContentConfig } from '../../_shared/constant/constant';

const SearchBottomSheetInput = ({
  label = '',
  inputVal = '',
  placeholder = '',
  queryKey = '',
  useQuery = function () {},
  processResp = function (resp) {},
  onSelect = function (item) {},
  renderItem = function (item) {},
  disabled = false,
  ...props
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    if (disabled) {
      return;
    }
    setIsModalVisible(!isModalVisible);
  };

  const onItemPress = (searchTerm = '', item = null) => {
    onSelect({ searchTerm: searchTerm, item: item });
    toggleModal();
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debouncedSearch = debounce(e => {
    setDebouncedSearchTerm(e);
    if (queryKey !== '') {
      queryClient.cancelQueries(queryKey);
    }
  }, 0.5);

  const { data = {}, isLoading = false } = useQuery(
    { keyword: debouncedSearchTerm },
    {
      enabled: debouncedSearchTerm !== '',
      staleTime: 60 * 60 * 1000, // 24 hour (in ms)
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours (in ms)
    },
  );

  const onSearchTermChange = e => {
    setSearchTerm(e);
    if (e !== '') {
      debouncedSearch(e);
    }
  };

  const onCancel = () => {
    toggleModal();
  };

  const renderRows = () => {
    const rows = [];
    const items = processResp(data) || [];

    if (searchTerm === '') {
      return <EmptyContent item={EmptyContentConfig.emptySearchText} />;
    }

    items.map((d, idx) => {
      rows.push(
        <Pressable key={idx} onPress={() => onItemPress(searchTerm, d)}>
          {renderItem({ searchTerm: searchTerm, item: d })}
        </Pressable>,
      );
    });

    if (rows.length === 0 && !isLoading) {
      return (
        <Pressable onPress={() => onItemPress(searchTerm, null)}>
          {renderItem({ searchTerm: searchTerm, item: null })}
        </Pressable>
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
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />

      <BottomSheet
        fullScreen={true}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          keyboardShouldPersistTaps: 'always',
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
            {!isLoading && renderRows()}
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
