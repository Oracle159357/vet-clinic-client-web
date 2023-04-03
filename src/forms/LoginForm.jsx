import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { MyInput, MyPasswordInput } from '../components/form/customFormikComponents';
import './Form.css';

export default function LoginForm({
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
        password: Yup.string()
          .typeError('Password cannot be zero characters')
          .min(4, 'You must enter a password consisting of at least four characters'),
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

LoginForm.defaultProps = {
  initialData: {
    username: '',
    password: null,
  },
};

LoginForm.propTypes = {
  initialData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  statusOfDisable: PropTypes.bool.isRequired,
};
