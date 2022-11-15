import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import '../Pages.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TableWithRT from 'table/v2/TableWithRT';
import { useCustomButton } from 'utils/hooks';
import {
  DefaultFilterForColumnNumber,
  DefaultFilterForColumnString,
  DefaultFilterForColumnBoolean,
  DefaultFilterForColumnDate,
} from 'table/v2/FiltersForRT';
import { Modal, useModal } from 'components/modal/Modal';
import PeoplesForm from 'forms/PeoplesForm';

import { setPeopleOptionsAndLoad, loadPeopleV2 as loadPeople } from 'store/peoples/result';
import { setPeopleChecked } from 'store/peoples/checked';
import { addPeopleV2 } from 'store/peoples/actions/add';
import { changePeopleV2 } from 'store/peoples/actions/change';
import { deletePeopleV2 } from 'store/peoples/actions/delete';
import { convertToDateUI } from 'utils/convertDate';

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
  onDeletePeople: deletePeopleV2,
  onAddPeople: addPeopleV2,
  onChangePeople: changePeopleV2,
  onLoadPeople: loadPeople,
  setChecked: (checked) => setPeopleChecked(checked),
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
    Header: 'Weight',
    accessor: 'weight',
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
    filter: 'equals',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {value ? '✔️' : '❌'}
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

];

function PeoplesV2(
  {
    onAddPeople,
    onChangePeople,
    onDeletePeople,
    onLoadPeople,
    onSetPeopleOptionsAndLoad,
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
      const dataFromAPi = await onDeletePeople(allSelected);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        return undefined;
      }
      return dataFromAPi.payload;
    },
    checked,
    refreshData: onLoadPeople,
  });

  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, addData) => {
      const dataFromAPi = await onAddPeople(addData);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        toggleAddModal();
        return undefined;
      }
      return dataFromAPi.payload;
    },
    checked,
    refreshData: onLoadPeople,
  });

  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, changeData) => {
      const dataFromAPi = await onChangePeople(changeData);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        toggleChangeModal();
        return undefined;
      }
      return dataFromAPi.payload;
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
            initialData={editPeople}
          />
        </Modal>
      </div>
      <div className="table-header">
        <h1>
          Peoples(react-table)
        </h1>
        <div className="table-header-buttons">
          <button type="button" className="button-default" onClick={toggleAddModal}>Add Person</button>
          <button
            type="button"
            className={`button-default ${checked?.length !== 1 ? 'disabled' : ''}`}
            disabled={checked?.length !== 1}
            onClick={toggleChangeModal}
          >
            Change Person
          </button>
          <button
            type="button"
            className={`button-default ${(!checked?.length || deleteLoading) ? 'disabled' : ''}`}
            disabled={!checked?.length || deleteLoading}
            onClick={onDeleteClick}
          >
            Remove Person
          </button>
          <button type="button" className="button-default" onClick={onAlertClick}>Alert People</button>
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
