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
				playerBubbles.appendChild(newBubble(username));
				textInput.value = '';
				updateCreateButton();
			} else {
				alert('This username is already added!');
			}
			
		}
	}
}

// Creates and returns a new player bubble element
function newBubble(username) {
	const bubble = document.createElement('div');
	
	// Colors will be in order
	bubble.style.backgroundColor = BUBBLE_COLORS[(players.size - 1) % (BUBBLE_COLORS.length)];
	bubble.className = 'bubble';
	bubble.textContent = `${username}`;
	bubble.onclick = function() { removeBubble(`${username}`) };

	return bubble;
}

function updateCreateButton() {
	// No tournaments with less than 3 people
	createButton.disabled = players.size < 3;
}

// TODO: Actually create a tournament
window.createTournament = function() {
	if (players.size < 3) {
		alert('Please add at least 3 players');
		return;
	}
	alert(`Tournament created with ${players.size} players!`);
	console.log('players:', players);
};

window.removeBubble = function(username) {
	players.delete(username);
	playerBubbles.innerHTML = '';

	// Update the colors of other players
	let i = 0;
	players.forEach(user => {
		let tmp = newBubble(user);
		tmp.style.backgroundColor = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
		playerBubbles.appendChild(tmp);
		i++;
	})

	updateCreateButton();
};

/* TODO: Bracket generation

	* Should the bracket be fully drawn from the beginning or is it ok to just add to it per round?

	* Shuffle players into a different set, adding one `null` at the end if the number of players is odd
		(shuffle so that matchmaking is not determined by the order in which players are added)

	* Pair players into matches

	* Draw the bracket

	* Play matches and update bracket with the winners
*/