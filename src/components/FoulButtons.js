import React from 'react';

// import './FoulButtons.css';

const FoulButtons = ({
    player1Score,
    player2Score,
    setPlayer1Score,
    setPlayer2Score,
    activePlayer,
    setIsAFoul,
    handleSwitchPlayer,
    setScoreDifference,
}) => {
    const getFoulHandler = (value) => {
        return () => {
            if(activePlayer === 1) setPlayer2Score(player2Score += value);
            else setPlayer1Score(player1Score += value);
            setScoreDifference(Math.abs(player1Score - player2Score));
            setIsAFoul(false);
            handleSwitchPlayer();
        };
    }

    const handleFoulRed = getFoulHandler(4);
    const handleFoulYellow = getFoulHandler(4);
    const handleFoulGreen = getFoulHandler(4);
    const handleFoulBrown = getFoulHandler(4);
    const handleFoulBlue = getFoulHandler(5);
    const handleFoulPink = getFoulHandler(6);
    const handleFoulBlack = getFoulHandler(7);

    return(
        <>
        {/* <div className="foul-buttons-container"> */}
            {/* <div className="foul-balls-button-container"> */}
                <button className="red-button" onClick={handleFoulRed}>FOUL RED</button>
                <button className="yellow-button" onClick={handleFoulYellow}>FOUL YELLOW</button>
                <button className="green-button" onClick={handleFoulGreen}>FOUL GREEN</button>
                <button className="brown-button" onClick={handleFoulBrown}>FOUL BROWN</button>
                <button className="blue-button" onClick={handleFoulBlue}>FOUL BLUE</button>
                <button className="pink-button" onClick={handleFoulPink}>FOUL PINK</button>
                <button className="black-button" onClick={handleFoulBlack}>FOUL BLACK</button>
            {/* </div> */}
        {/* </div> */}
        </>
    )

}

export default FoulButtons;