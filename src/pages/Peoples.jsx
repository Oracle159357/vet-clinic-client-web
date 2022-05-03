import React, { useMemo, useState } from 'react';
import * as Yup from 'yup';
import './People.css';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import {
  getData1, deleteFromData1ByIds, addFromData1, changeFromData1,
} from '../api';
import Table from '../Table';
import { useCustomButton, useData } from './hooks';
import { useModal, Modal } from './modal';
import { MyInput, MyCheckbox } from './customFormikComponent';

function PeopleForm({
  initialData,
  onSubmit,
}) {
  return (
    <Formik
      initialValues={{
        name: initialData.name,
        married: initialData.married,
        date: initialData.date,
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .max(10, 'Must be 10 characters or less')
          .required('Required'),
        // married: Yup.boolean()
        //   .required('Required')
        //   .oneOf([true], 'You must accept the terms and conditions.'),
      })}
      onSubmit={async (values, actions) => {
        const res = await onSubmit({
          ...initialData, ...values,
        });
        if (res) {
          actions.setSubmitting(false);
          actions.setStatus({
            name: res.errors.name,
          });
        }
      }}
    >
      <Form>
        <MyInput
          label="Name: "
          name="name"
          type="text"
        />
        <MyCheckbox
          name="married"
        >
          Married:
        </MyCheckbox>
        <MyInput
          label="Date: "
          name="date"
          type="date"
        />
        <button className="button-submit" type="submit">Submit</button>
      </Form>
    </Formik>
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
