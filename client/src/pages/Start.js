import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/styles/Start.css';

function Start() {

  const sendMessage = () => {
    console.log("hello");
  }

  return (
    <center>
      <div className='centered'>
        <Link to="/host" className="button" onClick={sendMessage}>Start</Link>
      </div>
    </center>
  );
}

export default Start;