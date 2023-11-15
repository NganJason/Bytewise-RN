import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { AmountText, BaseGrid, BaseText } from '../../Components';
import { BottomToastContext } from '../../_shared/context';
import { Amount } from '../../_shared/object';
import { capitalize } from '../../_shared/util';

export const Title = ({ children }) => {
  const { theme } = useTheme();
  return (
    <BaseText text2 margin={{ top: 12, bottom: 8 }} color={theme.colors.color6}>
      {children}
    </BaseText>
  );
};

export const Metrics = ({ items = [] }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { toast } = useContext(BottomToastContext);

  const renderMetric = ({ name = '', val = '', desc = '' }) => {
    return (
      <View style={styles.metric}>
        <BaseText text2 color={theme.colors.color6}>
          {val}
        </BaseText>
        <View style={styles.metricName}>
          <BaseText text6 center color={theme.colors.color8}>
            {name}
          </BaseText>
        </View>
      </View>
    );
  };

  return (
    <BaseGrid
      items={items}
      colNum={3}
      onItemPress={item => toast.info(item.desc, capitalize(item.name))}
      renderItem={item => renderMetric(item)}
    />
  );
};

export const Aggr = ({ items = [{ title: '', amount: new Amount() }] }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const parseItems = () => {
    return items.map((d, idx) => ({ ...d, idx: idx }));
  };

  const isItemMid = (idx = 0) => {
    const isOdd = items.length % 2 !== 0;
    if (!isOdd) {
      return false;
    }
    return Math.ceil(items.length / 2) === idx + 1;
  };

  const renderAggr = ({ title = '', amount = new Amount(), idx = 0 }) => {
    if (title === '') {
      return;
    }

    return (
      <View style={styles.aggr}>
        <AmountText
          h4={isItemMid(idx)}
          h5={!isItemMid(idx)}
          sensitive
          amount={amount}
          decimal={0}
          showNegativeOnly
          style={{ fontFamily: theme.fontFamily.semiBold }}
        />
        <BaseText text6 color={theme.colors.color8}>
          {title}
        </BaseText>
      </View>
    );
  };

  return (
    <View style={styles.aggrContainer}>
      <BaseGrid
        items={parseItems()}
        spacing={4}
        colNum={3}
        renderItem={item => renderAggr(item)}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    aggrContainer: {
      marginTop: 4,
      marginBottom: 6,
    },
    aggr: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    metric: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    metricName: {
      width: 80,
    },
  });
