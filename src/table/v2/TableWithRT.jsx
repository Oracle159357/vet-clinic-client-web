import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  usePagination,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useRowSelect,
} from 'react-table';
import { DefaultFilterForColumnString } from './FiltersForRT';
import { RowCheckBox, HeaderCheckBox } from './CheckBoxForRT';
import './TableWithRT.css';

export default function TableWithRT(
  {
    columns,
    data,
    fetchData,
    loading,
    pageCount: controlledPageCount,
    onCheckedChange,
    onClearSelectionChange,
    nameOfId,
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
    selectedFlatRows,
    toggleAllRowsSelected,
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
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      // eslint-disable-next-line no-shadow
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: HeaderCheckBox,
          Cell: RowCheckBox,
        },
        ...columns,
      ]);
    },
  );

  useEffect(() => {
    const checked = selectedFlatRows.map((allChecked) => allChecked.original[nameOfId]);
    onCheckedChange({ checked, reset: () => toggleAllRowsSelected(false) });
  }, [nameOfId, onCheckedChange, selectedFlatRows, toggleAllRowsSelected]);

  useEffect(() => {
    onClearSelectionChange(() => toggleAllRowsSelected(false));
  }, [onClearSelectionChange, toggleAllRowsSelected]);

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
                    {
                      column.id !== 'selection' ? (
                        <span>
                          {
                            (() => {
                              if (!column.isSorted) return ' ⇅';
                              if (column.isSortedDesc) return ' ↓';
                              return ' ↑';
                            })()
                          }
                        </span>
                      ) : null
                    }
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
                {' '}
                {page.length}
                {' '}
                of ~
                {controlledPageCount * pageSize}
                {' '}
                results
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <div className="pagination-center">
        <div>
          <span>
            Page
            {' '}
            <strong>
              {pageIndex + 1}
              {' '}
              of
              {' '}
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

TableWithRT.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
  })).isRequired,
  fetchData: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
  onClearSelectionChange: PropTypes.func.isRequired,
  nameOfId: PropTypes.string.isRequired,
};

TableWithRT.defaultProps = {
  data: [],
};
