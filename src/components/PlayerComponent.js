import React from	'react';
import './PlayerComponent.css';

const	Player =	({
	 playerNumber,
	 playerScore,
	 activePlayer,
	 playerBreak,
	 playerBreaks,
	 playerName,
	 handlePlayerChange,
})	=>	{
	return <>
		<div
				className={ activePlayer === playerNumber ? "active-player" : "non-active-player" }
				onClick={ handlePlayerChange }
		>
			<h1 className="player-name">{ playerName }</h1>
			<h2>Score: <span className="number">{ playerScore }</span></h2>
			<h2>Break: <span className="number">{ playerBreak }</span></h2>
			<h2>High	Break: <span className="number">{ playerBreaks[0] }</span></h2>
		</div>
	</>;
}

export default	Player;