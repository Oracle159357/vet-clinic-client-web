import { React } from 'react';
import PropTypes from 'prop-types';

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

export function DefaultFilterForColumnBoolean({
  column: {
    setFilter,
  },
}) {
  const booleanLabels = { true: 'true', false: 'false', null: 'null' };
  return (
    <select
      onChange={(e) => setFilter(booleanLabels[e.target.value])}
      defaultValue="null"
      className="filter-margin-top"
    >
      <option value="true">✔️</option>
      <option value="false">❌</option>
      <option value="null">All</option>
    </select>
  );
}

DefaultFilterForColumnBoolean.propTypes = {
  column: PropTypes.shape({
    setFilter: PropTypes.func,
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
  return (
    <div className="date-table-filter">
      <input
        type="date"
        className="filter-margin-top"
        value={filterValue?.from ?? ''}
        onChange={(e) => setFilter({ ...filterValue, from: e.target.value === '' ? undefined : e.target.value })}
      />
      <span>  -  </span>
      <input
        type="date"
        className="filter-margin-top"
        value={filterValue?.to ?? ''}
        onChange={(e) => setFilter({ ...filterValue, to: e.target.value === '' ? undefined : e.target.value })}
      />
    </div>
  );
}

DefaultFilterForColumnDate.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.string,
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
        onChange={(e) => setFilter({
          ...filterValue,
          from: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
        })}
        className="filter-margin-top"
      />
      <span>  -  </span>
      <input
        placeholder="To"
        type="number"
        min="1"
        value={filterValue?.to?.toString() ?? ''}
        onChange={(e) => setFilter({ ...filterValue, to: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
        className="filter-margin-top"
      />
    </div>
  );
}
DefaultFilterForColumnNumber.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.string,
    setFilter: PropTypes.func,
  }),
};

DefaultFilterForColumnNumber.defaultProps = {
  column: undefined,
};
