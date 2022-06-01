import React, { useMemo, useState } from 'react';
import {
  addFromData2, changeFromData2, deleteFromData2ByIds, getData2,
} from '../api';
import Table from '../Table';
import { useCustomButton, useData } from './hooks';
import { useModal, Modal } from './modal';
import './People.css';
import AnimalsForm from './AnimalsForm';

async function getData(options) {
  const result = await getData2(options);
  const formattedData = result.resultData
    .map((el) => ({ ...el, birthDate: new Date(el.birthDate) }));
  return { ...result, resultData: formattedData };
}

function Animals() {
  const [checked, setChecked] = useState(() => new Set());
  const { isShowing: isShowingAddModal, toggle: toggleAddModal } = useModal();

  const {
    setOptions, dataTable, refreshData,
  } = useData({ getData });
  const editPeople = useMemo(
    () => dataTable?.resultData.find((el) => el.idKey === [...checked][0]),
    [dataTable, checked],
  );
  const { isShowing: isShowingChangeModal, toggle: toggleChangeModal } = useModal();
  const { onClick: onDeleteClick } = useCustomButton({
    action: async (allSelected) => {
      await deleteFromData2ByIds(allSelected);
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
      await addFromData2(data);
      setChecked(new Set());
      toggleAddModal();
    },
    checked,
    refreshData,
  });
  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, data) => {
      await changeFromData2(data);
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
      <div>
        <div className="table-header">
          <h1>
            Animals
          </h1>
          <div className="table-header-buttons">
            <button type="button" className="button-default" onClick={onDeleteClick}>Delete columns</button>
            <button type="button" className="button-default" onClick={onAlertClick}>Alert columns</button>
            <button type="button" className="button-default" onClick={toggleAddModal}>Add Animal</button>
            <button type="button" className={`button-default ${checked.size !== 1 ? 'disabled' : ''}`} disabled={checked.size !== 1} onClick={toggleChangeModal}>Change Animal</button>
          </div>
        </div>
        <Table
          data={dataTable}
          nameOfId="idKey"
          columns={[{ key: 'age', name: 'Age', type: 'number' },
            { key: 'dogName', name: 'Dog name', type: 'string' },
            {
              key: 'height', name: 'Height', type: 'number', format: (cellValue) => new Intl.NumberFormat('ru-RU', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(cellValue),
            },
          ]}
          onPagingChanged={setOptions}
          onCheckedChange={setChecked}
          controlledChecked={checked}
        />
      </div>
    </div>

  );
}

export default Animals;
