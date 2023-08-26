import React from 'react';
import {useState} from 'react'
import io from 'socket.io-client';
// import '../pages/styles/Start.css';
const socket = io.connect("http://localhost:3001/");

function Join() {
    const [name, setName] = useState("");
    const [gamepin, setGamepin] = useState("");

    const joinGame = () => {
        socket.emit("join", {name, gamepin});

        // response from server
        socket.on('playerJoined', (data) => {
            console.log('Player joined:', data.playerName);
        });
    };

  return (
    <center>
     Join Game
     <input placeholder='game pin' 
        onChange={(event) => {
            setGamepin(event.target.value);
        }}/>
     <input placeholder='name' 
        onChange={(event) => {
            setName(event.target.value);
        }} />
     <button onClick={joinGame}>Join!</button>
    </center>
  );
}

export default Join;