(function () {

	const board = document.getElementById('board');
	const message = document.getElementById('message');
	const resetButton = document.getElementById('reset');

	let currentPlayer = 'X';
	let gameActive = true;
	let lastWon = 'O';
	const gameState = Array(9).fill(null);

	const winningCombinations = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8],
		[0, 3, 6], [1, 4, 7], [2, 5, 8],
		[0, 4, 8], [2, 4, 6]
	];

	function checkWinner() {
		for (const combination of winningCombinations) {
			const [a, b, c] = combination;
			if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
				return gameState[a];
			}
		}
		return gameState.includes(null) ? null : 'Tie';
	}

	let winner;
	function handleClick(e) {
		const cell = e.target;
		const index = cell.dataset.index;

		if (!gameActive || gameState[index]) return;

		gameState[index] = currentPlayer;
		cell.textContent = currentPlayer;
		cell.classList.add('taken', currentPlayer);

		winner = checkWinner();

		if (winner) {
			gameActive = false;
			lastWon = winner;
			message.textContent = winner === 'Tie' ? `${i18next.t('ttt.tie')}` : `${i18next.t('ttt.player')} ${winner} ${i18next.t('pong.wins')}`;
		} else {
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
			if (_lang === 'EN') message.textContent = `Player ${currentPlayer}'s turn`;
			if (_lang === 'PT') message.textContent = `Vez do jogador ${currentPlayer}`;
			if (_lang === 'ES') message.textContent = `Turno del jugador ${currentPlayer}`;
		}
	}

	function resetGame() {
		gameState.fill(null);
		if (winner == 'X') currentPlayer = 'O';
		else currentPlayer = 'X'
		gameActive = true;
		if (_lang === 'EN') message.textContent = `Player ${currentPlayer}'s turn`;
		if (_lang === 'PT') message.textContent = `Vez do jogador ${currentPlayer}`;
		if (_lang === 'ES') message.textContent = `Turno del jugador ${currentPlayer}`;
		board.innerHTML = '';
		createBoard();
	}

	function createBoard() {
		for (let i = 0; i < 9; i++) {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.dataset.index = i;
			cell.addEventListener('click', handleClick);
			board.appendChild(cell);
		}
	}

	resetButton.addEventListener('click', resetGame);
	createBoard();

})();

function translateTTT() {
	document.querySelectorAll('[data-i18n]').forEach(element => {
        let key = element.getAttribute('data-i18n');
        element.innerText = i18next.t(key);
    });
}