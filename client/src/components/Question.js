import React, { useEffect, useState } from "react";
import ProgressTimer from './ProgressBar';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import './styles/Question.css';

function Question(props) {
    const [progressFinished, setProgressFinished] = useState(false);
    const [question, setQuestion] = useState("");
    const [start, setStart] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [top, setTop] = useState([]);
    const [over, setOver] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const gamepin = props.gamepin;

   useEffect(() => {
    console.log(gamepin);
    props.socket.emit('question', {gamepin});
    // recieve question
    props.socket.on('recieve-question', (data) => {
      setQuestion(data.question);
      setAnswers(data.answers);
      setCorrectAnswer(data.correctAnswer);
    });
   }, [])
    
    const loadingComplete = () => {
        console.log("Loading Has Finished! Display question + answers now")
        // remove progress bar show answers
        setProgressFinished(true);
        setStart(false);

    }

    const nextQ = () => {
        setProgressFinished(false);
        setStart(true);
        props.socket.emit('question', {gamepin});
        props.socket.on('game-over', (data) => {
            setTop(data.top);
            setOver(true);
        })
        // recieve question
        props.socket.on('recieve-question', (data) => {
            setQuestion(data.question);
            setAnswers(data.answers);
        });
    }
    
    const timeComplete = () => {
        const correctAnswer = document.querySelector('.correct');

        if (correctAnswer) {
            // Change the background color to green
            correctAnswer.style.background = '#99FF75';
          }

        return { shouldRepeat: true, delay: 1 };
    }

    return(
        <div>
            {over ? (
                <div>
                    <p>over</p>
                    {top.map((kids,index) => (
                        <li key={index}>{kids}</li>
                    ))}
                </div>
            ): (
            <div>
                <div className="card-container">
                    <div className="card">
                        <div className="question">{question}</div>
                        <div className="stats">
                            <CountdownCircleTimer
                                isPlaying={progressFinished}
                                duration={10}
                                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                                colorsTime={[10, 6, 3, 0]}
                                size={70}
                                strokeWidth={5}
                                onComplete={timeComplete}
                                />
                            <button className="next-btn" onClick={nextQ}>Next</button>
                        </div>
                    </div>
                    <div className="card rotate"></div>
                </div>
                <div className="bar">
                    {!progressFinished ? (
                        <ProgressTimer label="" duration={5} onFinish={loadingComplete} 
                        started={start} color="#343434" 
                        showDuration={false} />
                    ) : (
                        <div className="answerContainer">
                            {answers.map((answer, index) => (
                            <div className= {`answers ${answer === correctAnswer ? 'correct' : ''}`}
                             key={index}>{answer}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
    );
}

export default Question;