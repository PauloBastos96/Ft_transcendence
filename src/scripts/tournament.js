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
	if (!playerNum)
		return;
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
	playerSection.style.display = 'none';

	// TODO: Shuffle players

	const bracket = document.getElementById('bracket');
	bracket.innerHTML = '';
		
	const rounds = Math.log2(playerNum) + 1;
	let matches = playerNum / 2;
	let participants = Array.from(players);

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
			const player2 = document.createElement('li');

			player1.className = 'match player1';
			player2.className = 'match player2';
			if (round == 1) {
				player1.textContent = participants[match * 2];
				player2.textContent = participants[match * 2 + 1];
			} else {
				player1.innerHTML = '<i>TBD</i>';
				player2.innerHTML = '<i>TBD</i>';
			}

			roundElem.appendChild(player1);
			roundElem.appendChild(matchSpacer.cloneNode(true));
			roundElem.appendChild(player2);
			roundElem.appendChild(spacer.cloneNode(true));
		}
		// This puts the winner section to the bracket
		if (round == rounds) {
			const winner = document.createElement('li');
			winner.className = 'match player1';
			winner.innerHTML = '<i>TBD</i>';

			roundElem.appendChild(winner);
			roundElem.appendChild(spacer.cloneNode(true));
		}
		bracket.appendChild(roundElem);
		matches /= 2;
	}
}

// const rounds = Math.log2(playerNum);
// let matches = playerNum / 2;