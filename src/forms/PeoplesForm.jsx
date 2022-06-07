import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { MyCheckbox, MyInput } from '../components/form/customFormikComponents';
import './Form.css';

export default function PeoplesForm({
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

PeoplesForm.defaultProps = {
  initialData: { name: '', married: false, date: '2022-08-03' },
};

PeoplesForm.propTypes = {
  initialData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    married: PropTypes.bool.isRequired,
    id: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};
