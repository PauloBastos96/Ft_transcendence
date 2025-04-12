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
let optionSection, playerSection, bracket, playerTitles, game, confirmPopup;

function initTournament(playerNum) {
	if (!playerNum)
		return;
	let playerList = document.getElementById('playerList');
	let createButton = document.getElementById('createButton');
	optionSection = document.getElementById('option-section');
	playerSection = document.getElementById('player-section');

	playerList.textContent = '';

	// Set Player 1 to be the user
	const player1 = document.createElement('input');
	player1.id = 'player1';
	player1.className = 'player-name';
	getUserData().then(data => { player1.value = data.username; });
	player1.readOnly = true;
	player1.style.backgroundColor = BUBBLE_COLORS[0];
	playerList.appendChild(player1);

	for (let i = 2; i <= playerNum; i++) {
		const player = document.createElement('input');
		player.id = `player${i}`;
		player.className = 'player-name';
		player.placeholder = `Player ${i}`;
		player.style.backgroundColor = BUBBLE_COLORS[(i - 1) % BUBBLE_COLORS.length];
		playerList.appendChild(player);
	}

	optionSection.style.display = 'none';
	playerSection.style.display = 'block';
	createButton.onclick = function() { createTournament(`${playerNum}`); };
}

function goBack() {
	optionSection.style.display = 'block';
	playerSection.style.display = 'none';
}

function checkNames(playerNum) {
	for (let i = 1; i <= playerNum; i++) {
		let username = document.getElementById(`player${i}`).value;
		if (!username)
			username = `Player ${i}`;
		if (players.has(username)) {
			alert(`No repeated names allowed: ${username}`);
			players.clear();
			return false;
		}
		players.add(username);
	}
	console.log("players: ", players);
	return true;
}

// Creates the tournament and its bracket
function createTournament(playerNum) {
	players.clear();
	if (!checkNames(playerNum))
		return;
	let newTournament = document.getElementById('newTournament');
	newTournament.style.display = 'none';
	playerSection.style.display = 'none';

	bracket = document.getElementById('bracket');

	const rounds = Math.log2(playerNum) + 1;
	let matches = playerNum / 2;
	let playerArr = Array.from(players);

	arrayShuffle(playerArr);

	const spacer = document.createElement('li');
	spacer.className = 'spacer';
	spacer.innerHTML = '&nbsp;';

	// const matchSpacer = document.createElement('li');
	// matchSpacer.className = 'match match-spacer';
	// matchSpacer.innerHTML = '&nbsp;';

	// Add all rounds to the bracket
	for (let round = 1; round <= rounds; round++) {
		const roundElem = document.createElement('ul');
		roundElem.className = 'round';

		roundElem.appendChild(spacer.cloneNode(true));
		for (let match = 0; round < rounds && match < matches; match++) {
			const matchSpacer = document.createElement('li');
			matchSpacer.className = 'match match-spacer';
			matchSpacer.innerHTML = '&nbsp;';
			matchSpacer.style.cursor = 'pointer';
			matchSpacer.dataset.round = round;
			matchSpacer.dataset.matchIndex = match;


			const player1 = document.createElement('li');
			player1.className = 'match player1';
			player1.dataset.round = round;
			player1.dataset.matchIndex = match;
			player1.dataset.position = 0;
			player1.style.cursor = 'pointer';

			const player2 = document.createElement('li');
			player2.className = 'match player2';
			player2.dataset.round = round;
			player2.dataset.matchIndex = match;
			player2.dataset.position = 1;
			player2.style.cursor = 'pointer';

			if (round == 1) {
				player1.textContent = playerArr[match * 2];
				player2.textContent = playerArr[match * 2 + 1];
			} else {
				player1.innerHTML = '<i class="tbd">TBD</i>';
				player2.innerHTML = '<i class="tbd">TBD</i>';
			}

			player1.addEventListener('click', function() { startGame(this); });
			player2.addEventListener('click', function() { startGame(this); });
			matchSpacer.addEventListener('click', function() { startGame(player1); });

			roundElem.appendChild(player1);
			roundElem.appendChild(matchSpacer);
			roundElem.appendChild(player2);
			roundElem.appendChild(spacer.cloneNode(true));
		}

		// This puts the winner section to the bracket
		if (round == rounds) {
			const winner = document.createElement('li');
			winner.className = 'match player1';
			winner.innerHTML = '<i class="tbd">TBD</i>';
			winner.dataset.round = round;
			winner.dataset.matchIndex = 0;
			winner.dataset.position = 0;

			roundElem.appendChild(winner);
			roundElem.appendChild(spacer.cloneNode(true));
		}
		bracket.appendChild(roundElem);
		matches /= 2;
	}
}

