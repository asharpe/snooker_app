import React from	'react';
import './FrameScore.css'

const	FrameScorer	= ({
	matchDuration,
	player1Name,
	player2Name,
	player1Frames,
	player2Frames,
	pointsRemaining,
	scoreDifference,
})	=>	{
	return <>
		<div	className="wrapper">
			<div className="frame-scorer-container">

				<div className="points-helper">
					<h3>Remaining: <span className="number">{ pointsRemaining }</span></h3>
					<h3>Difference: <span className="number">{ scoreDifference }</span></h3>
				</div>

				<div className="frame-scorer">
					<h2>Frames</h2>
					<div className="scores">
						<span>{player1Name}</span>
						<span className="number">{player1Frames} ({matchDuration}) {player2Frames} </span>
						<span>{player2Name}</span>
					</div>
				</div>
			</div>
		</div>
	</>;

}

export default	FrameScorer
