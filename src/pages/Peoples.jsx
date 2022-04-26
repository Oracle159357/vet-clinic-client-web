import React, { useMemo, useState } from 'react';
import './People.css';
import PropTypes from 'prop-types';
import {
  getData1, deleteFromData1ByIds, addFromData1, changeFromData1,
} from '../api';
import Table from '../Table';
import { useCustomButton, useData } from './hooks';
import { useModal, Modal } from './modal';

function PeopleForm({
  initialData,
  onSubmit,
}) {
  const [married, setMarried] = useState(initialData.married);
  const [name, setName] = useState(initialData.name);
  const [date, setDate] = useState(initialData.date);
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      onSubmit({
        ...initialData, name, married, date,
      });
    }}
    >
      <div>
        <span>Name: </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <span>Married: </span>
        <input type="checkbox" checked={married} onChange={() => setMarried(!married)} />
      </div>
      <div>
        <span>Birthdate: </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <input className={`button-submit ${!name ? 'disabled' : ''}`} type="submit" disabled={!name} />
    </form>
  );
}
PeopleForm.defaultProps = {
  initialData: { name: '', married: false, date: '2022-08-03' },
};

PeopleForm.propTypes = {
  initialData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    married: PropTypes.bool.isRequired,
    id: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

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
      alert([...allSelected]);
      setChecked(new Set());
    },
    checked,
    refreshData,
  });
  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, data) => {
      await addFromData1(data);
      setChecked(new Set());
      toggleAddModal();
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
        <PeopleForm onSubmit={onAddClick} />
      </Modal>
      <Modal
        isShowing={isShowingChangeModal}
        hide={toggleChangeModal}
        name="CHANGE PEOPLE"
      >
        <PeopleForm
          onSubmit={onChangeCLick}
          initialData={editPeople && {
            name: editPeople.name,
            married: editPeople.married,
            date: editPeople.birthDate.toISOString().substring(0, 10),
            id: editPeople.id,
          }}
        />
      </Modal>
      <div>
        <div className="table-header">
          <h1>
            Peoples
          </h1>
          <div className="table-header-buttons">
            <button type="button" className="button-default" onClick={onDeleteClick}>Delete columns</button>
            <button type="button" className="button-default" onClick={onAlertClick}>Alert columns</button>
            <button type="button" className="button-default" onClick={toggleAddModal}>Add People</button>
            <button type="button" className={`button-default ${checked.size !== 1 ? 'disabled' : ''}`} disabled={checked.size !== 1} onClick={toggleChangeModal}>Change People</button>
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
