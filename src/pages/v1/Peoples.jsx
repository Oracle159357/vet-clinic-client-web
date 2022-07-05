import React, { useMemo, useState } from 'react';
import '../Pages.css';
import {
  getData1, deleteFromData1ByIds, addFromData1, changeFromData1,
} from '../../api';
import Table from '../../table/v1/Table';
import { useCustomButton, useData } from '../../utils/hooks';
import { useModal, Modal } from '../../components/modal/Modal';
import PeoplesForm from '../../forms/PeoplesForm';

async function getData(options) {
  const result = await getData1(options);
  const formattedData = result.resultData
    .map((el) => ({ ...el, birthDate: new Date(el.birthDate) }));
  return { ...result, resultData: formattedData };
}

function Peoples() {
  const [checked, setChecked] = useState(() => new Set());
  const { isShowing: isShowingAddModal, toggle: toggleAddModal } = useModal();
  const {
    setOptions, dataTable, refreshData,
  } = useData({ getData });
  const editPeople = useMemo(
    () => dataTable?.resultData.find((el) => el.id === [...checked][0]),
    [dataTable, checked],
  );
  const { isShowing: isShowingChangeModal, toggle: toggleChangeModal } = useModal();
  const { onClick: onDeleteClick } = useCustomButton({
    action: async (allSelected) => {
      await deleteFromData1ByIds(allSelected);
      setChecked(new Set());
    },
    checked,
    refreshData,
  });

  const { onClick: onAlertClick } = useCustomButton({
    action: (allSelected) => {
      // eslint-disable-next-line no-alert
      alert([...allSelected]);
      setChecked(new Set());
    },
    checked,
    refreshData,
  });
  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, data) => {
      const result = await addFromData1(data);
      if (!(result && result.errors)) {
        setChecked(new Set());
        toggleAddModal();
      }
      return result;
    },
    checked,
    refreshData,
  });
  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, data) => {
      await changeFromData1(data);
      setChecked(new Set());
      toggleChangeModal();
    },
    checked,
    refreshData,
  });
  return (
    <div>
      <Modal
        isShowing={isShowingAddModal}
        hide={toggleAddModal}
        name="ADD NEW PEOPLE"
      >
        <PeoplesForm onSubmit={onAddClick} statusOfDisable={false} />
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
          statusOfDisable={false}
        />
      </Modal>
      <div>
        <div className="table-header">
          <h1>
            Peoples(my table)
          </h1>
          <div className="table-header-buttons">
            <button type="button" className="button-default" onClick={onDeleteClick}>Delete columns</button>
            <button type="button" className="button-default" onClick={onAlertClick}>Alert columns</button>
            <button type="button" className="button-default" onClick={toggleAddModal}>Add People</button>
            <button
              type="button"
              className={`button-default ${checked.size !== 1 ? 'disabled' : ''}`}
              disabled={checked.size !== 1}
              onClick={toggleChangeModal}
            >
              Change People
            </button>
          </div>
        </div>
        <Table
          data={dataTable}
          nameOfId="id"
          columns={[
            { key: 'name', name: 'Name', type: 'string' },
            {
              key: 'married', name: 'Married', type: 'boolean', format: (cellValue) => (cellValue ? '✔️' : '❌'),
            },
            {
              key: 'birthDate',
              name: 'Birth date',
              type: 'date',
              format: (cellValue) => new Intl.DateTimeFormat('ru', {
                year: 'numeric',
                weekday: 'short',
                month: 'numeric',
                day: 'numeric',
              }).format(cellValue),
            }]}
          onPagingChanged={setOptions}
          onCheckedChange={setChecked}
          controlledChecked={checked}
        />
      </div>
    </div>

  );
}

export default Peoples;
