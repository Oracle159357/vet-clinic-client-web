import React, { useMemo, useState } from 'react';
import '../Pages.css';
import {
  addNewPeople,
  deletePeople,
  getPeople,
  updatePeople,
} from 'api';
import Table from 'table/v1/Table';
import { useCustomButton, useData } from 'utils/hooks';
import { Modal, useModal } from 'components/modal/Modal';
import PeoplesForm from 'forms/PeoplesForm';
import formatOptions from 'utils/formatOptionsForTableV1';

async function getData(options) {
  const formattedOptions = formatOptions(options);

  const result = await getPeople(formattedOptions);
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
      try {
        await deletePeople([...allSelected]);
        setChecked(new Set());
        return undefined;
      } catch (error) {
        return error.payload;
      }
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
      try {
        await addNewPeople(data);
        setChecked(new Set());
        toggleAddModal();
        return undefined;
      } catch (error) {
        return error.payload;
      }
    },
    checked,
    refreshData,
  });
  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, data) => {
      try {
        await updatePeople(data);
        setChecked(new Set());
        toggleChangeModal();
        return undefined;
      } catch (error) {
        return error.payload;
      }
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
            { key: 'weight', name: 'Weight', type: 'number' },
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
