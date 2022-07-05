import React, {
  useCallback,
  useMemo, useState,
} from 'react';
import '../Pages.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TableWithRT from '../../table/v2/TableWithRT';
import { useCustomButton } from '../../utils/hooks';
import {
  DefaultFilterForColumnNumber,
  DefaultFilterForColumnString,
  DefaultFilterForColumnBoolean,
  DefaultFilterForColumnDate,
} from '../../table/v2/FiltersForRT';
import { Modal, useModal } from '../../components/modal/Modal';
import PeoplesForm from '../../forms/PeoplesForm';

import { addPeople } from '../../store/actions/peoples/actions/add';
import { changePeople } from '../../store/actions/peoples/actions/change';
import { deletePeople } from '../../store/actions/peoples/actions/delete';
import { loadPeople, setPeopleOptionsAndLoad } from '../../store/actions/peoples/result';
import { SetPeopleChecked } from '../../store/actions/peoples/checked';

const mapStateToProps = ({ peoples }) => ({
  data: peoples.result.data,
  pageCount: peoples.result.pageCount,
  loading: peoples.result.loading,
  checked: peoples.checked,
  addLoading: peoples.actions.add.loading,
  changeLoading: peoples.actions.change.loading,
  deleteLoading: peoples.actions.delete.loading,
});

const mapDispatchToProps = {
  onDeletePeople: deletePeople,
  onAddPeople: addPeople,
  onChangePeople: changePeople,
  onLoadPeople: loadPeople,
  setChecked: (checked) => SetPeopleChecked(checked),
  onSetPeopleOptionsAndLoad: (options) => setPeopleOptionsAndLoad(options),
};

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

function PeoplesV2(
  {
    onDeletePeople,
    onAddPeople,
    onChangePeople,
    onSetPeopleOptionsAndLoad,
    onLoadPeople,
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
    refreshData: onLoadPeople,
  });
  const { onClick: onDeleteClick } = useCustomButton({
    action: async (allSelected) => {
      await onDeletePeople(allSelected);
      await resetChecked();
    },
    checked,
    refreshData: onLoadPeople,
  });
  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, addData) => {
      const dataFromAPi = await onAddPeople(addData);
      if (dataFromAPi?.errors === undefined) {
        resetChecked();
        toggleAddModal();
      }
      return dataFromAPi;
    },
    checked,
    refreshData: onLoadPeople,
  });
  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, changeData) => {
      await onChangePeople(changeData);
      resetChecked();
      toggleChangeModal();
    },
    checked,
    refreshData: onLoadPeople,
  });
  const editPeople = useMemo(
    () => data?.find((el) => el.id === checked[0]),
    [data, checked],
  );
  const load = useCallback(onSetPeopleOptionsAndLoad, [onSetPeopleOptionsAndLoad]);
  return (
    <div>
      <div>
        <Modal
          isShowing={isShowingAddModal}
          hide={toggleAddModal}
          name="ADD NEW PEOPLE"
        >
          <PeoplesForm onSubmit={onAddClick} statusOfDisable={addLoading} />
        </Modal>
        <Modal
          isShowing={isShowingChangeModal}
          hide={toggleChangeModal}
          name="CHANGE PEOPLE"
        >
          <PeoplesForm
            statusOfDisable={changeLoading}
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
          <button
            type="button"
            className={`button-default ${(!checked?.length || deleteLoading) ? 'disabled' : ''}`}
            disabled={!checked?.length || deleteLoading}
            onClick={onDeleteClick}
          >
            Delete columns
          </button>
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
          fetchData={load}
          loading={loading}
          pageCount={pageCount}
          onCheckedChange={setChecked}
          nameOfId="id"
          setResetChecked={setResetChecked}
        />
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeoplesV2);

PeoplesV2.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  checked: PropTypes.arrayOf(PropTypes.string).isRequired,
  addLoading: PropTypes.bool.isRequired,
  changeLoading: PropTypes.bool.isRequired,
  deleteLoading: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number.isRequired,
  onAddPeople: PropTypes.func.isRequired,
  onChangePeople: PropTypes.func.isRequired,
  onDeletePeople: PropTypes.func.isRequired,
  onLoadPeople: PropTypes.func.isRequired,
  onSetPeopleOptionsAndLoad: PropTypes.func.isRequired,
};

PeoplesV2.defaultProps = {
  data: [],
};
