import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import '../Pages.css';
import {
  addFromData1, changeFromData1,
  deleteFromData1ByIdsTableV2,
  getData1,
} from '../../api';
import TableWithRT from '../../table/v2/TableWithRT';
import { useCustomButtonV2, useDataV2 } from '../hooks';
import {
  DefaultFilterForColumnNumber,
  DefaultFilterForColumnString,
  DefaultFilterForColumnBoolean,
  DefaultFilterForColumnDate,
} from '../../table/v2/FiltersForRT';
import { Modal, useModal } from '../../components/modal/Modal';
import PeoplesForm from '../../forms/PeoplesForm';

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
    Header: 'Birth date',
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
    setOptionTable,
    pageCount,
    loading,
    data,
    refreshDataWithOldOptions,
  } = useDataV2({ getData });
  const [{ checked, reset }, setCheckedAndFuncResetChecked] = useState(
    { checked: undefined, reset: undefined },
  );
  const { isShowing: isShowingAddModal, toggle: toggleAddModal } = useModal();
  const { isShowing: isShowingChangeModal, toggle: toggleChangeModal } = useModal();
  const [clearSelection, setClearSelection] = useState(undefined);
  const { onClick: onAlertClick } = useCustomButtonV2({
    action: (allSelected) => {
      // eslint-disable-next-line no-alert
      alert([...allSelected]);
      clearSelection();
    },
    checked,
    refreshDataWithOldOptions,
  });
  const { onClick: onDeleteClick } = useCustomButtonV2({
    action: async (allSelected) => {
      await deleteFromData1ByIdsTableV2(allSelected);
      reset();
    },
    checked,
    refreshDataWithOldOptions,
  });
  const { onClick: onAddClick } = useCustomButtonV2({
    action: async (allSelected, addData) => {
      const result = await addFromData1(addData);
      if (!(result && result.errors)) {
        reset();
        toggleAddModal();
      }
      return result;
    },
    checked,
    refreshDataWithOldOptions,
  });
  const { onClick: onChangeCLick } = useCustomButtonV2({
    action: async (allSelected, changeData) => {
      await changeFromData1(changeData);
      reset();
      toggleChangeModal();
    },
    checked,
    refreshDataWithOldOptions,
  });
  const setClearAllSelected = useCallback((func) => {
    setClearSelection(() => func);
  }, [setClearSelection]);
  const editPeople = useMemo(
    () => data?.find((el) => el.id === checked[0]),
    [data, checked],
  );

  return (
    <div>
      <div>
        <Modal
          isShowing={isShowingAddModal}
          hide={toggleAddModal}
          name="ADD NEW PEOPLE"
        >
          <PeoplesForm onSubmit={onAddClick} />
        </Modal>
        <Modal
          isShowing={isShowingChangeModal}
          hide={toggleChangeModal}
          name="CHANGE PEOPLE"
        >
          <PeoplesForm
            onSubmit={onChangeCLick}
            initialData={editPeople && {
              name: editPeople.name,
              married: editPeople.married,
              date: editPeople.birthDate.toISOString().substring(0, 10),
              id: editPeople.id,
            }}
          />
        </Modal>
      </div>
      <div className="table-header">
        <h1>
          Peoples(react-table)
        </h1>
        <div className="table-header-buttons">
          <button type="button" className="button-default" onClick={onAlertClick}>Alert columns</button>
          <button type="button" className="button-default" onClick={onDeleteClick}>Delete columns</button>
          <button type="button" className="button-default" onClick={toggleAddModal}>Add People</button>
          <button
            type="button"
            className={`button-default ${checked?.length !== 1 ? 'disabled' : ''}`}
            disabled={checked?.length !== 1}
            onClick={toggleChangeModal}
          >
            Change People
          </button>
        </div>
      </div>
      <div>
        <TableWithRT
          columns={columns}
          data={data}
          fetchData={setOptionTable}
          loading={loading}
          pageCount={pageCount}
          onCheckedChange={setCheckedAndFuncResetChecked}
          onClearSelectionChange={setClearAllSelected}
          nameOfId="id"
        />
      </div>
    </div>
  );
}

export default PeoplesV2;
