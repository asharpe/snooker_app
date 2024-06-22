const colourValues = {
	white: 0,
	red: 1,
	yellow: 2,
	green: 3,
	brown: 4,
	blue: 5,
	pink: 6,
	black: 7
};

const initialEndSequence = [
	'yellow',
	'green',
	'brown',
	'blue',
	'pink',
	'black'
];
const endSequenceRemainder = [
	7, 6, 5, 4, 3, 2
];

// order matters here for rendering the current break
const initialBreak = {
	red: 0,
	black: 0,
	pink: 0,
	blue: 0,
	brown: 0,
	green: 0,
	yellow: 0,
}

const initialPlayerState = {
	//name: '',
	frames: 0,
	breaks: []
};

const initialGameState = {
	player1: Object.assign({name: 'Simøn'}, initialPlayerState),
	player2: Object.assign({name: 'André'}, initialPlayerState),
	totalFrames: 3,
	reds: 10,
	frameHistory: [],
	inPlay: false,
};

const Constants = {
	colourValues,
	endSequenceRemainder,
	initialEndSequence,
	initialBreak,
	initialPlayerState,
	initialGameState,
};

export default Constants;
