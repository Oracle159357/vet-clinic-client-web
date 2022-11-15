import React, { useMemo, useState } from 'react';
import {
  getAnimal,
  updateAnimal,
  deleteAnimal,
  addNewAnimal,
} from 'api';
import Table from 'table/v1/Table';
import { useCustomButton, useData } from 'utils/hooks';
import { useModal, Modal } from 'components/modal/Modal';
import '../Pages.css';
import AnimalsForm from 'forms/AnimalsForm';
import formatOptions from 'utils/formatOptionsForTableV1';

async function getData(options) {
  const formattedOptions = formatOptions(options);
  const result = await getAnimal(formattedOptions);
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
      try {
        await deleteAnimal([...allSelected]);
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
        await addNewAnimal(data);
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
        await updateAnimal(data);
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
            Animals(my table)
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
          columns={[
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
