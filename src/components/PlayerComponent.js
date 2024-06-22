import React from	'react';
import './PlayerComponent.css';

const	Player =	({
	active,
	playerScore,
	playerName,
	handlePlayerChange,
})	=>	{
	return <>
		<div
				className={ active ? "active-player" : "non-active-player" }
				onClick={ handlePlayerChange }
		>
			<span className="player-name">{ playerName }</span>
			<span className="number">{ playerScore }</span>
			{/*<h2>Break: <span className="number">{ playerBreak }</span></h2>
			<h2>High	Break: <span className="number">{ playerBreaks[0] }</span></h2>*/}
		</div>
	</>;
}

export default	Player;
