import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Start from './pages/Start';
import Host from './pages/Host';
import Join from './pages/Join';

// const socket = io.connect("http://localhost:3001/");

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/host' element={<Host />} />
        {/* TODO: RENAME JOIN STUFF TO PLAY */}
        <Route path='/join' element={<Join />}/>
      </Routes>
    </Router>
  );
}

export default App;
