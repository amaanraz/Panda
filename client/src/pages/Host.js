import React from 'react';
import {useEffect, useState} from 'react';
import io from 'socket.io-client';

// import '../pages/styles/Start.css';

const socket = io.connect("http://localhost:3001/");

function Host() {
  const [names, setNames] = useState([]);
  const [gamepin, setGamepin] = useState("");

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
      console.log(data.players);
    });

    socket.on('playerDisconnected', (data) => {
      setNames((prevPlayerNames) =>
        prevPlayerNames.filter((name) => name !== data.playerName)
      );
    });

  }, [socket])

  return (
    <center>
      <h1>Hosting at: #{gamepin}</h1>
      <h2>Players:</h2>
        <p>
          {names.map((playerName, index) => (
            <li key={index}>{playerName}</li>
          ))}
        </p>
      {/* <p>{names}</p> */}
    </center>
  );
}

export default Host;