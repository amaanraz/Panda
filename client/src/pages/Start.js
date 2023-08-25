import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/styles/Start.css';

function Start() {
  return (
    <center>
      <div className='centered'>
        <Link to="/host" className="button">Start</Link>
      </div>
    </center>
  );
}

export default Start;