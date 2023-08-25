import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Start from './pages/Start';
import Host from './pages/Host';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/host' element={<Host />} />
      </Routes>
    </Router>
  );
}

export default App;
