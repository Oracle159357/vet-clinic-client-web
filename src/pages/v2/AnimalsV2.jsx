import React, {
  useMemo,
  useState,
  useCallback,
} from 'react';
import '../Pages.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TableWithRT from '../../table/v2/TableWithRT';
import { useCustomButton } from '../../utils/hooks';
import {
  DefaultFilterForColumnNumber,
  DefaultFilterForColumnString,
} from '../../table/v2/FiltersForRT';
import { Modal, useModal } from '../../components/modal/Modal';
import AnimalsForm from '../../forms/AnimalsForm';

import { addAnimal } from '../../store/actions/animals/actions/add';
import { changeAnimal } from '../../store/actions/animals/actions/change';
import { deleteAnimal } from '../../store/actions/animals/actions/delete';
import { loadAnimal, setAnimalOptionsAndLoad } from '../../store/actions/animals/result';
import { SetAnimalChecked } from '../../store/actions/animals/checked';

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
  onDeleteAnimal: deleteAnimal,
  onAddAnimal: addAnimal,
  onChangeAnimal: changeAnimal,
  onLoadAnimal: loadAnimal,
  setChecked: (checked) => SetAnimalChecked(checked),
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

function AnimalsV2(
  {
    onDeleteAnimal,
    onAddAnimal,
    onChangeAnimal,
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
  const { onClick: onDeleteClick } = useCustomButton({
    action: async (allSelected) => {
      await onDeleteAnimal(allSelected);
      resetChecked();
    },
    checked,
    refreshData: onLoadAnimal,
  });
  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, addData) => {
      const result = await onAddAnimal(addData);
      if (!(result && result.errors)) {
        resetChecked();
        toggleAddModal();
      }
      return result;
    },
    checked,
    refreshData: onLoadAnimal,
  });
  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, changeData) => {
      await onChangeAnimal(changeData);
      resetChecked();
      toggleChangeModal();
    },
    checked,
    refreshData: onLoadAnimal,
  });

  const editPeople = useMemo(
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
