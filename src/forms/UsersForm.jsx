import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { MyCheckbox, MyInput, MyPasswordInput } from '../components/form/customFormikComponents';
import './Form.css';

export default function UsersForm({
  initialData,
  onSubmit,
  statusOfDisable,
  isNew,
}) {
  return (
    <Formik
      initialValues={{ ...initialData, password: null }}
      validationSchema={Yup.object({
        username: Yup.string()
          .max(10, 'Must be 10 characters or less')
          .required('Required'),
        password: isNew
          ? Yup.string()
            .typeError('Password cannot be zero characters')
            .min(4, 'You must enter a password consisting of at least four characters')
          : Yup.string()
            .min(4, 'You must enter a password consisting of at least four characters')
            .nullable(true),
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
        <MyPasswordInput
          label="Password: "
          name="password"
          type="password"
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
    password: null,
    isActive: false,
    isAdmin: false,
  },
};

UsersForm.propTypes = {
  initialData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    id: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  statusOfDisable: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
};
