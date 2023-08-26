const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');


// middleware
app.use(cors());

// set up io socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Define routes and APIs here

const games = {};
const activePlayers = {};
// user connection
io.on("connection", (socket) => {
  
  // host game
  socket.on("host-game", (hostData) => {
    const gamepin = 12345;
    // TODO: add checking if game exists via game pin
    games[gamepin] = {
      host: { name: hostData.name, socketId: socket.id },
      players: [],
    };

    // send gamepin to front end
    socket.emit('gameCreated', { gamepin });
  })

  // listen for players joining
  socket.on("join", (data) => {
    const gamepin = data.gamepin;
    if(games[gamepin]){
      games[gamepin].players.push({ name: data.name, socketId: socket.id });
      io.to(games[gamepin].host.socketId).emit('playerJoined', { players: data.name });

      // add to active players
      activePlayers[socket.id]= {
        name: data.name,
        gamepin: data.gamepin,
      };

    } else {
      // game doesnt exist
      console.log("Game not found");
    }
  })

  // user disconnects
  socket.on('disconnect', () => {
    if(activePlayers[socket.id]){
      const gamepin = activePlayers[socket.id].gamepin;
      console.log("disconnected");
      // send disconnected player name to the front end
      io.to(games[gamepin].host.socketId).emit('playerDisconnected', { playerName: activePlayers[socket.id].name })
      delete activePlayers[socket.id];
    }
  })
})

server.listen(3001, () =>{
  console.log("Server online at 3001");
})

function generateGamePin(){
  return Math.floor(Math.random()*90000) + 10000;;
}

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
