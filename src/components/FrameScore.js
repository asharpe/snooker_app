import React from	'react';
import './FrameScore.css'

const	FrameScorer	= ({
	player1Frames,
	player2Frames,
	matchDuration,
	firstBreaker,
	pointsRemaining,
	scoreDifference,
})	=>	{
	return <>
		<div	className="wrapper">
			<h2 className="first-break">{	firstBreaker }	to	break</h2>

			<div className="frame-scorer-container">
				<div className="frame-scorer">
					<h2>Frames</h2>
					<h1 className="number">{player1Frames} ({matchDuration}) {player2Frames} </h1>
				</div>
			</div>

			<div className="points-helper">
				<h3>Remaining: <span className="number">{ pointsRemaining }</span></h3>
				<h3>Difference: <span className="number">{ scoreDifference }</span></h3>
			</div>
		</div>
	</>;

}

export default	FrameScorer