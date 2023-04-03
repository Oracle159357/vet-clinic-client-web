import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login } from 'store/login/login';
import LoginForm from '../forms/LoginForm';

const mapStateToProps = ({ login }) => ({
  loginLoading: login.loading,
});

const mapDispatchToProps = {
  onLogin: login,
};

function Login(
  {
    onLogin,
    loginLoading,
  },
) {
  const navigate = useNavigate();

  const onLoginClick = useCallback(
    async (username, password) => {
      const dataFromAPi = await onLogin(username, password);
      if (dataFromAPi.error === undefined) {
        navigate('/');
        return undefined;
      }
      return dataFromAPi.payload;
    },
    [onLogin, navigate],
  );

  return (
    <div>
      <LoginForm
        onSubmit={onLoginClick}
        statusOfDisable={loginLoading}
      />
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loginLoading: PropTypes.bool.isRequired,
};
