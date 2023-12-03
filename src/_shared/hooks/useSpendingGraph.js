import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetTransactionsSummary } from '../query/transaction';

const useSpendingGraph = (granularities = [], defaultGranularity = 0) => {
  const [granularityIdx, setGranularityIdx] = useState(defaultGranularity);
  const changeGranularity = idx => {
    setGranularityIdx(idx);
  };
  const [currSelectedIdx, setCurrSelectedIdx] = useState(0);

  const getTransactionsSummary = useGetTransactionsSummary({
    unit: 1,
    interval: granularities[granularityIdx].val,
  });
  const data = useMemo(
    () => getTransactionsSummary?.data?.savings || [],
    [getTransactionsSummary],
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
    return [useGetTransactionsSummary];
  };

  return {
    changeGranularity,
    granularityIdx,
    getSummaryData,
    getCurrDataPoint,
    setCurrDataPoint,
    resetCurrDataPoint,
    getErrors,
    isLoading: getTransactionsSummary.isLoading,
  };
};
export default useSpendingGraph;
