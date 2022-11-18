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
      <Provider store={store}>
        <PeoplesV2 />
        <AnimalsV2 />
        <UsersV2 />
      </Provider>
    </div>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<PeopleAndAnimalsTableV1 />} />
          <Route path="/TableWithRT" element={<PeopleAndAnimalsTableV2 />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
