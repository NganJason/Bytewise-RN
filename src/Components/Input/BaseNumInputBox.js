import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import React, { createRef, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

const BaseNumInputBox = ({
  numDigit = 4,
  onChange = function () {},
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [input, setInput] = useState([]);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setInput(
  //       Array(numDigit)
  //         .fill()
  //         .map(() => ''),
  //     );
  //   }, []),
  // );

  const inputRefs = Array(numDigit)
    .fill()
    .map(() => createRef(null));

  const handleInputChange = (text, index) => {
    const newInput = [...input];
    newInput[index] = text;

    if (text.length === 1 && index < numDigit - 1) {
      inputRefs[index + 1].current.focus();
      newInput[index + 1] = '';
    } else if (text.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    }

    setInput(newInput);
    onChange(newInput.join(''));
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && input[index] === '') {
      inputRefs[index - 1].current.focus();
      handleInputChange('', index - 1);
    }
  };

  useEffect(() => {
    if (input.length > 0) {
      for (let i = 0; i < numDigit; i++) {
        if (input[i] === '') {
          if (inputRefs[i].current !== null) {
            inputRefs[i].current.focus();
            return;
          }
        }
      }

      if (inputRefs[numDigit - 1].current !== null) {
        inputRefs[numDigit - 1].current.focus();
      }
    }
  }, [inputRefs]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={theme.colors.color1} />
      ) : (
        Array.from({ length: numDigit }, (_, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.input}
            value={input[index]}
            onChangeText={text => handleInputChange(text, index)}
            keyboardType="number-pad"
            onKeyPress={e => {
              handleKeyPress(e, index);
            }}
            maxLength={1}
            autoFocus={index === 0}
          />
        ))
      )}
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      width: 45,
      height: 45,
      marginHorizontal: 5,
      textAlign: 'center',
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.colors.color8,
      ...theme.fontStyles.text1,
    },
  });
};

export default BaseNumInputBox;
