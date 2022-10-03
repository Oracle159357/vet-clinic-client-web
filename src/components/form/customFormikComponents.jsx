import { useField, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { loadListOfPeople } from 'api';
import { convertToDateServer, convertToDateUI } from 'utils/convertDate';

import './customFormikComponents.css';

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

export function MyDateInput(props) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const currentTimeZone = 'Europe/Kiev';

  return (
    <MyInput
      {...props}
      value={convertToDateUI(field.value, currentTimeZone)}
      onChange={(event) => {
        const dateToServer = convertToDateServer(event.target.value, currentTimeZone);
        return setFieldValue(field.name, dateToServer);
      }}
    />
  );
}

MyInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

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

export function MySelect({ label, isLoading, ...props }) {
  const [field, , helper] = useField({ ...props });
  return (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <select
        style={{ width: '50%' }}
        disabled={isLoading}
        {...field}
        value={field.value === null ? '' : field.value}
        {...props}
      >
        {isLoading ? <option value="">Loading</option> : (
          <>
            <option key="placeholder" value="" disabled>{props.placeholder}</option>
            {/* eslint-disable-next-line react/prop-types */}
            {props.children}
          </>
        )}
      </select>
      {isLoading ? <div className="lds-dual-ring" /> : null}
      {
        (field.value === null || isLoading)
          ? null
          : <button type="button" onClick={() => helper.setValue(null)}>X</button>
      }
      <FieldErrors name={props.name} />
    </div>
  );
}

export function PeopleSelect({ name, label, placeholder }) {
  const [allPeoples, setAllPeoples] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setAllPeoples(await loadListOfPeople());
      setIsLoading(false);
    })().catch((error) => {
      throw error;
    });
  }, []);

  return (
    <div>
      <MySelect
        label={label}
        name={name}
        isLoading={isLoading}
        placeholder={placeholder}
      >
        {!isLoading ? allPeoples?.map((people) => (
          <option key={people.id} value={people.id}>{people.name}</option>
        )) : null}
      </MySelect>
    </div>
  );
}

MyCheckbox.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

MySelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
};

PeopleSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};
