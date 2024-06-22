import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const	Landing = ({
	gameState,
	dispatch,
	firstBreaker,
	setFirstBreaker,
})	=>	{

	const [modalShow, setModalShow] = useState(false);

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(()=>	{
		window.scrollTo( 0, 0 )
	});
	
	const	handleSubmit =	(event) => {
		event.preventDefault();
		
		const	inputs =	event.target;

		dispatch({
			type: 'start-game',
			inputs: {
				player1: inputs[0].value,
				player2: inputs[1].value,
				reds: inputs[2].value,
				totalFrames: inputs[3].value,
				firstBreaker: inputs[4].value,
			}
		});
	};

	return (
		<div className="form-container">
			<form	className="game-form" onSubmit={handleSubmit}>
				<label>
					Player 1:
					<input
						type="text"
						placeholder="Enter Name"
						required
						defaultValue={gameState.player1.name}
					/>
				</label>
				<br />

				<label>
					Player 2:
					<input
						type="text"
						placeholder="Enter Name"
						required
						defaultValue={gameState.player2.name}
					/>
				</label>
				<br />

				<label>
					Number of reds:
					<select defaultValue={gameState.reds} onChange={(event) => dispatch({
							type: 'set-reds',
							count: event.target.value,
						})}
					>
						<option value={1}>1</option>
						<option value={6}>6</option>
						<option value={10}>10</option>
						<option value={15}>15</option>
					</select>
				</label>
				<br />

				<label>
					Number of frames:
					<select defaultValue={gameState.totalFrames} onChange={(event) => dispatch({
						type: 'set-frames',
						count: event.target.value,
					})}>
						<option value={1}>1</option>
						<option value={3}>3</option>
						<option value={5}>5</option>
						<option value={7}>7</option>
						<option value={9}>9</option>
						<option value={11}>11</option>
						<option value={13}>13</option>
						<option value={15}>15</option>
						<option value={17}>17</option>
						<option value={19}>19</option>
						<option value={21}>21</option>
						<option value={23}>23</option>
						<option value={25}>25</option>
						<option value={27}>27</option>
						<option value={29}>29</option>
						<option value={31}>31</option>
						<option value={33}>33</option>
						<option value={35}>35</option>
					</select>
				</label>
				<br />

					<label>
						Player to break:
						<select defaultValue="random" onChange={(event) => setFirstBreaker(event.target.value)}>
							<option value="random">Random</option>
							<option value={1}>{gameState.player1.name}</option>
							<option value={2}>{gameState.player2.name}</option>
						</select>
					</label>
				<br />
				<div className="submit-container">
					<button type="submit" value="Submit">START</button>
				</div>
				<br />
			</form>
		</div>
	);
};

export default	Landing;
