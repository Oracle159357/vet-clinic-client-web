import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Animals from 'pages/v1/Animals';
import Peoples from 'pages/v1/Peoples';
import PeoplesV2 from 'pages/v2/PeoplesV2';
import AnimalsV2 from 'pages/v2/AnimalsV2';
import UsersV2 from 'pages/v2/UsersV2';
import Layout from 'components/layout/Layout';
import store from 'store';
import Login from './pages/Login';

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
          <Route path="/" element={<PeopleAndAnimalsTableV1 />} />
          <Route path="/TableWithRT" element={<PeopleAndAnimalsTableV2 />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
