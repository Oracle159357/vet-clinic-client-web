import React, {
  useMemo,
  useState,
} from 'react';
import '../Pages.css';
import {
  addFromData2, changeFromData2,
  deleteFromData2ByIdsTableV2,
  getData2,
} from '../../api';
import TableWithRT from '../../table/v2/TableWithRT';
import { useCustomButton, useDataV2 } from '../../utils/hooks';
import {
  DefaultFilterForColumnNumber,
  DefaultFilterForColumnString,
} from '../../table/v2/FiltersForRT';
import { Modal, useModal } from '../../components/modal/Modal';
import AnimalsForm from '../../forms/AnimalsForm';

async function getData(options) {
  const result = await getData2(options);
  const formattedData = result.resultData
    .map((el) => ({ ...el, birthDate: new Date(el.birthDate) }));
  return { ...result, resultData: formattedData };
}

const columns = [
  {
    Header: 'Dog name',
    accessor: 'dogName',
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
    Header: 'Height',
    accessor: 'height',
    Filter: DefaultFilterForColumnNumber,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {new Intl.NumberFormat(
          'ru-RU',
          { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 },
        ).format(value)}
      </div>
    ),
  },
];

function AnimalsV2() {
  const {
    setOptionTable,
    pageCount,
    loading,
    data,
    refreshDataWithOldOptions,
  } = useDataV2({ getData });
  const [resetChecked, setResetChecked] = useState();
  const [checked, setChecked] = useState();
  const { isShowing: isShowingAddModal, toggle: toggleAddModal } = useModal();
  const { isShowing: isShowingChangeModal, toggle: toggleChangeModal } = useModal();

  const { onClick: onAlertClick } = useCustomButton({
    action: (allSelected) => {
      // eslint-disable-next-line no-alert
      alert([...allSelected]);
      resetChecked();
    },
    checked,
    refreshData: refreshDataWithOldOptions,
  });
  const { onClick: onDeleteClick } = useCustomButton({
    action: async (allSelected) => {
      await deleteFromData2ByIdsTableV2(allSelected);
      resetChecked();
    },
    checked,
    refreshData: refreshDataWithOldOptions,
  });
  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, addData) => {
      const result = await addFromData2(addData);
      if (!(result && result.errors)) {
        resetChecked();
        toggleAddModal();
      }
      return result;
    },
    checked,
    refreshData: refreshDataWithOldOptions,
  });
  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, changeData) => {
      await changeFromData2(changeData);
      resetChecked();
      toggleChangeModal();
    },
    checked,
    refreshData: refreshDataWithOldOptions,
  });

  const editPeople = useMemo(
    () => data?.find((el) => el.idKey === checked[0]),
    [data, checked],
  );

  return (
    <div>
      <div>
        <Modal
          isShowing={isShowingAddModal}
          hide={toggleAddModal}
          name="ADD NEW ANIMAL"
        >
          <AnimalsForm onSubmit={onAddClick} />
        </Modal>
        <Modal
          isShowing={isShowingChangeModal}
          hide={toggleChangeModal}
          name="CHANGE ANIMAL"
        >
          <AnimalsForm
            onSubmit={onChangeCLick}
            initialData={editPeople && {
              dogName: editPeople.dogName,
              height: editPeople.height,
              date: editPeople.birthDate.toISOString().substring(0, 10),
              idKey: editPeople.idKey,
            }}
          />
        </Modal>
      </div>
      <div className="table-header">
        <h1>
          Animals(react-table)
        </h1>
        <div className="table-header-buttons">
          <button type="button" className="button-default" onClick={onAlertClick}>Alert columns</button>
          <button type="button" className="button-default" onClick={onDeleteClick}>Delete columns</button>
          <button type="button" className="button-default" onClick={toggleAddModal}>Add Animal</button>
          <button
            type="button"
            className={`button-default ${checked?.length !== 1 ? 'disabled' : ''}`}
            disabled={checked?.length !== 1}
            onClick={toggleChangeModal}
          >
            Change Animal
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
          onCheckedChange={setChecked}
          nameOfId="idKey"
          setResetChecked={setResetChecked}
        />
      </div>
    </div>
  );
}

export default AnimalsV2;
