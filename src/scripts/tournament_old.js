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

function updateCreateButton() {
	// No tournaments with less than 4 people or uneven amount
	createButton.disabled = (players.size < 4 || players.size % 2);
}

// TODO: Actually create a tournament
window.createTournament = function() {
	const bracket = Tournament.generateBracket();
    if (bracket) {
        displayBracket(bracket);
    }
};
/* function playTournament() {
	matchUp(players);
	while (winners != 1) {
		playMatches();
		matchUp(winners);
	}

} */
// ------------------------------------------------------------------------------------------------
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Generates the bracket
function generateBracket(participants) {
	const arrPlayers = Array.from(participants);
    const rounds = [];
    let currentRound = [];
    
    // Shuffle players for random seeding
    shuffleArray(arrPlayers);
    
    // First round of matches
    for (let i = 0; i < arrPlayers.length; i += 2) {
        currentRound.push({
            player1: arrPlayers[i],
            player2: arrPlayers[i + 1],
            winner: null
        });
    }
    rounds.push(currentRound);
    
    // Future rounds
    while (currentRound.length > 1) {
        const nextRound = [];
        for (let i = 0; i < currentRound.length; i += 2) {
			// Players will be filled from winners
            nextRound.push({
                player1: null,
                player2: null,
                winner: null
            });
        }
        rounds.push(nextRound);
        currentRound = nextRound;
    }
    
    return rounds;
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
			matchDiv.innerHTML = `<div class="player" onclick="setWinner(this, ${roundIndex}, ${matchIndex}, 'player1')">${match.player1 || 'TBD'}</div>
				<div class="player" onclick="setWinner(this, ${roundIndex}, ${matchIndex}, 'player2')">${match.player2 || 'TBD'}</div>`;
			roundDiv.appendChild(matchDiv);
		});
		bracketDiv.appendChild(roundDiv);
	});
	// Clear previous bracket and display new one
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.appendChild(bracketDiv);
}

window.setWinner = function(_bracket, roundIndex, matchIndex, playerKey) {
    const bracket = Array.from(_bracket);
    const match = bracket[roundIndex][matchIndex];
    
    if (!match[playerKey]) return; // Skip if player not determined yet
    
    match.winner = match[playerKey];
    
    // Update next round if not the final round
    if (roundIndex < bracket.length - 1) {
        const nextRound = bracket[roundIndex + 1];
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextPlayerKey = matchIndex % 2 === 0 ? 'player1' : 'player2';
        
        nextRound[nextMatchIndex][nextPlayerKey] = match.winner;
    }
    
    // Redraw the bracket
    displayBracket(bracket);
};

/* TODO: Bracket generation

	* Should the bracket be fully drawn from the beginning or is it ok to just add to it per round?

	* Shuffle players into a different set, adding one `null` at the end if the number of players is odd
		(shuffle so that matchmaking is not determined by the order in which players are added)

	* Pair players into matches

	* Draw the bracket

	* Play matches and update bracket with the winners
*/