import React, { useState, useEffect	} from 'react';
import _ from 'lodash';
import swal	from '@sweetalert/with-react'
import './ButtonsComponent.css';
import FoulButtons from	"./FoulButtons.js";

const defaultEndSequence = [
	'yellow',
	'green',
	'brown',
	'blue',
	'pink',
	'black'
];

const Buttons = ({
	player1Score,
	player2Score,
	activePlayer,
	setPlayer1Score,
	setPlayer2Score,
	setActivePlayer,
	player1Break,
	player2Break,
	setPlayer1Break,
	setPlayer2Break,
	player1Breaks,
	setPlayer1Breaks,
	player2Breaks,
	setPlayer2Breaks,
	player1Frames,
	player2Frames,
	setPlayer1Frames,
	setPlayer2Frames,
	setPlayer1Name,
	setPlayer2Name,
	setMatchDuration,
	setIsMatchSetUp,
	player1Name,
	player2Name,
	matchDuration,
	setFirstBreaker,
	firstBreaker,
	numberOfReds,
	setPointsRemaining,
	setScoreDifference,
}) => {

	const [isAFoul, setIsAFoul] = useState(false)
	const [isOnColour, setIsOnColour] = useState(false)
	const [redsRemaining, setRedsRemaining] = useState(numberOfReds)

	const [endSequence, setEndSequence] = useState(defaultEndSequence.slice());

	const endSequenceRemainder = [
		7, 6, 5, 4, 3, 2
	];

// useEffect(()	=> {

//	   const matchWin =	((parseInt(matchDuration) +	1 )	/ 2)
//	   console.log("player1frames",	player1Frames)
//	   console.log("player2frames",	player2Frames)
//	   if (player1Frames === matchWin || player2Frames === matchWin	){
//		   if (player1Frames > player2Frames) {
//			   alert( player1Name +	" has won!")
//		   } else if (player2Frames	> player1Frames){
//			   alert(player2Name + " has won!")
//		   } else {
//			   alert("It is	a draw!")
//		   }
//		   handleEndMatch()
//	   }

// }, [player1Frames, player2Frames])

	// no more reds, and the colour for the last red has been potted
	const inEndSequence = () => {
		return redsRemaining == 0 && ! isOnColour;
	}

	const handleEndSequence = () => {
		endSequence.shift();
		setEndSequence(endSequence);
		if (endSequence.length === 0) {
			handleEndFrame();
		}
		else setPointsRemaining(_.sum(endSequenceRemainder.slice(0, endSequence.length)));
	}

	const addScore = (value) => {
		if (activePlayer === 1) {
			setPlayer1Score(player1Score += value);
			setPlayer1Break(player1Break + value)
		}
		else {
			setPlayer2Score(player2Score += value);
			setPlayer2Break(player2Break + value)
		}

		setScoreDifference(Math.abs(player1Score - player2Score));
	}

	// red got potted
	const handleRed = () =>	{
		addScore(1);
		setIsOnColour(true);
		let remaining = redsRemaining - 1;
		setRedsRemaining(remaining);
		setPointsRemaining(remaining * 8 + 27)
	}

	const getPotHandler = (value) => {
		return () => {
			addScore(value);
			if (inEndSequence()) handleEndSequence();
			else setIsOnColour(false);
		}
	}

	const handleYellow = getPotHandler(2);
	const handleGreen = getPotHandler(3);
	const handleBrown =	getPotHandler(4);
	const handleBlue = getPotHandler(5);
	const handlePink = getPotHandler(6);
	const handleBlack = getPotHandler(7);

	const handleEndFrame = () => {
		
		if (player1Score > player2Score){
			setPlayer1Frames(player1Frames += 1)
			setPlayer1Score(0)
			setPlayer2Score(0)
		} else if (player2Score	> player1Score){
			setPlayer2Frames(player2Frames += 1)
			setPlayer1Score(0)
			setPlayer2Score(0)
		}
		const matchWin = ((parseInt(matchDuration) + 1 ) / 2)
		//	  console.log(matchWin)
		//	  console.log(player1Frames)
		//	  console.log(player2Frames)
			
		handleSwitchPlayer()

		if(firstBreaker === player1Name){
			setFirstBreaker(player2Name)
			setActivePlayer(2)
		} else {
			setFirstBreaker(player1Name)
			setActivePlayer(1)
		}

		if (player1Frames === matchWin || player2Frames	===	matchWin ){
			handleEndMatch();
		}

		setRedsRemaining(numberOfReds);
		setEndSequence(defaultEndSequence.slice());
	}

	const setPlayer1Active = () => {
		setActivePlayer(1)
		let highBreaks = player2Breaks
		highBreaks.push(player2Break)
		highBreaks.sort((a,	b) => b	- a)
		setPlayer2Breaks(highBreaks)
		setPlayer2Break(0)
	}

	const setPlayer2Active = () => {
		setActivePlayer(2)
		let highBreaks = player1Breaks
		highBreaks.push(player1Break)
		highBreaks.sort((a,	b) => b	- a)
		setPlayer1Breaks(highBreaks)
		setPlayer1Break(0) 
	}

	const handleSwitchPlayer = () => {
		if(activePlayer === 1) setPlayer2Active();
		else setPlayer1Active();
	}

	const finaliseMatch = () => {
		setIsMatchSetUp(false);
	}

	const handleEndMatch = () => {
		if (player1Frames > player2Frames) {
			swal(<h1 className="alert">{player1Name} has won the match <br/> {player1Frames} : {player2Frames}</h1>)
				.then(finaliseMatch);
		} else if (player2Frames > player1Frames){
			swal(<h1 className="alert">{player2Name} has won the match <br/> {player2Frames} : {player1Frames}</h1>)
				.then(finaliseMatch);
		} else {
			swal(<h1 className="alert">Match ends in a draw!</h1>)
				.then(finaliseMatch);
		}

/*
		// resets
		setPlayer1Score(0)
		setPlayer2Score(0)
		setPlayer1Break(0)
		setPlayer2Break(0)
		setPlayer1Breaks([])
		setPlayer2Breaks([])
		setPlayer1Frames(0)
		setPlayer2Frames(0)
		setPlayer1Name("")
		setPlayer2Name("")
		setMatchDuration(1)
		setIsMatchSetUp(false)
		setFirstBreaker('random')
*/
	}

	// toggle foul state
	const handleFoul = () => {
		// a new foul!
		if (!isAFoul) setIsOnColour(false);

		setIsAFoul(!isAFoul);
	}

	const foulButton = <button	className="foul-button"	onClick={handleFoul}>FOUL</button>;

	const getFoulButtons = () => {
		return <>
			{foulButton}
			<FoulButtons 
				player1Score={player1Score}
				player2Score={player2Score}
				setPlayer1Score={setPlayer1Score}
				setPlayer2Score={setPlayer2Score}
				activePlayer={activePlayer}
				setIsAFoul={setIsAFoul}
				setActivePlayer={setActivePlayer}
				handleSwitchPlayer={handleSwitchPlayer}
				setScoreDifference={setScoreDifference}
			/>
		</>;
	}

	const getRedButtons = () => {
		return <> 
			<button className="red-button" onClick={handleRed}>{redsRemaining}</button>
			{foulButton}
		</>;
	}

	const yellowButton = <button className="yellow-button" onClick={handleYellow}>YELLOW</button>;
	const greenButton = <button className="green-button" onClick={handleGreen}>GREEN</button>;
	const brownButton = <button className="brown-button" onClick={handleBrown}>BROWN</button>;
	const blueButton = <button className="blue-button"	onClick={handleBlue}>BLUE</button>;
	const pinkButton = <button className="pink-button"	onClick={handlePink}>PINK</button>;
	const blackButton = <button className="black-button" onClick={handleBlack}>BLACK</button>;
	const colourButtons = {
		yellow: yellowButton,
		green: greenButton,
		brown: brownButton,
		blue: blueButton,
		pink: pinkButton,
		black: blackButton,
	};

	const getColourButtons = () => {
		return <> 
			{yellowButton}
			{greenButton}
			{brownButton}
			{blueButton}
			{pinkButton}
			{blackButton}
			{foulButton}
		</>;
	}

	const getEndSequenceButtons = () => {
		return <> 
			{colourButtons[endSequence[0]]}
			{foulButton}
		</>;
	}

	const getInPlayButtons = _.cond([
		[() => isOnColour, getColourButtons],
		[inEndSequence, getEndSequenceButtons],
		[_.stubTrue, getRedButtons]
	]);

	const buttons = _.cond([
		[() => isAFoul, getFoulButtons],
		[_.stubTrue, getInPlayButtons]
	]);

	return (
		<div className="buttons-container">
			<div className={(isOnColour ? '' : 'on-red') + " balls-button-container"}>
				{buttons()}
			</div>
			
			<div className="games-button-container">
				<button className="game-button" onClick={handleSwitchPlayer}>End of	break</button>
				<button className="game-button" onClick={handleEndFrame}>End frame</button>
				<button className="game-button" onClick={handleEndMatch}>End match</button>
			</div>

		</div>
	)
}

export default Buttons;