import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

const	Summary = ({
	state,
	restart,
})	=>	{
/*
	const [modalShow, setModalShow] = useState(false);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
*/
	useEffect(() =>	{
		window.scrollTo( 0, 0 )
	});
	
	return (
		<div className="summary">
			<pre>
				{JSON.stringify(state, null, 4)}
			</pre>
			<Button variant="primary" onClick={restart}>
				New Game
			</Button>
		</div>
	);
};

export default	Summary;
