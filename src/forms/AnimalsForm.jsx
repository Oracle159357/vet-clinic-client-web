import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { MyInput } from '../components/form/customFormikComponents';
import './Form.css';

export default function AnimalsForm({
  initialData,
  onSubmit,
}) {
  return (
    <Formik
      initialValues={{
        dogName: initialData.dogName,
        height: initialData.height,
        date: initialData.date,
      }}
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
      onSubmit={(values) => {
        onSubmit({
          ...initialData, ...values,
        });
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
        <button className="button-submit" type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
AnimalsForm.defaultProps = {
  initialData: { dogName: '', height: 1, date: '2022-08-03' },
};

AnimalsForm.propTypes = {
  initialData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    dogName: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    idKey: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};
