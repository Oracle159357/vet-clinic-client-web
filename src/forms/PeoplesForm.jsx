import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { MyCheckbox, MyInput } from '../components/form/customFormikComponents';
import './Form.css';

export default function PeoplesForm({
  initialData,
  onSubmit,
  statusOfDisable,
}) {
  return (
    <Formik
      initialValues={{
        name: initialData.name,
        married: initialData.married,
        date: initialData.date,
        weight: initialData.weight,
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
          label="Name: "
          name="name"
          type="text"
        />
        <MyInput
          label="Weight: "
          name="weight"
          type="number"
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

PeoplesForm.defaultProps = {
  initialData: {
    name: '',
    married: false,
    date: '2022-08-03',
    weight: 0,
  },
};

PeoplesForm.propTypes = {
  initialData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    married: PropTypes.bool.isRequired,
    id: PropTypes.string,
    weight: PropTypes.number.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  statusOfDisable: PropTypes.bool.isRequired,
};
