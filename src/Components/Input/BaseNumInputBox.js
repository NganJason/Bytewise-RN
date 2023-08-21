import { useTheme } from '@rneui/themed';
import { createRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

const BaseNumInputBox = ({
  numDigit = 4,
  onChange = function () {},
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [input, setInput] = useState(
    Array(numDigit)
      .fill()
      .map(() => ''),
  );

  const inputRefs = Array(numDigit)
    .fill()
    .map(() => createRef(null));

  const handleInputChange = (text, index) => {
    if (text.length === 1 && index < numDigit - 1) {
      inputRefs[index + 1].current.focus();
    } else if (text.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    }

    const newInput = [...input];
    newInput[index] = text;
    setInput(newInput);
    onChange(newInput.join(''));
  };

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
            onChangeText={text => handleInputChange(text, index)}
            keyboardType="number-pad"
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
      width: 50,
      height: 50,
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
