import { useState } from 'react';
import NumberInput from './NumberInput.js';

import Constants from '../Constants.js';
import './FoulButtons.css';

const FoulButtons = ({
    foulBall,
    setFoulBall,
    redsRemaining,
    setRemoveReds,


    player1Score,
    player2Score,
    setPlayer1Score,
    setPlayer2Score,
    activePlayer,
    setIsAFoul,
    handleSwitchPlayer,
    setScoreDifference,
}) => {
    const [removed, setRemoved] = useState(0);

    const getFoulHandler = (colour) => {
        //const value = Constants.colourValues[colour] || 4;
        return () => {
            if (foulBall === colour) return setFoulBall(null);
            setFoulBall(colour);
        };
    }

    const handleFoulWhite = getFoulHandler('white');
    const handleFoulRed = getFoulHandler('red');
    const handleFoulYellow = getFoulHandler('yellow');
    const handleFoulGreen = getFoulHandler('green');
    const handleFoulBrown = getFoulHandler('brown');
    const handleFoulBlue = getFoulHandler('blue');
    const handleFoulPink = getFoulHandler('pink');
    const handleFoulBlack = getFoulHandler('black');

    const handleSubmit = function(event) {
        event.preventDefault();
    }

    const changeHandler = function(event, value) {
        setRemoved(value);
        setRemoveReds(value);
    }

    return(
        <>
            <div className="foul-buttons-container">
                <button className="white-button" disabled={foulBall && foulBall !== 'white'} onClick={handleFoulWhite}>white</button>
                <button className="red-button" disabled={foulBall && foulBall !== 'red'} onClick={handleFoulRed}>red</button>
                <button className="yellow-button" disabled={foulBall && foulBall !== 'yellow'} onClick={handleFoulYellow}>yellow</button>
                <button className="green-button" disabled={foulBall && foulBall !== 'green'} onClick={handleFoulGreen}>green</button>
                <button className="brown-button" disabled={foulBall && foulBall !== 'brown'} onClick={handleFoulBrown}>brown</button>
                <button className="blue-button" disabled={foulBall && foulBall !== 'blue'} onClick={handleFoulBlue}>blue</button>
                <button className="pink-button" disabled={foulBall && foulBall !== 'pink'} onClick={handleFoulPink}>pink</button>
                <button className="black-button" disabled={foulBall && foulBall !== 'black'} onClick={handleFoulBlack}>black</button>
            </div>
                <div className="remove-reds row">
                    <span>Remove reds</span>
                    <NumberInput
                        min={0}
                        max={redsRemaining}
                        value={removed}
                        onChange={changeHandler}
                    />
                </div>
        </>
    )

}

export default FoulButtons;