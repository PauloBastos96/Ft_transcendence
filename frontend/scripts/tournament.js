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
let playerList, optionSection, playerSection, createButton, newTournament;

function initTournament(playerNum) {
	if (!playerNum)
		return;
	playerList = document.getElementById('playerList');
	optionSection = document.getElementById('option-section');
	playerSection = document.getElementById('player-section');
	createButton = document.getElementById('createButton');

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

function createTournament(playerNum) {
	players.clear();
	if (!checkNames(playerNum))
		return;
	newTournament = document.getElementById('newTournament');
	newTournament.style.display = 'none';
	playerSection.style.display = 'none';

	const bracket = document.getElementById('bracket');

	const rounds = Math.log2(playerNum) + 1;
	let matches = playerNum / 2;
	let playerArr = Array.from(players);

	arrayShuffle(playerArr);

	const spacer = document.createElement('li');
	spacer.className = 'spacer';
	spacer.innerHTML = '&nbsp;';

	const matchSpacer = document.createElement('li');
	matchSpacer.className = 'match match-spacer';
	matchSpacer.innerHTML = '&nbsp;';

	// Add all rounds to the bracket
	for (let round = 1; round <= rounds; round++) {
		const roundElem = document.createElement('ul');
		roundElem.className = 'round';

		roundElem.appendChild(spacer.cloneNode(true));
		for (let match = 0; round < rounds && match < matches; match++) {
			const player1 = document.createElement('li');
			player1.className = 'match player1';
			player1.dataset.round = round;
			player1.dataset.matchIndex = match;
			player1.dataset.position = 0;

			const player2 = document.createElement('li');
			player2.className = 'match player2';
			player2.dataset.round = round;
			player2.dataset.matchIndex = match;
			player2.dataset.position = 1;

			if (round == 1) {
				player1.textContent = playerArr[match * 2];
				player2.textContent = playerArr[match * 2 + 1];
			} else {
				player1.innerHTML = '<i class="tbd">TBD</i>';
				player2.innerHTML = '<i class="tbd">TBD</i>';
			}

			player1.addEventListener('click', function() { selectWinner(this); });
			player2.addEventListener('click', function() { selectWinner(this); });

			roundElem.appendChild(player1);
			roundElem.appendChild(matchSpacer.cloneNode(true));
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

function selectWinner(element) {
	// Prevent selection if clicked element is TBD
	if (element.querySelector('i.tbd')) return;

	const currentRound = parseInt(element.dataset.round);
	const currentMatchIndex = parseInt(element.dataset.matchIndex);

	// Get both players in the current match
	const currentMatchPlayers = document.querySelectorAll(`li[data-round="${currentRound}"][data-match-index="${currentMatchIndex}"]`);

	// Check if match is already decided
	if ([...currentMatchPlayers].some(p => p.classList.contains('decided'))) {
		alert("This match is already decided!");
		return;
	}

	// Check if opponent is still TBD
	const opponent = [...currentMatchPlayers].find(p => p !== element);
	if (opponent.querySelector('i.tbd')) {
		alert("Opponent is still TBD!");
		return;
	}

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

function arrayShuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  const j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]];
	}
	return array;
  }