import React, {
  useMemo,
} from 'react';
import './People.css';
import {
  getData1,
} from '../api';
import TableV2 from '../TableV2';
import { useDataV2 } from './hooks';
import {
  DefaultFilterForColumnNumber,
  DefaultFilterForColumnString,
  DefaultFilterForColumnBoolean,
  DefaultFilterForColumnDate,
} from '../Filter';

async function getData(options) {
  const result = await getData1(options);
  const formattedData = result.resultData
    .map((el) => ({ ...el, birthDate: new Date(el.birthDate) }));
  return { ...result, resultData: formattedData };
}

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    Filter: DefaultFilterForColumnString,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {value}
      </div>
    ),
  },
  {
    Header: 'Age',
    accessor: 'age',
    filter: String,
    Filter: DefaultFilterForColumnNumber,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {value}
      </div>
    ),
  },
  {
    Header: 'Married',
    accessor: 'married',
    Filter: DefaultFilterForColumnBoolean,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {value ? '✔️' : '❌'}
      </div>
    ),
  },
  {
    Header: 'Birthdate',
    accessor: 'birthDate',
    Filter: DefaultFilterForColumnDate,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => {
      const formatter = useMemo(
        () => new Intl.DateTimeFormat(
          'ru',
          {
            year: 'numeric',
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
          },
        ),
        [],
      );

      return (
        <div className="text-cell-center">
          {formatter.format(value)}
        </div>
      );
    },
  },

];

function PeoplesV2() {
  const {
    refreshDataWithNewOptions,
    pageCount,
    loading,
    data,
  } = useDataV2({ getData });
  return (
    <div>
      <div className="table-header">
        <h1>
          Peoples
        </h1>
      </div>
      <div>
        <TableV2
          columns={columns}
          data={data}
          fetchData={refreshDataWithNewOptions}
          loading={loading}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}

export default PeoplesV2;
