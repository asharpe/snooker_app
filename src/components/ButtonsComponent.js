import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
//import swal	from '@sweetalert/with-react'
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import Constants from '../Constants.js';
import FoulButtons from	"./FoulButtons.js";
import Break from "./Break.js";
import './ButtonsComponent.css';


const potAction = {
	type: 'pot',
	player: 1,
	colour: 'x',
	isFree: false,
}

const foulAction = {
	type: 'foul',
	player: 1,
	colour: 'x',
	reds: 0,
	miss: false,
	isFree: false,
}

const initState = {
	score1: 0,
	score2: 0,
	activePlayer: 1,
	reds: 5,

	isFree: false,
	onColour: false,
	endSequence: [],
}

const currentState = {
	score1: 0,
	score2: 0,
	activePlayer: 1,
	reds: 3,
	// TODO could look at the previous action
	isFree: false,
	// TODO could look at the previous action
	onColour: false,
	endSequence: false,
}

const Buttons = ({
	dispatch,
	activePlayer,
	numberOfReds,
	setPointsRemaining,
	setScoreDifference,
	setActivePlayer,
	score1,
	score2,
	setScore1,
	setScore2,
	processFrameEnd,

	player1Score,
	player2Score,
	setPlayer1Score,
	setPlayer2Score,

	otherPlayer,

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
	setFirstBreaker,
	firstBreaker,
}) => {
	let currentPlayer = activePlayer;

	const didUndo = useRef(false);

	const [frameHistory, setFrameHistory] = useState([]);

	const [isAFoul, setIsAFoul] = useState(false);
	const [isFreeBall, setIsFreeBall] = useState(false);
	const [isOnColour, setIsOnColour] = useState(false);
	const [redsRemaining, setRedsRemaining] = useState(numberOfReds);
	const [currentBreak, setCurrentBreak] = useState(Object.assign({}, Constants.initialBreak));
	const [undoAgain, setUndoAgain] = useState(false);

	const [foulBall, setFoulBall] = useState();
	const [removeReds, setRemoveReds] = useState(0);

	const [showDialog, setShowDialog] = React.useState(false);

	const [endSequence, setEndSequence] = useState(Constants.initialEndSequence.slice());

	// open and close the foul dialog
	useEffect(() => {
		if (isAFoul) {
			setFoulBall();
			setRemoveReds(0);
			setIsOnColour(false);
			setShowDialog(true);
		}
		else setShowDialog(false);
	}, [isAFoul]);

	useEffect(() => {
		setPointsRemaining(
			(redsRemaining * 8) +
			_.sum(Constants.endSequenceRemainder.slice(0, endSequence.length))
		);

	}, [redsRemaining, endSequence, setPointsRemaining]);

	// no more reds, and the colour for the last red has been potted
	const inEndSequence = () => {
		return redsRemaining === 0 && ! isOnColour;
	}

	console.log(frameHistory);

	useEffect(() => {
		setScoreDifference(Math.abs(score1 - score2));
	}, [score1, score2])

	// used to see if we should record a break on player change
	function calculateBreak(brk) {
		return Object.entries(brk).reduce(
			(memo, [colour, count]) => memo + count * Constants.colourValues[colour],
			0
		);
	}

	const applyPot = (pot) => {
		setFrameHistory([
			...frameHistory, pot
		])

		// some calculations are different if it's a free ball
		let colour = pot.isFree ? 'red' : pot.colour;

		// free ball is gone after any pot
		setIsFreeBall(false);

		let score = pot.player === 1 ? score1 : score2;
		let setScore = pot.player === 1 ? setScore1 : setScore2;

		const newScore = score + Constants.colourValues[colour];
		setScore(newScore);

		setCurrentBreak({
			...currentBreak,
			[colour]: currentBreak[colour] + 1,
		});

		if (inEndSequence()) return setEndSequence(endSequence.slice(1));

		// if it's a free ball, we're on a colour
		setIsOnColour(colour === 'red');

		// free ball doesn't take a red off the table
		if (pot.colour === 'red') setRedsRemaining(redsRemaining - 1);
	};

	const applyFoul = (foul) => {
		setIsAFoul(false);
		setFrameHistory(h => [...h, foul]);

		if (foul.reds > 0) {
			setRedsRemaining(redsRemaining - removeReds);
		}

		// give the score to the opponent

		// at least 4 for a foul
//		let score = foul.player === 1 ? score2 : score1;
//		let newScore = score + Math.max(Constants.colourValues[foul.colour], 4);
		let setScore = foul.player === 1 ? setScore2 : setScore1;
//		setScore(newScore);
		setScore(prev => prev + Math.max(Constants.colourValues[foul.colour], 4));

		// only switch players if we're not calling a miss
		if (!foul.miss) handleSwitchPlayer();
		if (foul.isFree) setIsFreeBall(true);
	}


	const undo = () => {
		const [last, prev, ...rest] = [...frameHistory].reverse();

		// avoid looping
		if (!last) return;

		// a marker to avoid adding a new break on player switch due to
		// undo
		didUndo.current = true;

		if (prev) setFrameHistory([prev, ...rest].reverse());
		else setFrameHistory(rest.reverse());

		_.cond([
			[l => l.type === 'break', (l) => undoBreak(l, prev)],
			[l => l.type === 'pot', (l) => undoPot(l, prev)],
			[l => l.type === 'foul', (l) => undoFoul(l, prev)],
			[_.stubTrue, (l) => {
				console.warn('cannot undo unknown action', l)
			}]
		])(last);
	}

	// handle user change by clicking name directly
	useEffect(() => {
		// this would be _after_ the player change, eg. by clicking on the
		// name, so make sure we record the break for the correct player
		let player = activePlayer === 1 ? 2 : 1;

		// TODO we don't want to do this if we just undid a foul or break
		if (didUndo.current) {
			didUndo.current = false;
		}
		else endOfBreak(player);
	}, [activePlayer]);

	useEffect(() => {
		if (endSequence.length === 0) {
			handleEndFrame();
		}
	}, [endSequence, handleEndFrame]);

	// this is how we pop the foul just under a break
	// TODO there must be a better way
	// possibly directly in undo, grab as many off the stack
	// immediately before calling the individual undo methods
	useEffect(() => {
		if (undoAgain) {
			setUndoAgain(() => false);
			undo();
		}
	}, [undoAgain, setUndoAgain]);

	function undoBreak(brk, prev) {
		setCurrentBreak(brk.break);
		setActivePlayer(brk.player);

		// prev is always a foul or a pot by the same player

		// if the thing right before this break was a foul, then
		// we need to undo that since it was the cause of this
		// break being recorded
		if (prev.type === 'foul') {
			setUndoAgain(true);
		}
		else {
			// must have been a pot, let's see if we're on a colour
			setIsOnColour(prev.colour === 'red')
		}
	}

	function undoPot(pot, prev) {
		if (pot.colour === 'red') {
			// put back a red
			setRedsRemaining(redsRemaining + 1);

			// multiple reds by the same player can be done in a single break
			// we're relying on recording a break to separate double red
			// pots
			if (
				!prev ||
				prev.type === 'pot' &&
				pot.player === prev.player
			) {
				setIsOnColour(prev && prev?.colour !== 'red');
				// TODO we should keep popping reds off until we hit something else
				// but I can't get that to work nicely in react yet
//				setUndoAgain(() => true);
			}
		}
		else {
			// was it a free ball
			setIsFreeBall(pot.isFree);

			// we just popped something off the end sequence
			if (prev && prev.type === 'pot' && prev.colour !== 'red') {
				setEndSequence([
					pot.colour,
					...endSequence
				])
			}
			else setIsOnColour(pot.colour !== 'red')
		}

		// some calculations are different if it's a free ball
		let colour = pot.isFree ? 'red' : pot.colour;

		let score = pot.player === 1 ? score1 : score2;
		let setScore = pot.player === 1 ? setScore1 : setScore2;

		const newScore = score - Constants.colourValues[colour];
		setScore(newScore);

		// attempt to adjust the break
		setCurrentBreak((b) => {
			return {
				...b,
				[colour]: b[colour] - 1,
			}
		});
	}

	function undoFoul(foul, prev) {
		if (foul.reds > 0) {
			setRedsRemaining(redsRemaining + foul.reds);
		}

		// if the thing right before this foul was a pot by the
		// same player, then they might be on a colour
		if (
			prev.type === 'pot' &&
			foul.player === prev.player &&
			prev.colour === 'red'
		) {
			setIsOnColour(true);
		}
		else setIsOnColour(false);

		// adjust the score of the opponent
		let score = foul.player === 1 ? score2 : score1;
		let setScore = foul.player === 1 ? setScore2 : setScore1;

		// at least 4 for a foul
		let newScore = score - Math.max(Constants.colourValues[foul.colour], 4);

		setScore(newScore);

		// switch players
		setActivePlayer(foul.player);
	}

	const getPotHandler = (colour) => {
		return () => {
			applyPot({
				type: 'pot',
				player: currentPlayer,
				colour: colour,
				isFree: isFreeBall,
			});
		}
	}

	const handleRed = getPotHandler('red');
	const handleYellow = getPotHandler('yellow');
	const handleGreen = getPotHandler('green');
	const handleBrown =	getPotHandler('brown');
	const handleBlue = getPotHandler('blue');
	const handlePink = getPotHandler('pink');
	const handleBlack = getPotHandler('black');



	function handleEndFrame() {
		handleSwitchPlayer();

		// reset for next frame
		setRedsRemaining(numberOfReds);
		setEndSequence(Constants.initialEndSequence.slice());

		// global reset (eg. pick next breaker)
		processFrameEnd(frameHistory);
	}

	function endOfBreak(player) {
		if (calculateBreak(currentBreak) > 0) {
			// want to record the current break if there is one so we can revert to it correctly
			setFrameHistory(h => [...h, {
				type: 'break',
				player: player,
				break: currentBreak,
			}]);
		}

		dispatch({
			type: 'end-break',
			break: currentBreak,
			player: player,
		});

		setCurrentBreak(Object.assign({}, Constants.initialBreak));
	}

	function simpleEndOfBreak(player) {
		setIsFreeBall(false);
		setIsOnColour(false);

		endOfBreak(player);
	}

	// the button - this will trigger endOfBreak via the user change
	function handleSimpleEndOfBreak() {
		if(activePlayer === 1) setActivePlayer(2);
		else setActivePlayer(1);
	}


	function handleSwitchPlayer() {
		if (calculateBreak(currentBreak) > 0) {
			// want to record the current break if there is one so we can revert to it correctly
			setFrameHistory(h => [...h, {
				type: 'break',
				player: currentPlayer,
				break: currentBreak,
			}]);
		}

		dispatch({
			type: 'end-break',
			break: currentBreak,
			player: activePlayer,
		});

		setCurrentBreak(Object.assign({}, Constants.initialBreak));
		setIsOnColour(false);

		if(activePlayer === 1) setActivePlayer(2); //setPlayer2Active();
		else setActivePlayer(1);

		setIsFreeBall(false);
	}

	// toggle foul state
	const startFoul = () => {
		// react hoop jumping to get the state
		let newFoul;
		setIsAFoul(newFoul = !isAFoul);
/*
		// a new foul!
		if (newFoul) {
			setIsOnColour(false);
			open();
		}
*/
	}

	const foulButton = <button	className="foul-button"	onClick={startFoul}>FOUL</button>;

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

	const getActiveColour = (colour) => {
		return () => {
			return isOnColour || isFreeBall || (
				inEndSequence() && endSequence[0] === colour
			);
		};
	};

	const activeRed = () => redsRemaining > 0 && (!isAFoul || isFreeBall)
	const activeYellow = getActiveColour('yellow');
	const activeGreen = getActiveColour('green');
	const activeBrown = getActiveColour('brown');
	const activeBlue = getActiveColour('blue');
	const activePink = getActiveColour('pink');
	const activeBlack = getActiveColour('black');

	const redButton = <button className="red-button" disabled={!activeRed()} onClick={handleRed}>{redsRemaining}</button>;
	const yellowButton = <button className="yellow-button" disabled={!activeYellow()} onClick={handleYellow}>YELLOW</button>;
	const greenButton = <button className="green-button" disabled={!activeGreen()} onClick={handleGreen}>GREEN</button>;
	const brownButton = <button className="brown-button" disabled={!activeBrown()} onClick={handleBrown}>BROWN</button>;
	const blueButton = <button className="blue-button" disabled={!activeBlue()} onClick={handleBlue}>BLUE</button>;
	const pinkButton = <button className="pink-button" disabled={!activePink()} onClick={handlePink}>PINK</button>;
	const blackButton = <button className="black-button" disabled={!activeBlack()} onClick={handleBlack}>BLACK</button>;

	const getColourButtons = () => {
		return <>
			{redButton}
			{yellowButton}
			{greenButton}
			{brownButton}
			{blueButton}
			{pinkButton}
			{blackButton}
		</>;
	}

	const getFoulHandler = (type) => {
		return () => {
			applyFoul({
				type: 'foul',
				player: currentPlayer,
				colour: foulBall,
				reds: removeReds,
				miss: type === 'miss',
				isFree: type === 'free-ball',
			});
		}
	}

	return (
		<>
		<div className="buttons-container">
			<Break pots={currentBreak} />

			<div className={(isOnColour ? '' : 'on-red ') + "balls-button-container"}>
				{getColourButtons()}
				{foulButton}
			</div>

			<div className="games-button-container">
				<button className="game-button undo" onClick={undo}>Undo</button>
				<button className="game-button" onClick={handleSimpleEndOfBreak}>End of break</button>
				<button className="game-button" onClick={handleEndFrame}>Concede</button>

				{/*<button className="game-button" onClick={handleEndMatch}>End match</button>*/}
			</div>
		</div>

		<DialogOverlay
			isOpen={showDialog}
			onDismiss={() => setIsAFoul(false)}
		>
			<DialogContent className="foul-dialog">
				<div className="foul">
					<FoulButtons
						foulBall={foulBall}
						setFoulBall={setFoulBall}
						redsRemaining={redsRemaining}
						setRemoveReds={setRemoveReds}
					/>
					<div className="row games-button-container">
						<button className="game-button" disabled={!foulBall} onClick={getFoulHandler('miss')}>Miss</button>
						<button className="game-button" disabled={!foulBall} onClick={getFoulHandler('free-ball')}>Free&nbsp;ball</button>
						<button className="game-button" disabled={!foulBall} onClick={getFoulHandler('foul')}>Foul</button>
					</div>
				</div>
			</DialogContent>
		</DialogOverlay>
		</>
	)
}

export default Buttons;
