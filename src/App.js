import React, { useState, useReducer } from 'react';
import { produce } from 'immer';

import Constants from './Constants.js';
import reducer from './Reducer.js';
import './App.css';
import Main from './Main.js';
import Landing from './components/LandingPage.js';
import Header from './components/Header.js';
import Summary from './Summary.js';


// https://hswolff.com/blog/level-up-usereducer-with-immer/
const immerReducer = produce(reducer);

function App() {
	const [ gameState, dispatch ] = useReducer(immerReducer, Object.assign({}, Constants.initialGameState));
	const [ firstBreaker, setFirstBreaker ] = useState('random');

	// helper to get from the Landing page into the Main page
	function getFirstBreaker(firstBreakerInput) {
		if(firstBreakerInput !== "random")	{
			return firstBreakerInput;
		}

		return Math.floor((Math.random()	* 2) + 1);
	}

	function applyFirstBreaker(firstBreakerInput) {
		return setFirstBreaker(getFirstBreaker(firstBreakerInput));
	}

	let content;

	if (gameState.inPlay) {
		content = <Main
			gameState={gameState}
			dispatch={dispatch}
			firstBreaker={getFirstBreaker(firstBreaker)}
		/>;
	}
	else if (gameState.frameHistory.length > 0) {
		content = <Summary
			state={gameState}
			restart={() => dispatch({
				type: 'new-game',
			})}
		/>;
	}
	else {
		content = <Landing
			gameState={gameState}
			dispatch={dispatch}
			setFirstBreaker={applyFirstBreaker}
		/>;
	}

	return (
		<div className="App">
			<Header />
			{content}
		</div>
	);
}

export default App;
