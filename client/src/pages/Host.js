import React from 'react';
import {useEffect, useState} from 'react';
import io from 'socket.io-client';
import Question from '../components/Question';
import './styles/Host.css'
// import '../pages/styles/Start.css';

const socket = io.connect("http://localhost:3001/");

function Host() {
  const [names, setNames] = useState([]);
  const [gamepin, setGamepin] = useState("");
  const [start, setStart] = useState(false);
  const [players, setPlayers] = useState(0);
  

  // get gamepin (once at start)
  useEffect(() => {
    console.log("EMIT AT START");
    socket.emit("host-game", { name: "host" });

    socket.on("gameCreated", (data) => {
      setGamepin(data.gamepin);
    })
  }, []);

  useEffect(() => {
    socket.on("playerJoined", (data) => {
      // players.push(data.message);
      setNames((prevPlayerNames) => [...prevPlayerNames,data.players]);
      setPlayers(data.numOfPlayers);
    });

    socket.on('playerDisconnected', (data) => {
      setNames((prevPlayerNames) =>
        prevPlayerNames.filter((name) => name !== data.playerName)
      );
      setPlayers(data.numOfPlayers);
    });

  }, [socket]);

  // start game
  const startGame = () => {
    // only start game if at least 1 player in
    if(players >= 1){
      socket.emit('start', {gamepin});
      setStart(true); 
    } else {
      // can show error if u want in
      console.log("need more players loser");
    }
  }


  return (
    <div>
      {!start ? (
        <center>
          <div className='center-box'>
            <div className='small'>Hosting at: </div>
            <div className='code'>#{gamepin}</div>
          </div>
          <div className='line'></div>
          <div className='row'>
            <div className='small'>Players Joined: {players}</div>
            <button className='button' onClick={startGame}>Start</button>
          </div>
          <div className='container'>
              
                {names.map((playerName, index) => (
                  <div className='names' key={index}>{playerName}</div>
                ))}
              
          </div>
      </center>
      ) : (
        <div>
          <Question answers={["answer 1", "ansWer 2", "answer 3", "answer 4"]} socket={socket} gamepin={gamepin}/>
        </div>
      )}
    </div>
  );
}

export default Host;