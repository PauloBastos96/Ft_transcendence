// Player bubble colors
const BUBBLE_COLORS = [
	'#c70b0b',	// Red
	'#ee940c',	// Orange
	'#1ca11c',	// Green
	'#0bb970',	// Teal
	'#1a70c0',  // Blue
	'#093875',	// Dark Blue
	'#502772',	// Purple
	'#e23ac6',	// Pink
];

let playerList;

function initTournament(players) {
	playerList = document.getElementById('playerList');

	playerList.textContent = '';
	for (let i = 1; i <= players; i++) {
		const player = document.createElement('input');
		player.id = `player${i}`;
		player.className = 'player-name';
		player.placeholder = `Player ${i}`;
		player.style.placeholder.color
		player.style.backgroundColor = BUBBLE_COLORS[(i - 1) % BUBBLE_COLORS.length] 
		playerList.appendChild(player);
	}
	// Create set of players
	// Add a div for each player 
}