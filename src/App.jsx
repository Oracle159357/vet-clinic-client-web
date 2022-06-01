import React from 'react';
import './App.css';
import Animals from './pages/Animals';
import Peoples from './pages/Peoples';
import PeoplesV2 from './pages/PeoplesV2';
import AnimalsV2 from './pages/AnimalsV2';

function App() {
  return (
    <div>
      <PeoplesV2 />
      <AnimalsV2 />
      <Peoples />
      <hr />
      <Animals />
    </div>
  );
}

export default App;
