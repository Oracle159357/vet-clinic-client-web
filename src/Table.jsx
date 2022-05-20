import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import './App.css';

const booleanLabels = { true: true, false: false, null: null };

function CustomInput({ onChange, value, type }) {
  if (type === 'string') {
    return (
      <input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (type === 'boolean') {
    return (
      <select
        onChange={(e) => onChange(booleanLabels[e.target.value])}
        defaultValue="null"
      >
        <option value="true">✔️</option>
        <option value="false">❌</option>
        <option value="null">All</option>
      </select>
    );
  }
  if (type === 'number') {
    return (
      <div className="number-table-filter">
        <input
          placeholder="From"
          min="1"
          type="number"
          value={value?.from ?? ''}
          onChange={(e) => onChange({
            ...value,
            from: e.target.value === '' ? undefined : e.target.value,
          })}
        />
        <span>  -  </span>
        <input
          placeholder="To"
          type="number"
          min="1"
          value={value?.to ?? ''}
          onChange={(e) => onChange({ ...value, to: e.target.value === '' ? undefined : e.target.value })}
        />
      </div>
    );
  }
  if (type === 'date') {
    return (
      <div className="date-table-filter">
        <input
          type="date"
          value={value?.from?.toString() ?? ''}
          onChange={(e) => onChange({ ...value, from: e.target.value === '' ? undefined : e.target.value })}
        />
        <span>  -  </span>
        <input
          type="date"
          value={value?.to?.toString() ?? ''}
          onChange={(e) => onChange({ ...value, to: e.target.value === '' ? undefined : e.target.value })}
        />
      </div>
    );
  }
  return null;
}
CustomInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ]),
};

CustomInput.defaultProps = {
  value: undefined,
};
function Table({
  data, nameOfId, columns, onPagingChanged, onCheckedChange, controlledChecked,
}) {
  const [countOfPagesAndSizeOfPage, setCountOfPagesAndSizeOfPage] = useState({ page: 0, size: 10 });
  const [sortedColumn, setSortedColumn] = useState([]);
  const [dataChecked, setDataChecked] = useState(new Set());
  const [filtersByColumnName, setFiltersByColumnName] = useState({ });
  useEffect(() => {
    if (controlledChecked === undefined) return;
    setDataChecked(controlledChecked);
  }, [controlledChecked]);

  const onFilterChange = (nameOfColumn, type, value) => {
    setFiltersByColumnName({
      ...filtersByColumnName,
      [nameOfColumn]: { ...filtersByColumnName[nameOfColumn], valueFilter: value, type },
    });
  };

  const handleOnChange = (idColumn) => {
    const copySet = new Set(dataChecked);

    if (copySet.has(idColumn)) copySet.delete(idColumn);
    else copySet.add(idColumn);

    setDataChecked(copySet);

    onCheckedChange(copySet);
  };

  const setCountOfPage = (page) => {
    setCountOfPagesAndSizeOfPage({ ...countOfPagesAndSizeOfPage, page });
  };
  const directions = ['asc', 'desc', null];

  const pushSortedColumn = (name) => {
    const statusColumn = sortedColumn.find((element) => element.key === name);
    if (statusColumn === undefined) {
      setSortedColumn([...sortedColumn, { key: name, direction: directions[0] }]);
      return;
    }
    const index = directions.indexOf(statusColumn.direction);
    const nextDirection = directions[(index + 1) % directions.length];

    if (nextDirection === null) setSortedColumn(sortedColumn.filter((el) => el !== statusColumn));
    else {
      const resultSortedColumn = sortedColumn.map((element) => {
        if (element.key === name) {
          return { ...element, direction: nextDirection };
        }
        return element;
      });
      setSortedColumn(resultSortedColumn);
    }
  };
  const setSizeOfPage = (size) => {
    setCountOfPagesAndSizeOfPage({ ...countOfPagesAndSizeOfPage, size: Number(size) });
  };

  useEffect(() => {
    onPagingChanged(
      { paging: countOfPagesAndSizeOfPage, sorting: sortedColumn, filters: filtersByColumnName },
    );
  }, [onPagingChanged, countOfPagesAndSizeOfPage, sortedColumn, filtersByColumnName]);

  const arrayOfPagesNumber = useMemo(() => {
    if (data === undefined) return undefined;
    return new Array(
      Math.ceil(data.dataLength / countOfPagesAndSizeOfPage.size),
    ).fill(0).map((_, index) => index);
  }, [countOfPagesAndSizeOfPage.size, data]);

  const arrayPageSizes = useMemo(() => {
    if (data === undefined) return undefined;
    const fullPageSizes = [5, 10, 20, 50, 100];
    return fullPageSizes.filter((el) => el < data.dataLength);
  }, [data]);

  if (data === undefined) return 'Loading';

  const dataTable = data.resultData.map((columnData) => (
    <tr className="table-tr" key={columnData[nameOfId]}>
      <td>
        <input
          type="checkbox"
          checked={dataChecked.has(columnData[nameOfId])}
          onChange={() => handleOnChange(columnData[nameOfId])}
        />
      </td>
      {
        columns.map((currentData) => {
          let formattedCell;
          if (currentData.format === undefined) {
            formattedCell = columnData[currentData.key].toString();
          } else formattedCell = currentData.format(columnData[currentData.key]);
          return (
            <td key={currentData.key}>
              { formattedCell }
            </td>
          );
        })
      }
    </tr>
  ));
  // if (data.dataLength === 0) return 'No-data';
  return (
    <div className="table-center">
      <table>
        <thead>
          <tr>
            <th><span>Check</span></th>
            {columns.map((column) => {
              const findElement = sortedColumn.find((element) => element.key === column.key);
              const currentDirection = {
                undefined: '⇅',
                desc: '↓',
                asc: '↑',
              }[findElement?.direction];
              return (
                <th key={column.key}>
                  <div>
                    <span>{column.name}</span>
                    <button type="button" className="transparent-button" onClick={() => pushSortedColumn(column.key)}>
                      {` ${currentDirection}`}
                    </button>
                  </div>
                  <CustomInput
                    type={column.type}
                    value={filtersByColumnName[column.key]?.valueFilter}
                    onChange={(valueOfFilter) => onFilterChange(
                      column.key,
                      column.type,
                      valueOfFilter,
                    )}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        {(() => {
          if (data.dataLength === 0) {
            return (
              <tbody>
                <tr className="table-no-data">
                  <td colSpan={columns.length + 1}>No data</td>
                </tr>
              </tbody>
            );
          }
          return (
            <tbody>
              {dataTable}
            </tbody>
          );
        })()}
      </table>
      <div className="pages-size-center">
        <span>Select page</span>
        {arrayOfPagesNumber.map((el) => (
          <button type="button" className="transparent-button" key={el} onClick={() => setCountOfPage(el)}>
            {el + 1}
          </button>
        ))}
      </div>
      <div className="pages-size-center">
        <span>Select size of pages</span>
        <span>
          <select
            onChange={(event) => setSizeOfPage(event.target.value)}
            value={countOfPagesAndSizeOfPage.size}
          >
            {arrayPageSizes.map((el) => (<option key={el} value={el}>{el}</option>))}
          </select>
        </span>
      </div>
    </div>
  );
}

Table.propTypes = {
  nameOfId: PropTypes.string.isRequired,
  onPagingChanged: PropTypes.func.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  data: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    resultData: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataLength: PropTypes.number.isRequired,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  controlledChecked: PropTypes.object,
};
Table.defaultProps = {
  data: undefined,
  controlledChecked: undefined,
};

export default Table;
