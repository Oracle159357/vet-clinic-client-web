import React, {
  useMemo,
  useState,
  useCallback,
} from 'react';
import '../Pages.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TableWithRT from 'table/v2/TableWithRT';
import { useCustomButton } from 'utils/hooks';
import {
  DefaultFilterForColumnDate,
  DefaultFilterForColumnNumber,
  DefaultFilterForColumnString,
} from 'table/v2/FiltersForRT';
import { Modal, useModal } from 'components/modal/Modal';
import AnimalsForm from 'forms/AnimalsForm';

import { setAnimalOptionsAndLoad, loadAnimal } from 'store/animals/result';
import { setAnimalChecked } from 'store/animals/checked';
import { addAnimalV2 } from 'store/animals/actions/add';
import { changeAnimalV2 } from 'store/animals/actions/change';
import { deleteAnimalV2 } from 'store/animals/actions/delete';
import { convertToDateUI } from '../../utils/convertDate';

const mapStateToProps = ({ animals }) => ({
  data: animals.result.data,
  pageCount: animals.result.pageCount,
  loading: animals.result.loading,
  checked: animals.checked,
  addLoading: animals.actions.add.loading,
  changeLoading: animals.actions.change.loading,
  deleteLoading: animals.actions.delete.loading,
});

const mapDispatchToProps = {
  onAddAnimal: addAnimalV2,
  onChangeAnimal: changeAnimalV2,
  onDeleteAnimal: deleteAnimalV2,
  onLoadAnimal: loadAnimal,
  setChecked: (checked) => setAnimalChecked(checked),
  onSetAnimalOptionsAndLoad: (options) => setAnimalOptionsAndLoad(options),
};

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
  {
    Header: 'Birthdate',
    accessor: 'birthDate',
    Filter: DefaultFilterForColumnDate,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {convertToDateUI(value, 'Europe/Kiev')}
      </div>
    ),
  },
  {
    Header: 'Owner',
    accessor: 'owner.name',
    Filter: DefaultFilterForColumnString,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {/* eslint-disable-next-line react/prop-types */}
        {typeof value === 'undefined' ? '-' : value}
      </div>
    ),
  },
];

function AnimalsV2(
  {
    onAddAnimal,
    onChangeAnimal,
    onDeleteAnimal,
    onSetAnimalOptionsAndLoad,
    onLoadAnimal,
    setChecked,
    data,
    pageCount,
    loading,
    checked,
    addLoading,
    changeLoading,
    deleteLoading,
  },
) {
  const [resetChecked, setResetChecked] = useState();
  const { isShowing: isShowingAddModal, toggle: toggleAddModal } = useModal();
  const { isShowing: isShowingChangeModal, toggle: toggleChangeModal } = useModal();

  const { onClick: onAlertClick } = useCustomButton({
    action: (allSelected) => {
      // eslint-disable-next-line no-alert
      alert([...allSelected]);
      resetChecked();
    },
    checked,
    refreshData: onLoadAnimal,
  });

  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, addData) => {
      const dataFromAPi = await onAddAnimal(addData);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        toggleAddModal();
        return undefined;
      }
      return dataFromAPi.payload;
    },
    checked,
    refreshData: onLoadAnimal,
  });

  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, changeData) => {
      const dataFromAPi = await onChangeAnimal(changeData);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        toggleChangeModal();
        return undefined;
      }
      return dataFromAPi.payload;
    },
    checked,
    refreshData: onLoadAnimal,
  });

  const { onClick: onDeleteClick } = useCustomButton({
    action: async (allSelected) => {
      const dataFromAPi = await onDeleteAnimal(allSelected);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        return undefined;
      }
      // eslint-disable-next-line no-alert
      alert(dataFromAPi.payload);
      return undefined;
    },
    checked,
    refreshData: onLoadAnimal,
  });

  const editAnimal = useMemo(
    () => data?.find((el) => el.idKey === checked[0]),
    [data, checked],
  );

  const load = useCallback(onSetAnimalOptionsAndLoad, [onSetAnimalOptionsAndLoad]);
  return (
    <div>
      <div>
        <Modal
          isShowing={isShowingAddModal}
          hide={toggleAddModal}
          name="ADD NEW ANIMAL"
        >
          <AnimalsForm onSubmit={onAddClick} statusOfDisable={addLoading} />
        </Modal>
        <Modal
          isShowing={isShowingChangeModal}
          hide={toggleChangeModal}
          name="CHANGE ANIMAL"
        >
          <AnimalsForm
            statusOfDisable={changeLoading}
            onSubmit={onChangeCLick}
            initialData={editAnimal}
          />
        </Modal>
      </div>
      <div className="table-header">
        <h1>
          Animals(react-table)
        </h1>
        <div className="table-header-buttons">
          <button type="button" className="button-default" onClick={toggleAddModal}>Add Animal</button>
          <button
            type="button"
            className={`button-default ${checked?.length !== 1 ? 'disabled' : ''}`}
            disabled={checked?.length !== 1}
            onClick={toggleChangeModal}
          >
            Change Animal
          </button>
          <button
            type="button"
            className={`button-default ${(!checked?.length || deleteLoading) ? 'disabled' : ''}`}
            disabled={!checked?.length || deleteLoading}
            onClick={onDeleteClick}
          >
            Delete Animal
          </button>
          <button type="button" className="button-default" onClick={onAlertClick}>Alert Animal</button>
        </div>
      </div>
      <div>
        <TableWithRT
          columns={columns}
          data={data}
          fetchData={load}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnimalsV2);

AnimalsV2.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  checked: PropTypes.arrayOf(PropTypes.string).isRequired,
  addLoading: PropTypes.bool.isRequired,
  changeLoading: PropTypes.bool.isRequired,
  deleteLoading: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number.isRequired,
  onAddAnimal: PropTypes.func.isRequired,
  onChangeAnimal: PropTypes.func.isRequired,
  onDeleteAnimal: PropTypes.func.isRequired,
  onLoadAnimal: PropTypes.func.isRequired,
  onSetAnimalOptionsAndLoad: PropTypes.func.isRequired,
};

AnimalsV2.defaultProps = {
  data: [],
};
