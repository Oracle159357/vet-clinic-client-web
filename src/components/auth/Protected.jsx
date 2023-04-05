import { Navigate } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

export default function Protected({ children }) {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};
