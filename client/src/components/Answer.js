import React, {useEffect, useState} from "react";
import Delayed from "./Delayed";

function Answer(props) {
    // duration wait
    // display button answers
    const [finish, setFinished] = useState(false);
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    const [over, setOver] = useState(false);
    const [topKids, setTopKids] = useState([]);
    const [time, setTime] = useState(5000);
    

    const answered = (answer) => {
        // some variable
        // emit index
        setFinished(true);
        console.log(answer);
        props.socket.emit('answer', {question, answer, socketId: props.socket.id});
    }

    useEffect(() => {

        props.socket.on('recieve-question', (data) => {
            setFinished(false);
            setTime(5000);
            setQuestion(data.question);
            setAnswers(data.answers);
        })

        props.socket.on('game-over', (data) => {
            setOver(true);
            setTopKids(data.top);
        })
    })

    return(
        <div>
            {over ? (
                <div>
                    <p>GAME OBER</p>
                    {topKids.map((kids, index) => (
                        <p key={index}>{kids}</p>
                    ))}
                </div>
            ): (
                <div>
                    {!finish ? (
                    <Delayed waitBeforeShow={time}>
                        <h1>{question}</h1>
                        {answers.map((answer, index) => (
                                <button key={index} onClick={() => answered(answer)}>{answer}</button>
                                ))}
                    </Delayed>
                ) : (
                    <p>Answered, waiting for host</p>
                )}
                </div>
            )}
        </div>   
    );
}

export default Answer