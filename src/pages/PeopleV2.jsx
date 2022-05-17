import React, {
  useMemo,
} from 'react';
import './People.css';
import {
  getData1,
} from '../api';
import TableV2 from '../TableV2';
import { useDataV2 } from './hooks';

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
