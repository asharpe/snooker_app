import React, { useState, useEffect	} from 'react';
import _ from 'lodash';
import Constants from '../Constants.js';
import './Break.css';


const Break = ({
	pots,
}) => {
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

	let buttons = {
		red: <button key="red" className="red-break" disabled={false} >{pots.red}</button>,
		yellow: <button key="yellow" className="yellow-break" disabled={false} >{pots.yellow}</button>,
		green: <button key="green" className="green-break" disabled={false} >{pots.green}</button>,
		brown: <button key="brown" className="brown-break" disabled={false} >{pots.brown}</button>,
		blue: <button key="blue" className="blue-break" disabled={false} >{pots.blue}</button>,
		pink: <button key="pink" className="pink-break" disabled={false} >{pots.pink}</button>,
		black: <button key="black" className="black-break" disabled={false} >{pots.black}</button>,
	};

	let brk = 0;
	let _buttons = <>
		{
			Object.entries(pots).reduce(
				(memo, [colour, count]) => {
					brk += count * Constants.colourValues[colour];
					return (count > 0) ? [...memo, buttons[colour]] : memo;
				},
				[]
			)
		}
	</>;


	return (
		<div className="break-container">
			<div className="tally">
				Break <span type="number">{brk}</span>
			</div>
			<div className="balls-break-container">
				{_buttons}
			</div>
		</div>
	)
}

export default Break;
