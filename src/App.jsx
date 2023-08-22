import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Animals from 'pages/v1/Animals';
import Peoples from 'pages/v1/Peoples';
import PeoplesV2 from 'pages/v2/PeoplesV2';
import AnimalsV2 from 'pages/v2/AnimalsV2';
import UsersV2 from 'pages/v2/UsersV2';
import Layout from 'components/layout/Layout';
import store from 'store';
import Login from 'pages/Login';
import Protected from 'components/auth/Protected';

function PeopleAndAnimalsTableV1() {
  return (
    <div>
      <Peoples />
      <Animals />
    </div>
  );
}
function PeopleAndAnimalsTableV2() {
  return (
    <div>
      <PeoplesV2 />
      <AnimalsV2 />
      <UsersV2 />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/TableWithRT" />} />
          <Route
            path="TableWithNoRT"
            element={
              (
                <Protected>
                  <PeopleAndAnimalsTableV1 />
                </Protected>
              )
          }
          />
          <Route
            path="TableWithRT"
            element={
              (
                <Protected>
                  <PeopleAndAnimalsTableV2 />
                </Protected>
              )
          }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/TableWithRT" replace />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
