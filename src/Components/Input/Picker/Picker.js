import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker as Pic } from '@react-native-picker/picker';

const Picker = ({ pickers = [] }) => {
  return (
    <View style={styles.container}>
      {pickers.map((picker, idx) => {
        const { items, selectedValue, onChange } = picker;

        return (
          <Pic
            key={idx}
            style={styles.picker}
            selectedValue={selectedValue}
            onValueChange={itemValue => onChange(itemValue)}>
            {items.map((item, i) => {
              const { label, value } = item;
              return <Pic.Item key={i} label={label} value={value} />;
            })}
          </Pic>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
  },
});

export default Picker;
