import React from 'react';
import './CheckBoxAndFilters.css';

const IndeterminateCheckbox = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input type="checkbox" ref={resolvedRef} {...rest} />
    );
  },
);

// eslint-disable-next-line react/prop-types
export function HeaderCheckBox({ getToggleAllRowsSelectedProps }) {
  return (
    <div>
      <div className="row-center">Check</div>
      <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    </div>
  );
}

// eslint-disable-next-line react/prop-types
export function RowCheckBox({ row }) {
  return (
    <div className="row-center">
      {/* eslint-disable-next-line react/prop-types */}
      <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    </div>
  );
}
