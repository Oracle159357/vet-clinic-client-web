import React from 'react';
import './App.css';
import Animals from './pages/Animals';
import Peoples from './pages/Peoples';
import PeopleV2 from './pages/PeopleV2';

function App() {
  return (
    <div>
      <PeopleV2 />
      <Peoples />
      <hr />
      <Animals />
    </div>
  );
}

export default App;
