import { useCallback, useEffect, useState } from 'react';

export function useData({ getData }) {
  const [dataTable, setDataTable] = useState();
  const [options, setOptions] = useState();
  const refreshData = useCallback(() => {
    if (options) {
      getData(options).then((data) => setDataTable(data));
    }
  }, [getData, setDataTable, options]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);
  return {
    refreshData, setOptions, dataTable,
  };
}

export function useCustomButton({ action, checked, refreshData }) {
  const onClick = async (arg) => {
    const result = await action(checked, arg);
    refreshData();
    return result;
  };

  return { onClick };
}
