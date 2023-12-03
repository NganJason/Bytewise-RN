import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetAccountsSummary } from '../query';

const useNetWorthGraph = (granularities = [], defaultGranularity = 0) => {
  const [granularityIdx, setGranularityIdx] = useState(defaultGranularity);
  const changeGranularity = idx => {
    setGranularityIdx(idx);
  };
  const [currSelectedIdx, setCurrSelectedIdx] = useState(0);

  const getAccountsSummary = useGetAccountsSummary({
    unit: 1,
    interval: granularities[granularityIdx].val,
  });
  const data = useMemo(
    () => getAccountsSummary?.data?.net_worth || [],
    [getAccountsSummary],
  );

  useEffect(() => {
    resetCurrDataPoint();
  }, [resetCurrDataPoint, data]);

  const setCurrDataPoint = e => {
    setCurrSelectedIdx(e?.index || 0);
  };

  const resetCurrDataPoint = useCallback(() => {
    setCurrSelectedIdx(data.length - 1);
  }, [data]);

  const getCurrDataPoint = () => {
    return data[currSelectedIdx] || {};
  };

  const getSummaryData = () => {
    return data.map((d, idx) => ({ ...d, value: d.sum, index: idx }));
  };

  const getErrors = () => {
    return [getAccountsSummary];
  };

  return {
    changeGranularity,
    granularityIdx,
    getSummaryData,
    getCurrDataPoint,
    setCurrDataPoint,
    resetCurrDataPoint,
    getErrors,
    isLoading: getAccountsSummary.isLoading,
  };
};
export default useNetWorthGraph;
