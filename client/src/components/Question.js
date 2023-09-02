import React, { useEffect, useState } from "react";
import ProgressTimer from './ProgressBar'

function Question(props) {
    const [progressFinished, setProgressFinished] = useState(false);
    const [question, setQuestion] = useState("");
    const [start, setStart] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [top, setTop] = useState([]);
    const [over, setOver] = useState(false);
    const gamepin = props.gamepin;

   useEffect(() => {
    console.log(gamepin);
    props.socket.emit('question', {gamepin});
    // recieve question
    props.socket.on('recieve-question', (data) => {
      setQuestion(data.question);
      setAnswers(data.answers);
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
                <h1>{question}</h1>
                {!progressFinished ? (
                    <ProgressTimer label="" duration={5} onFinish={loadingComplete} 
                    started={start} color="#343434" 
                    showDuration={false} />
                ) : (
                    <div>
                        {answers.map((answer, index) => (
                        <li key={index}>{answer}</li>
                        ))}
                        <button onClick={nextQ}>Next</button>
                    </div>
                )}
            </div>
            )}
        </div>
    );
}

export default Question;