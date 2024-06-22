import React, { useState, useEffect, useRef } from 'react';
import './Main.css';
import Player from './components/PlayerComponent.js';
import Buttons from './components/ButtonsComponent.js';
import FrameScorer from './components/FrameScore.js';

const Main = ({
	gameState,
	dispatch,
	firstBreaker,
}) => {
	const [ score1, setScore1 ] = useState(0);
	const [ score2, setScore2 ] = useState(0);
	const [ scoreDifference, setScoreDifference ] = useState(0);
	const [ pointsRemaining, setPointsRemaining ] = useState(gameState.reds * 8 + 27);

	const [ activePlayer, setActivePlayer ] = useState(firstBreaker);

	function otherPlayer(player) {
		return (player + 2) % 2 + 1;
	}

	// handler for picking who breaks next
	useEffect(() => {
		if (score1 === 0 && score2 === 0) {
			const breaker = (gameState.frameHistory.length % 2 === 0) ? firstBreaker : otherPlayer(firstBreaker);
			setActivePlayer(breaker);
		}
	}, [gameState, score1, score2, firstBreaker])

	function processFrameEnd(history) {
		// TODO something useful with this
		dispatch({
			type: 'end-frame',
			scores: [score1, score2],
			history, // TODO this _may_ be missing the last action or two
		});

		setScore1(0);
		setScore2(0);
		setScoreDifference(0);
		setPointsRemaining(gameState.reds * 8 + 27);
	}

	const toggleActivePlayer = (player) => {
		return () => {
			if (player === activePlayer) return;

			setActivePlayer(otherPlayer(activePlayer));
		}
	}

	return (
		<div>
			<div className="main-container">
				<div className="main-banner">
					<Player
						active={activePlayer === 1}
						playerScore={score1}
						playerName={gameState.player1.name}
						handlePlayerChange={toggleActivePlayer(1)}
					/>
					<Player
						active={activePlayer === 2}
						playerScore={score2}
						playerName={gameState.player2.name}
						handlePlayerChange={toggleActivePlayer(2)}
					/>
				</div>
				<Buttons
					dispatch={dispatch}
					matchDuration={gameState.totalFrames}
					numberOfReds={gameState.reds}
					setPointsRemaining={setPointsRemaining}
					setScoreDifference={setScoreDifference}
					activePlayer={activePlayer}
					setActivePlayer={setActivePlayer}
					score1={score1}
					score2={score2}
					setScore1={setScore1}
					setScore2={setScore2}
					processFrameEnd={processFrameEnd}

					otherPlayer={otherPlayer}
				/>
				<FrameScorer
					matchDuration={gameState.totalFrames}
					player1Name={gameState.player1.name}
					player2Name={gameState.player2.name}
					player1Frames={gameState.player1.frames}
					player2Frames={gameState.player2.frames}
					pointsRemaining={pointsRemaining}
					scoreDifference={scoreDifference}
				/>
			</div>
		</div>
	);
};

export default Main;
