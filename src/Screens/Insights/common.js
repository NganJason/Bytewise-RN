import { useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  AmountText,
  BaseGrid,
  BaseText,
  Dot,
  IconButton,
  LineChartWithGranularity,
} from '../../Components';
import { BaseChip } from '../../Components/View';
import { METRICS } from '../../_shared/apis/enum';
import { metricMessage } from '../../_shared/constant/message';
import { BottomToastContext } from '../../_shared/context';
import { useDimension, useError } from '../../_shared/hooks';
import { Amount } from '../../_shared/object';
import {
  getFormattedYearMonth,
  isMetricHealthy,
  parseDateStringWithoutDelim,
} from '../../_shared/util';

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
        <BaseText
          text2
          color={theme.colors.color6}
          numberOfLines={1}
          adjustsFontSizeToFit>
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

const threeM = '3M';
const sixM = '6M';
const oneY = '1Y';
const granularities = [
  { name: threeM, val: 3 },
  { name: sixM, val: 6 },
  { name: oneY, val: 12 },
];

export const Graph = ({
  height = 0,
  setDisableScroll = function () {},
  useGraph = function (granularities, granularityIdx) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [onDrag, setOnDrag] = useState(false);
  const {
    changeGranularity,
    granularityIdx,
    getSummaryData,
    getCurrDataPoint,
    setCurrDataPoint,
    resetCurrDataPoint,
    getChange,
    getErrors,
    isLoading,
  } = useGraph(granularities, 1);
  const { sum = 0, currency = '', date = '' } = getCurrDataPoint();
  const [absChange = 0, percent = null] = getChange();

  const renderSubtitle = () => {
    if (onDrag) {
      return (
        <View style={styles.subtitle}>
          <BaseText text5 color={theme.colors.color7}>
            {getFormattedYearMonth(parseDateStringWithoutDelim(date))}
          </BaseText>
        </View>
      );
    }

    return renderPercentChange();
  };

  const renderPercentChange = () => {
    let color;
    let text;

    if (percent === null) {
      text = '';
    } else {
      let val = Number(percent).toFixed(2);
      text = `(${val}%)`;
    }

    if (Number(absChange) === 0) {
      color = theme.colors.color7;
    } else if (Number(absChange) > 0) {
      color = theme.colors.color1;
    } else {
      color = theme.colors.regularRed;
    }

    return (
      <View style={styles.subtitle}>
        <AmountText
          text5
          color={color}
          amount={new Amount(absChange, currency)}
          showSign
        />
        <BaseText text5 color={color} margin={{ horizontal: 4 }}>
          {text}
        </BaseText>
      </View>
    );
  };

  useError(getErrors());

  return (
    <View>
      <AmountText
        h1
        sensitive
        showNegativeOnly
        amount={new Amount(sum, currency)}
        margin={{ top: 10 }}
        color={theme.colors.color6}
      />

      <View>{renderSubtitle()}</View>

      <LineChartWithGranularity
        chartHeight={height}
        onTouchStart={() => {
          setOnDrag(true);
          setDisableScroll(true);
        }}
        onTouchEnd={() => {
          setOnDrag(false);
          setDisableScroll(false);
          setTimeout(() => {
            resetCurrDataPoint();
          }, 200);
        }}
        handleActiveData={e => {
          setCurrDataPoint(e);
        }}
        data={getSummaryData()}
        granularities={granularities}
        onGranularityChange={changeGranularity}
        granularityIdx={granularityIdx}
        isDataLoading={isLoading}
        showMinMax
      />
    </View>
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
    subtitle: {
      flexDirection: 'row',
      marginVertical: 5,
    },
  });
