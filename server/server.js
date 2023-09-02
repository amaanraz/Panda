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
let userPlayerPoints = {};
var currentQIndex = -1;
// socket id: [name, score, gamepin]
// user connection
io.on("connection", (socket) => {
  // host game
  socket.on("host-game", (hostData) => {
    const gamepin = generateGamePin();
    currentQIndex = -1;
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
      games[gamepin].players.push({ name: data.name, socketId: socket.id, socket: socket});
      socket.join(gamepin);
      io.to(games[gamepin].host.socketId).emit('playerJoined', { players: data.name });

      // add to active players
      activePlayers[socket.id]= {
        name: data.name,
        gamepin: data.gamepin,
      };

      userPlayerPoints[socket.id] = [data.name,0,data.gamepin];

      // for the join front end to get a message
      socket.emit('waiting', {gamepin});
    } else {
      // game doesnt exist
      console.log("Game not found");
    }
  })

  // host starts game
  socket.on('start', (data) => {
    const gamepin = data.gamepin;
    if(games[gamepin]){
      const roomName = JSON.stringify(gamepin);
      io.to(roomName).emit('confirm-start');
    }
  })

  // recive question request
  socket.on('question', (data) => {
    var question = "";
    currentQIndex++;
    const roomName = JSON.stringify(data.gamepin);
    
    if(currentQIndex >= questions.length){
      question = "REACHED END LOSER";
      // sort userPoints, emit an end game event passing top players.
      const sortedValues = Object.values(userPlayerPoints).sort(([, a], [, b]) => b - a)
      const top5 = sortedValues.slice(0, 5)
      socket.emit('game-over', {top: top5})
      io.to(roomName).emit('game-over', {top: top5});
    } else {
      question = questions[currentQIndex].text
      var answers = questions[currentQIndex].answers;
      socket.emit('recieve-question', {question, answers})
      io.to(roomName).emit('recieve-question', {question, answers});
    }
  })

  // recieve an answer
  socket.on('answer', (data) => {
    // check the question via data.question and check correct answer and do accordingly
    if(data.answer == questions[currentQIndex].correctAnswer){
      userPlayerPoints[data.socketId][1]++;
      // console.log(data.socketId, " :", userPlayerPoints[data.socketId][1])
    }
  })

  // user disconnects
  socket.on('disconnect', () => {
    if(activePlayers[socket.id]){
      const gamepin = activePlayers[socket.id].gamepin;
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

const questions = [{
  text: "In Spain, people eat 12 ____ right before midnight. One for each bell strike.",
  time: 10,
  answers: [
      "olives",
      "tapas",
      "grapes",
      "pieces of bread"
  ],
  correctAnswer: "grapes"
},
{
  text: "Which country has a giant hour glass wheel that needs to be turned on its head at midnight?",
  time: 10,
  answers: [
      "Hungary",
      "Romania",
      "Belgium",
      "Switzerland"
  ],
  correctAnswer: "Hungary"
},
{
  text: "In Belgium, kids prepare ______ in school for their grandparents and godparents.",
  time: 10,
  answers: [
      "small gifts",
      "party crowns and hats",
      "songs",
      "New Year's letters"
  ],
  correctAnswer: "New Year's letters"
},
{
  text: "Which country calls New Year's Eve Hogmanay?",
  time: 10,
  answers: [
      "Ireland",
      "Scotland",
      "Greenland",
      "England"
  ],
  correctAnswer: "Scotland"
},
{
  text: "People in Finland predict what'll happen in the new year by _______.",
  time: 10,
  answers: [
      "reading tea leaves",
      "reading palms",
      "casting molten tin into water and interpreting the shape",
      "visiting fortune tellers"
  ],
  correctAnswer: "casting molten tin into water and interpreting the shape"
},
{
  text: "What is baked into sweets as a good luck token in Bolivia?",
  time: 10,
  answers: [
      "Pomegranate seeds",
      "Grapes",
      "Almonds",
      "Coins"
  ],
  correctAnswer: "Coins"
},
{
  text: "In which city in the U.S. do millions of people gather to watch the ball drop at midnight?",
  time: 10,
  answers: [
      "New York City, NY",
      "Washington, D.C.",
      "Austin, TX",
      "Dallas, TX"
  ],
  correctAnswer: "New York City, NY"
},
{
  text: "In Russia, people write down wishes on paper. What do they do with them afterwards?",
  time: 10,
  answers: [
      "Put them in a jar and keep it closed for a year.",
      "Burn them, throw it in a Champagne glass and drink it.",
      "Burn them in the fire place.",
      "Tie them to balloons and let them fly away."
  ],
  correctAnswer: "Burn them, throw it in a Champagne glass and drink it."
},
{
  text: "People in Colombia believe that _____ will increase their chances to travel in the new year.",
  time: 10,
  answers: [
      "packing their suitcases by midnight",
      "making a wish on their passports",
      "buying a new suitcase by midnight",
      "running around the block with their suitcases"
  ],
  correctAnswer: "running around the block with their suitcases"
},
{
  text: "Why do Ecuadorians burn homemade puppets at midnight?",
  time: 10,
  answers: [
      "It's a replacement for fireworks, as those are illegal.",
      "To burn away the old year and start with a clean slate.",
      "They believe puppets are evil.",
      "To protect themselves against spirits."
  ],
  correctAnswer: "To burn away the old year and start with a clean slate."
},
]
