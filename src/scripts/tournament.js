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

let players = new Set();
let textInput, playerBubbles, createButton;

function initTournament() {
	players = new Set();
	textInput = document.getElementById('usernameInput');
	playerBubbles = document.getElementById('playerBubbles');
	createButton = document.getElementById('createButton');

	if (!textInput || !playerBubbles || !createButton) {
		console.error('Tournament elements not found!');
		return;
	}

	// Clear existing content
	playerBubbles.innerHTML = '';
	textInput.value = '';

	// Remove existing event listeners
	textInput.removeEventListener('keydown', handleKeyPress);

	// Add new event listeners
	textInput.addEventListener('keydown', handleKeyPress);
	updateCreateButton();
}

function handleKeyPress(e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		const username = textInput.value.trim();
		
		// Add to set of players
		if (username) {
			if (players.size === 16 ) {
				alert('Max players reached(16)');
			} else if (!players.has(username)) {
				players.add(username);
				addBubble(username);
				textInput.value = '';
				updateCreateButton();
			} else {
				alert('This username is already added!');
			}
			
		}
	}
}

// Add player bubble
function addBubble(username) {
	// Colors will be in order
	const colorIndex = (players.size - 1) % (BUBBLE_COLORS.length);
	const bubble = document.createElement('div');

	bubble.style.backgroundColor = BUBBLE_COLORS[colorIndex];
	bubble.className = 'bubble';
	bubble.innerHTML = `<span onclick="removeBubble('${username}')">${username}</span>`;
	playerBubbles.appendChild(bubble);
}

function updateCreateButton() {
	// No tournaments with less than 3 people
	createButton.disabled = players.size < 3;
}

window.createTournament = function() {
	if (players.size < 3) {
		alert('Please add at least 3 players');
		return;
	}
	const participantList = Array.from(players);
	alert(`Tournament created with ${players.size} players!`);
	console.log('players:', participantList);
};

window.removeBubble = function(username) {
	players.delete(username);
	playerBubbles.innerHTML = '';
	players.forEach(user => addBubble(user));
	updateCreateButton();
};