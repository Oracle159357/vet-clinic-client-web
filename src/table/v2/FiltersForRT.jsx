import { React } from 'react';
import PropTypes from 'prop-types';
import { convertToDateUI, convertToDateServer } from 'utils/convertDate';

// eslint-disable-next-line react/prop-types
export function DefaultFilterForColumnString({
  column: {
    filterValue,
    setFilter,
  },
}) {
  return (
    <input
      value={filterValue ?? ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      className="filter-margin-top"
    />
  );
}

DefaultFilterForColumnString.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.string,
    setFilter: PropTypes.func,
  }),
};

DefaultFilterForColumnString.defaultProps = {
  column: undefined,
};

const labelsToValues = new Map();
labelsToValues.set('true', true);
labelsToValues.set('false', false);
labelsToValues.set('empty', undefined);

const valuesToLabels = new Map();
valuesToLabels.set(true, 'true');
valuesToLabels.set(false, 'false');
valuesToLabels.set(undefined, 'empty');

export function DefaultFilterForColumnBoolean({
  column: {
    setFilter,
    filterValue,
  },
}) {
  return (
    <select
      onChange={(e) => setFilter(labelsToValues.get(e.target.value))}
      value={valuesToLabels.get(filterValue)}
      className="filter-margin-top"
    >
      <option value="true">✔️</option>
      <option value="false">❌</option>
      <option value="empty">All</option>
    </select>
  );
}

DefaultFilterForColumnBoolean.propTypes = {
  column: PropTypes.shape({
    setFilter: PropTypes.func.isRequired,
    filterValue: PropTypes.bool,
  }),
};

DefaultFilterForColumnBoolean.defaultProps = {
  column: undefined,
};

export function DefaultFilterForColumnDate({
  column: {
    filterValue,
    setFilter,
  },
}) {
  const currentTimeZone = 'Europe/Kiev';
  return (
    <div className="date-table-filter">
      <input
        type="date"
        className="filter-margin-top"
        value={convertToDateUI(filterValue?.from, currentTimeZone) ?? ''}
        onChange={(e) => {
          if (e.target.value === '' && filterValue.to === undefined) {
            setFilter(undefined);
          } else {
            setFilter(
              {
                ...filterValue,
                from: e.target.value === '' ? undefined : convertToDateServer(e.target.value, currentTimeZone),
              },
            );
          }
        }}
      />
      <span>  -  </span>
      <input
        type="date"
        className="filter-margin-top"
        value={convertToDateUI(filterValue?.to, currentTimeZone) ?? ''}
        onChange={(e) => {
          if (e.target.value === '' && filterValue.from === undefined) {
            setFilter(undefined);
          } else {
            setFilter(
              {
                ...filterValue,
                to: e.target.value === '' ? undefined : convertToDateServer(e.target.value, currentTimeZone),
              },
            );
          }
        }}
      />
    </div>
  );
}

DefaultFilterForColumnDate.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    setFilter: PropTypes.func,
  }),
};

DefaultFilterForColumnDate.defaultProps = {
  column: undefined,
};

export function DefaultFilterForColumnNumber({
  column: {
    filterValue,
    setFilter,
  },
}) {
  return (
    <div className="number-table-filter">
      <input
        placeholder="From"
        min="1"
        type="number"
        value={filterValue?.from?.toString() ?? ''}
        onChange={(e) => {
          if (e.target.value === '' && filterValue.to === undefined) {
            setFilter(undefined);
          } else {
            setFilter({
              ...filterValue,
              from: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
            });
          }
        }}
        className="filter-margin-top"
      />
      <span>  -  </span>
      <input
        placeholder="To"
        type="number"
        min="1"
        value={filterValue?.to?.toString() ?? ''}
        onChange={(e) => {
          if (e.target.value === '' && filterValue.from === undefined) {
            setFilter(undefined);
          } else {
            setFilter({
              ...filterValue,
              to: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
            });
          }
        }}
        className="filter-margin-top"
      />
    </div>
  );
}
DefaultFilterForColumnNumber.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
    setFilter: PropTypes.func,
  }),
};

DefaultFilterForColumnNumber.defaultProps = {
  column: undefined,
};
