import Constants from './Constants.js';

export default function reducer(state, action) {
	let player = 'player' + action.player;

	switch (action.type) {
		case 'new-game':
/*
			state.inPlay = false;
			state.frameHistory = [];
			state.player1 = Object.assign(state.player1, Constants.initialPlayerState);
			state.player2 = Object.assign(state.player2, Constants.initialPlayerState);
*/
			return Object.assign({}, Constants.initialGameState);
		case 'start-game':
			// TODO all the other settings
			state.player1.name = action.inputs.player1;
			state.player2.name = action.inputs.player2;
			state.reds = parseInt(action.inputs.reds, 10);
			state.totalFrames = parseInt(action.inputs.totalFrames);
			state.inPlay = true;
			return state;
		case 'set-frames':
			state.totalFrames = action.count;
			return state;
		case 'set-reds':
			state.reds = action.count;
			return state;
		case 'add-player': 
			state[action.player] = Object.assign({ name: action.name }, Constants.initialPlayerState);
			return state;
/*
		case 'pot':
			state[player].score += Constants.colourValues[action.ball];
			return state;
*/
		case 'end-break':
			const pots = Object.fromEntries(
				Object.entries(action.break).filter(
					([key, value]) => value > 0
				)
			);
			if (Object.keys(pots).length > 1) {
				state[player].breaks = [...state[player].breaks, pots];
			}
			return state;
		case 'end-frame':
			state.frameHistory = [...state.frameHistory, action.history];
//			state.frameHistory = [...state.frameHistory, action.scores];

			if (action.scores[0] > action.scores[1]) {
				state.player1.frames++;
			}
			else state.player2.frames++;

			const matchWin = ((parseInt(state.totalFrames) + 1 ) / 2)
/*
			if (state.player1.frames >= matchWin || state.player2.frames >= matchWin) {
				state.inPlay = false;
			}
*/
			state.inPlay = state.player1.frames < matchWin && state.player2.frames < matchWin;

			// TODO store the thing	
			return state;
		case 'foul':
			let recipient = (action.player === state.player1) ? state.player2 : state.player1;
			state[recipient].score += Constants.colourValues[action.ball];
			return state;
		default: return state;
	}
}