import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { MyInput, PeopleSelect } from '../components/form/customFormikComponents';
import './Form.css';

export default function AnimalsForm({
  initialData,
  onSubmit,
  statusOfDisable,
}) {
  return (
    <Formik
      initialValues={initialData}
      validationSchema={Yup.object({
        dogName: Yup.string()
          .max(10, 'Must be 10 characters or less')
          .required('Required'),
        height: Yup.number().test(
          'maxDigitsAfterDecimal',
          'number field must have 2 digits after decimal or less',
          (number) => /^\d+(\.\d{1,2})?$/.test(number),
        ),
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
          label="Dog name: "
          name="dogName"
          type="text"
        />
        <MyInput
          label="Height: "
          name="height"
          type="number"
        />
        <MyInput
          label="Date: "
          name="date"
          type="date"
        />
        <PeopleSelect
          label="Owner Animal: "
          name="ownerId"
          placeholder="Choose the owner of your animal"
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
AnimalsForm.defaultProps = {
  initialData: {
    dogName: '',
    height: 1,
    date: '2022-08-03',
    ownerId: null,
  },
  statusOfDisable: false,
};

AnimalsForm.propTypes = {
  initialData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    dogName: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    idKey: PropTypes.string,
    ownerId: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  statusOfDisable: PropTypes.bool,
};
