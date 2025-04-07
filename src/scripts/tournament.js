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

const Tournament = (function() {
	// Private variables
	let players = new Set();
	let currentBracket = null;

	// Public methods
	return {
		addPlayer: function(username) { players.add(username); },

		removePlayer: function(username) { players.delete(username); },

		generateBracket: function() {
			if (players.size < 4 || players.size % 2 !== 0) {
				alert((players.size < 4 ? 'Please add at least 4 participants' : 'Tournament requires an even number of players'));
				return null;
			}

			const playerArr = Array.from(players);
			const bracket = [];
			let currentRound = [];

			shuffleArray(playerArr);

			// First round
			for (let i = 0; i < playerArr.length; i += 2) {
				currentRound.push({
					player1: playerArr[i],
					player2: playerArr[i + 1],
					winner: null
				});
			}
			bracket.push(currentRound);

			// Other future rounds
			while (currentRound.length > 1) {
				const nextRound = [];
				for (let i = 0; i < currentRound.length; i += 2) {
					nextRound.push({
						player1: null,
						player2: null,
						winner: null
					});
				}
				bracket.push(nextRound);
				currentRound = nextRound;
			}

			currentBracket = bracket;
			return bracket;
		},

		setWinner: function(roundIndex, matchIndex, winnerKey) {
			if (!currentBracket) return;

			const match = currentBracket[roundIndex][matchIndex];

			if (!match[winnerKey]) return; // No winner

			match.winner = match[winnerKey];

			// Update next round if not last round
			if (roundIndex < currentBracket.length - 1) {
				const nextRound = currentBracket[roundIndex + 1];
				const nextMatchIndex = Math.floor(matchIndex / 2);
				const nextPlayerKey = matchIndex % 2 === 0 ? 'player1' : 'player2';

				nextRound[nextMatchIndex][nextPlayerKey] = match[winnerKey];
			}

			return currentBracket;
		},

		getCurrentBracket: function() { return currentBracket; },

		getPlayers: function() { return players; },

		has: function(username) { return players.has(username) },

		size: function() { return players.size; },

		reset: function() {
			players = new Set();
			currentBracket = null;
		}
	};
})();

let textInput;

// Helper function to shuffle array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function displayBracket(bracket) {
	const bracketDiv = document.createElement('div');
	bracketDiv.className = 'bracket';
	
	bracket.forEach((round, roundIndex) => {
		const roundDiv = document.createElement('div');
		roundDiv.className = 'round';
		roundDiv.innerHTML = `<h3>Round ${roundIndex + 1}</h3>`;
		
		round.forEach((match, matchIndex) => {
			const matchDiv = document.createElement('div');
			matchDiv.className = 'match';
			matchDiv.innerHTML = `<div class="player ${match.winner === match.player1 ? 'winner' : ''}" 
					onclick="Tournament.setWinner(${roundIndex}, ${matchIndex}, 'player1');
							displayBracket(Tournament.getCurrentBracket())">
					${match.player1 || ''}</div>
				<div class="player ${match.winner === match.player2 ? 'winner' : ''}" 
					onclick="Tournament.setWinner(${roundIndex}, ${matchIndex}, 'player2'); 
							displayBracket(Tournament.getCurrentBracket())">
					${match.player2 || ''}</div>`;
			roundDiv.appendChild(matchDiv);
		});
		
		bracketDiv.appendChild(roundDiv);
	});
	
	const content = document.getElementById('content');
	content.innerHTML = '';
	content.appendChild(bracketDiv);
}

// Update your existing functions to use the Tournament module
function initTournament() {
	// Clear previous state
	Tournament.reset();

	// Initialize from existing players
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
			if (Tournament.size() === 16 ) {
				alert('Max players reached(16)');
			} else if (!Tournament.has(username)) {
				Tournament.addPlayer(username);
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
	bubble.style.backgroundColor = BUBBLE_COLORS[(Tournament.size() - 1) % (BUBBLE_COLORS.length)];
	bubble.className = 'bubble';
	bubble.textContent = `${username}`;
	bubble.onclick = function() { removeBubble(`${username}`) };

	return bubble;
}

window.removeBubble = function(username) {
	Tournament.removePlayer(username);
	playerBubbles.innerHTML = '';
	let players = Tournament.getPlayers();
	
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

function updateCreateButton() {
	// No tournaments with less than 4 people or uneven amount
	createButton.disabled = (Tournament.size() < 4 || Tournament.size() % 2);
}

window.createTournament = function() {
	const bracket = Tournament.generateBracket();
	if (bracket)
		displayBracket(bracket);
};