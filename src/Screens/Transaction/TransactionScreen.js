import { useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme, Header, Icon, Button } from '@rneui/themed';

import BaseText from '../../Components/BaseText';
import { MONTHS } from '../../_shared/constant/constant';

const TODAY = new Date();

const TransactionScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [date, setDate] = useState(TODAY);

  const renderDate = useCallback(() => {
    const month = MONTHS[date.getMonth()];
    return `${month} ${date.getFullYear()}`;
  }, [date]);

  const moveMonth = diff => new Date(date.setMonth(date.getMonth() + diff));

  const addOneMonth = () => setDate(moveMonth(1));
  const subOneMonth = () => setDate(moveMonth(-1));

  return (
    <View style={styles.screen}>
      <Header
        centerComponent={
          <BaseText h3 style={styles.dateText}>
            {renderDate()}
          </BaseText>
        }
        rightComponent={
          <Button onPress={addOneMonth} type="clear">
            <Icon name="chevron-right" color={theme.colors.primary} />
          </Button>
        }
        leftComponent={
          <Button onPress={subOneMonth} type="clear">
            <Icon name="chevron-left" color={theme.colors.primary} />
          </Button>
        }
        containerStyle={styles.parentContainer}
        rightContainerStyle={styles.childContainer}
        leftContainerStyle={styles.childContainer}
        centerContainerStyle={styles.childContainer}
      />
      <View>
        <Text>Body</Text>
      </View>
    </View>
  );
};

export default TransactionScreen;

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      height: '100%',
    },
    parentContainer: {
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
    },
    childContainer: {
      justifyContent: 'center',
    },
    dateText: {
      color: theme.colors.primary,
      textAlign: 'center',
      width: '100%',
    },
  });
