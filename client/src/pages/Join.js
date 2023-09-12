import React, { useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import io from 'socket.io-client';
import Answer from '../components/Answer';
// import '../pages/styles/Start.css';
const socket = io.connect("http://localhost:3001/");

function Join() {
    const [name, setName] = useState("");
    const [gamepin, setGamepin] = useState("");
    const [joining, setJoining] =  useState(true);
    const [playing, setPlaying] = useState(false);

    const joinGame = () => {
        socket.emit("join", {name, gamepin});

        // response from server
        socket.on('waiting', () => {
            console.log('joining id:' , socket.id);
            setJoining(false);
        });
    };

    useEffect(() => {
        socket.on('confirm-start', () =>{
            console.log("HOST STARTING GAME");
            // set state playing 
            setPlaying(true);
        })
        return () => {
            // Cleanup code, executed before the component unmounts.
            socket.off('confirm-start');
          };
    })
    
  return (
    <div>
        {joining ? (
            <center>
            Join Game
            <input placeholder='game pin' 
               onChange={(event) => {
                   setGamepin(event.target.value);
               }}/>
            <input placeholder='name' maxlength="10"
               onChange={(event) => {
                   setName(event.target.value);
               }} />
            <button onClick={joinGame}>Join!</button>
           </center>
        ): (
            <Waiting playing={playing}/>
        )}
    </div>
    
  );
}

export default Join;

function Waiting(props) {
    const navigate = useNavigate();
    const leave = () => {
        navigate(0);
    }
    return ( 
        <div>
            {props.playing ? (
                <Answer question="White Panda" answers={["answer 1", "ansWer 2", "answer 3", "answer 4"]} socket={socket}/>
            ): (
                <div>
                    <h1>Waiting Room</h1>
                    <p> waiting for the host to start</p>
                    <p> if you refresh or leave this page you will be disconnected</p>
                    <button onClick={leave}>Leave</button>
                </div>
            )}
            
        </div>        
     );
}

