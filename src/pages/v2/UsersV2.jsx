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
  DefaultFilterForColumnString,
  DefaultFilterForColumnBoolean,
} from 'table/v2/FiltersForRT';
import { Modal, useModal } from 'components/modal/Modal';
import UsersForm from 'forms/UsersForm';

import { setUserOptionsAndLoad, loadUserV2 as loadUser } from 'store/users/result';
import { setUserChecked } from 'store/users/checked';
import { addUserV2 } from 'store/users/actions/add';
import { changeUserV2 } from 'store/users/actions/change';
import { deactivateUserV2 } from 'store/users/actions/deactivate';

const mapStateToProps = ({ users }) => ({
  data: users.result.data,
  pageCount: users.result.pageCount,
  loading: users.result.loading,
  checked: users.checked,
  addLoading: users.actions.add.loading,
  changeLoading: users.actions.change.loading,
  deactivateLoading: users.actions.deactivate.loading,
});

const mapDispatchToProps = {
  onAddUser: addUserV2,
  onChangeUser: changeUserV2,
  onDeactivateUser: deactivateUserV2,
  onLoadUser: loadUser,
  setChecked: (checked) => setUserChecked(checked),
  onSetUserOptionsAndLoad: (options) => setUserOptionsAndLoad(options),
};

const columns = [
  {
    Header: 'Username',
    accessor: 'username',
    Filter: DefaultFilterForColumnString,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {value}
      </div>
    ),
  },
  {
    Header: 'IsAdmin',
    accessor: 'isAdmin',
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
    Header: 'IsActive',
    accessor: 'isActive',
    Filter: DefaultFilterForColumnBoolean,
    filter: 'equals',
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (
      <div className="text-cell-center">
        {value ? '✔️' : '❌'}
      </div>
    ),
  },
];

function UsersV2(
  {
    onAddUser,
    onChangeUser,
    onDeactivateUser,
    onLoadUser,
    onSetUserOptionsAndLoad,
    setChecked,
    data,
    pageCount,
    loading,
    checked,
    addLoading,
    changeLoading,
    deactivateLoading,
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
    refreshData: onLoadUser,
  });

  const { onClick: onDeactivateClick } = useCustomButton({
    action: async (allSelected) => {
      const dataFromAPi = await onDeactivateUser(allSelected);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        return undefined;
      }
      return dataFromAPi.payload;
    },
    checked,
    refreshData: onLoadUser,
  });

  const { onClick: onAddClick } = useCustomButton({
    action: async (allSelected, addData) => {
      const dataFromAPi = await onAddUser(addData);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        toggleAddModal();
        return undefined;
      }
      return dataFromAPi.payload;
    },
    checked,
    refreshData: onLoadUser,
  });

  const { onClick: onChangeCLick } = useCustomButton({
    action: async (allSelected, changeData) => {
      const dataFromAPi = await onChangeUser(changeData);
      if (dataFromAPi.error === undefined) {
        resetChecked();
        toggleChangeModal();
        return undefined;
      }
      return dataFromAPi.payload;
    },
    checked,
    refreshData: onLoadUser,
  });

  const editUser = useMemo(
    () => data?.find((el) => el.id === checked[0]),
    [data, checked],
  );

  const load = useCallback(onSetUserOptionsAndLoad, [onSetUserOptionsAndLoad]);
  return (
    <div>
      <div>
        <Modal
          isShowing={isShowingAddModal}
          hide={toggleAddModal}
          name="ADD NEW USER"
        >
          <UsersForm
            onSubmit={onAddClick}
            statusOfDisable={addLoading}
            isNew
          />
        </Modal>
        <Modal
          isShowing={isShowingChangeModal}
          hide={toggleChangeModal}
          name="CHANGE USER"
        >
          <UsersForm
            statusOfDisable={changeLoading}
            onSubmit={onChangeCLick}
            initialData={editUser}
            isNew={false}
          />
        </Modal>
      </div>
      <div className="table-header">
        <h1>
          Users(react-table)
        </h1>
        <div className="table-header-buttons">
          <button type="button" className="button-default" onClick={toggleAddModal}>Add User</button>
          <button
            type="button"
            className={`button-default ${checked?.length !== 1 ? 'disabled' : ''}`}
            disabled={checked?.length !== 1}
            onClick={toggleChangeModal}
          >
            Change User
          </button>
          <button
            type="button"
            className={`button-default ${(!checked?.length || deactivateLoading) ? 'disabled' : ''}`}
            disabled={!checked?.length || deactivateLoading}
            onClick={onDeactivateClick}
          >
            Deactivate User
          </button>
          <button type="button" className="button-default" onClick={onAlertClick}>Alert User</button>
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
)(UsersV2);

UsersV2.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  checked: PropTypes.arrayOf(PropTypes.string).isRequired,
  addLoading: PropTypes.bool.isRequired,
  changeLoading: PropTypes.bool.isRequired,
  deactivateLoading: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onChangeUser: PropTypes.func.isRequired,
  onDeactivateUser: PropTypes.func.isRequired,
  onLoadUser: PropTypes.func.isRequired,
  onSetUserOptionsAndLoad: PropTypes.func.isRequired,
};

UsersV2.defaultProps = {
  data: [],
};
