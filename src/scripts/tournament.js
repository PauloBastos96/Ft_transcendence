// Player bubble colors
// TODO: change colors
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

let players = new Set();
let playerList, optionSection, playerSection, createButton;

function initTournament(playerNum) {
	// TODO: force Player1 to have the users username. It shouldn't be an <input>
	playerList = document.getElementById('playerList');
	optionSection = document.getElementById('option-section');
	playerSection = document.getElementById('player-section');
	createButton = document.getElementById('createButton');

	playerList.textContent = '';
	for (let i = 1; i <= playerNum; i++) {
		const player = document.createElement('input');
		player.id = `player${i}`;
		player.className = 'player-name';
		player.placeholder = `Player ${i}`;
		player.style.backgroundColor = BUBBLE_COLORS[(i - 1) % BUBBLE_COLORS.length];
		playerList.appendChild(player);
	}
	// Prevent automatic activation
	if (playerNum) {
		optionSection.style.display = 'none';
		playerSection.style.display = 'block';
		createButton.onclick = function() { createTournament(`${playerNum}`); };
	}
}

function goBack() {
	optionSection.style.display = 'block';
	playerSection.style.display = 'none';
}

function createTournament(playerNum) {
	players.clear();
	// This loop gets the player names, and forbids repeated names. It also uses the placeholder if no name has been set
	for (let i = 1; i <= playerNum; i++) {
		let username = document.getElementById(`player${i}`).value;
		if (!username)
			username = `Player ${i}`;
		if (players.has(username)) {
			alert(`No repeated names allowed: ${username}`);
			players.clear();
			return;
		}
		players.add(username);
	}
	alert("W");
	console.log("players: ", players);
}