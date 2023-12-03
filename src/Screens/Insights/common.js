import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BaseGrid, BaseText, Dot, IconButton } from '../../Components';
import { BaseChip } from '../../Components/View';
import { METRICS } from '../../_shared/apis/enum';
import { metricMessage } from '../../_shared/constant/message';
import { BottomToastContext } from '../../_shared/context';
import { useDimension } from '../../_shared/hooks';
import { isMetricHealthy } from '../../_shared/util';

export const Title = ({ children, customIcon = null, onPress = null }) => {
  const { theme } = useTheme();
  const styles = getStyles();

  const renderRightIcon = () => {
    if (onPress === null) {
      return;
    }

    if (customIcon === null) {
      return (
        <IconButton
          iconType="feather"
          iconName="chevron-right"
          type="clear"
          iconSize={18}
          color={theme.colors.color7}
          align="flex-end"
          onPress={onPress}
        />
      );
    }

    return <TouchableOpacity onPress={onPress}>{customIcon}</TouchableOpacity>;
  };
  return (
    <View style={styles.titleContainer}>
      <BaseText
        text2
        margin={{ top: 12, bottom: 8 }}
        color={theme.colors.color6}>
        {children}
      </BaseText>
      {renderRightIcon()}
    </View>
  );
};

export const Metrics = ({ items = [] }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { toast } = useContext(BottomToastContext);
  const { screenHeight } = useDimension();

  const renderMetric = item => {
    const { id = 0, value = '', unit = '%', status = 0 } = item;
    return (
      <View style={styles.metric}>
        <BaseText text2 color={theme.colors.color6}>
          {value + ' ' + unit}
        </BaseText>
        <View style={styles.metricName}>
          <Dot
            radius={6}
            marginRight={2}
            marginTop={4}
            color={
              isMetricHealthy(status)
                ? theme.colors.color1
                : theme.colors.brightRed
            }
          />
          <BaseText text6 center color={theme.colors.color8}>
            {METRICS[id]}
          </BaseText>
        </View>
      </View>
    );
  };

  const renderMetricDesc = item => {
    const { id = 0, threshold = '', status = 0 } = item;

    return (
      <View style={{ minHeight: screenHeight * 0.2 }}>
        <BaseText h3 margin={{ bottom: 10 }}>
          {METRICS[id]}
        </BaseText>
        <BaseChip type={isMetricHealthy(status) ? 'primary' : 'secondary'}>
          {isMetricHealthy(status) ? 'Healthy' : 'Unhealthy'}
        </BaseChip>
        <BaseText>{metricMessage[id](threshold)}</BaseText>
      </View>
    );
  };

  return (
    <BaseGrid
      items={items}
      colNum={3}
      onItemPress={item => toast.custom(renderMetricDesc(item))}
      renderItem={item => renderMetric(item)}
    />
  );
};

const getStyles = _ =>
  StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metric: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    metricName: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: 80,
    },
  });
