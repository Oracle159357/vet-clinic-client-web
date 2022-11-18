import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { MyCheckbox, MyInput } from '../components/form/customFormikComponents';
import './Form.css';

export default function UsersForm({
  initialData,
  onSubmit,
  statusOfDisable,
}) {
  return (
    <Formik
      initialValues={initialData}
      validationSchema={Yup.object({
        username: Yup.string()
          .max(10, 'Must be 10 characters or less')
          .required('Required'),
      })}
      onSubmit={async (values, actions) => {
        const errors = await onSubmit({
          ...initialData, ...values,
        });
        if (errors) {
          actions.setSubmitting(false);
          actions.setStatus({
            ...errors,
          });
        }
      }}
    >
      <Form>
        <MyInput
          label="Username: "
          name="username"
          type="text"
        />
        <MyInput
          label="Password: "
          name="password"
          type="text"
        />
        <MyCheckbox
          name="isAdmin"
        >
          IsAdmin:
        </MyCheckbox>
        <MyCheckbox
          name="isActive"
        >
          IsActive:
        </MyCheckbox>
        <button
          disabled={statusOfDisable}
          type="submit"
          className={`button-submit ${statusOfDisable ? 'disabled' : ''}`}
        >
          Submit
        </button>
      </Form>
    </Formik>
  );
}

UsersForm.defaultProps = {
  initialData: {
    username: '',
    password: '',
    isActive: false,
    IsAdmin: false,
  },
};

UsersForm.propTypes = {
  initialData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    IsAdmin: PropTypes.bool.isRequired,
    id: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  statusOfDisable: PropTypes.bool.isRequired,
};
