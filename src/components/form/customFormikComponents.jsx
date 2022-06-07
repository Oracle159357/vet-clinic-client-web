import { useField, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function FieldErrors({ name }) {
  const [field, meta] = useField(name);
  const { status } = useFormikContext();
  const [serverError, setServerError] = useState();
  useEffect(() => {
    setServerError(status && status[name]);
  }, [name, status]);

  useEffect(() => {
    setServerError(undefined);
  }, [field.value]);

  return (
    <>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
      {meta.touched && serverError ? (
        <div className="error">{serverError}</div>
      ) : null}
    </>
  );
}

FieldErrors.propTypes = {
  name: PropTypes.string.isRequired,
};

export function MyInput({ label, ...props }) {
  const [field] = useField(props);
  return (
    <>
      <label htmlFor={props.name}>{label}</label>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input className="text-input" {...field} {...props} />
      <FieldErrors name={props.name} />
      <br />
    </>
  );
}

export function MyCheckbox({ children, ...props }) {
  const [field] = useField({ ...props, type: 'checkbox' });
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="checkbox-input">
        {children}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input type="checkbox" {...field} {...props} />
      </label>
      <FieldErrors name={props.name} />
      <br />
    </div>
  );
}
MyInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
MyCheckbox.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};
