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

export function useDataV2({ getData }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [pageCount, setPageCount] = useState(0);
  const [options, setOptions] = useState();
  const setOptionTable = useCallback((args) => {
    setOptions(args);
  }, []);
  const refreshDataWithOldOptions = useCallback(() => {
    if (options) {
      const {
        pageSize,
        pageIndex,
        sortBy,
        filters,
      } = options;
      setLoading(true);
      getData({
        paging: { page: pageIndex, size: pageSize }, sorting: sortBy, filters,
      }).then((info) => {
        setData(info.resultData);
        setPageCount(Math.ceil(info.dataLength / pageSize));
        setLoading(false);
      });
    }
  }, [options, getData]);

  useEffect(() => {
    refreshDataWithOldOptions();
  }, [refreshDataWithOldOptions]);

  return {
    setOptionTable,
    refreshDataWithOldOptions,
    pageCount,
    loading,
    data,
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
