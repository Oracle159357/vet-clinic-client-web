import {
  useTable,
  usePagination,
  useAsyncDebounce,
  useSortBy,
  useFilters,
} from 'react-table';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { DefaultFilterForColumnString } from './Filter';
import './App.css';

export default function TableV2(
  {
    columns,
    data,
    fetchData,
    loading,
    pageCount: controlledPageCount,
  },
) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex, pageSize, sortBy, filters,
    },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: true,
      pageCount: controlledPageCount,
      manualFilters: true,
      manualSortBy: true,
      defaultColumn: { Filter: DefaultFilterForColumnString },
      // autoResetPage: false,
      // autoResetExpanded: false,
      // autoResetGroupBy: false,
      // autoResetSelectedRows: false,
      // autoResetSortBy: false,
      // autoResetFilters: false,
      // autoResetRowState: false,
    },
    useFilters,
    useSortBy,
    usePagination,
  );
  const onFetchDataDebounced = useAsyncDebounce(fetchData, 100);
  useEffect(() => {
    onFetchDataDebounced({
      pageIndex, pageSize, sortBy, filters,
    });
  }, [onFetchDataDebounced, pageIndex, pageSize, sortBy, filters]);
  return (
    <>
      <table className="table-width" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    <span>
                      {
                        (() => {
                          if (!column.isSorted) return ' ⇅';
                          if (column.isSortedDesc) return ' ↓';
                          return ' ↑';
                        })()
                      }
                    </span>
                  </div>
                  {column.canFilter ? column.render('Filter') : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
          <tr>
            {loading ? (
            // Use our custom loading state to show a loading indicator
              <td>Loading...</td>
            ) : (
              <td>
                Showing
                {page.length}
                of ~
                {controlledPageCount * pageSize}
                {' '}
                results
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <div className="pagination pagination-center">
        <div>
          <span>
            Page
            {' '}
            <strong>
              {pageIndex + 1}
              of
              {pageOptions.length}
            </strong>
            {' '}
          </span>
        </div>
        <div>
          <button type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          {' '}
          <button type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          {' '}
          <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          {' '}
          <button type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
          {' '}
        </div>
        <select
          className="select-center"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((currentPageSize) => (
            <option key={currentPageSize} value={currentPageSize}>
              Show
              {currentPageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

TableV2.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
  })).isRequired,
  fetchData: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number.isRequired,
};

TableV2.defaultProps = {
  data: [],
};
