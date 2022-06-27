import React from 'react';
import './App.css';

import Map from './components/Map';


function App() {

  return (
    <div className="App" style={{
      display: 'flex',
      width: '100%',
      height: '100vh'
    }}>
      <div className="side-bar" style={{
        border: '1px solid red',
        boxSizing: 'border-box',
        width: '25%'
      }}>SideBar</div>
      <Map />
    </div>
  );
}

export default App;
