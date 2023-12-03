import { View } from 'react-native';
import BaseGranularityTab from '../Chart/BaseGranularityTab';
import BaseLineChart from '../Chart/BaseLineChart';
import BaseLoadableViewV2 from '../View/BaseLoadableViewV2';

const LineChartWithGranularity = ({
  data = [],
  isDataLoading = false,
  onTouchStart = () => {},
  onTouchEnd = () => {},
  handleActiveData = () => {},
  chartHeight = 0,
  granularities = [],
  granularityIdx = 0,
  onGranularityChange = function (idx) {},
  ...props
}) => {
  return (
    <View style={{ height: chartHeight * 1.2 }}>
      <View style={{ height: chartHeight }}>
        <BaseLoadableViewV2 isLoading={isDataLoading}>
          <BaseLineChart
            data={data}
            chartHeight={chartHeight}
            handleActiveData={handleActiveData}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            {...props}
          />
        </BaseLoadableViewV2>
      </View>
      <View style={{ marginTop: chartHeight * 0.1 }}>
        <BaseGranularityTab
          items={granularities}
          activeIdx={granularityIdx}
          onPress={onGranularityChange}
        />
      </View>
    </View>
  );
};

export default LineChartWithGranularity;