// Shuffles an array
function arrayShuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  const j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Starts the game of pong if possible
function startGame(element) {
	// Prevent selection if clicked element is TBD
	if (element.querySelector('i.tbd')) return;

	const currentRound = parseInt(element.dataset.round);
	const currentMatchIndex = parseInt(element.dataset.matchIndex);

	// Get both players in the current match
	const currentMatchPlayers = document.querySelectorAll(`li[data-round="${currentRound}"][data-match-index="${currentMatchIndex}"]`);
	
	// Check if opponent is still TBD
	const opponent = [...currentMatchPlayers].find(p => (p !== element && p.className !== 'match match-spacer'));
	if (opponent.querySelector('i.tbd')) {
		alert("Opponent is still TBD!");
		return;
	}

	let player1 = document.getElementById('player1-title');
	let player2 = document.getElementById('player2-title');
	if (element.dataset.position == 0) {
		player1.innerText = element.innerText;
		player2.innerText = opponent.innerText;
		confirmMatch(element, opponent);
	} else if (element.dataset.position == 1) {
		player1.innerText = opponent.innerText;
		player2.innerText = element.innerText;
		confirmMatch(opponent, element);
	}
}

function confirmMatch(player1, player2) {
	let confirmMessage = document.getElementById('confirmMessage');
	let playButton = document.getElementById('playButton');
	let cancelButton = document.getElementById('cancelButton');

	confirmPopup = document.getElementById('confirmPopup');
	
	confirmPopup.style.display = 'block';
	
	confirmMessage.innerHTML = `${player1.innerText} <b><i>VS</i></b> ${player2.innerText}`;

	// Remove other event listeners
	playButton.replaceWith(playButton.cloneNode(true));
	playButton = document.getElementById('playButton');

	playButton.addEventListener('click', function() {
		confirmPopup.style.display = 'none';
		game = document.getElementById('game');
		game.style.display = 'block';
		playerTitles = document.getElementById('player-titles');
		playerTitles.style.display = 'block';

		bracket.style.display = 'none';
		playPong(player1, player2);
	});

	cancelButton.addEventListener('click', function() {
		confirmPopup.style.display = 'none';
	});
}

// Receives an element of the bracket and sets it to the winner of the match (if legal)
function selectWinner(element) {
	const currentRound = parseInt(element.dataset.round);
	const currentMatchIndex = parseInt(element.dataset.matchIndex);

	// Get both players in the current match
	const currentMatchPlayers = document.querySelectorAll(`li[data-round="${currentRound}"][data-match-index="${currentMatchIndex}"]`);

	element.classList.add('winner');

	const nextRound = currentRound + 1;
	const nextMatchIndex = Math.floor(currentMatchIndex / 2);
	const nextPosition = currentMatchIndex % 2;

	// Find next round element
	const nextRoundElement = document.querySelector(`.round:nth-child(${nextRound})`);
	if (!nextRoundElement) return;

	const nextPlayer = nextRoundElement.querySelector(`li[data-round="${nextRound}"][data-match-index="${nextMatchIndex}"][data-position="${nextPosition}"]`);

	// Update next instance of the player
	if (nextPlayer) {
		nextPlayer.textContent = element.textContent;
		nextPlayer.innerHTML = element.textContent; // Remove TBD
		if (nextPlayer.dataset.round == Math.log2(players.size) + 1)
			nextPlayer.classList.add("final-winner");
	}

	currentMatchPlayers.forEach(p => {
		p.classList.add('decided');
		p.style.pointerEvents = 'none';
	});
}