(function () {
	document.getElementById('initTournamentBtn').addEventListener('click', function () {

		// check if all the input fields for the users are filled (later check for actual user names and wait until they accepted before starting the tournament)
		// maybe input the users and press start tournament and everyone has 10 sec to accept the tournament invite
		// im using tournament but the same applies for here in multiplayer
		const player1 = document.getElementById('player1');
		const player2 = document.getElementById('player2');
		if (player1.value.trim() == '') return alert("Player1 name is missing!");
		if (player2.value.trim() == '') return alert("Player2 name is missing!");

		// ik this is not a tournament but its the same logic
		const TourName = document.getElementById('tournamentName');
		if (TourName.value.trim() == '') return alert("Please add a name to the tournament before starting it!");

		// make some logic to check if this tournament name is available
		// since this is just a normal 1v1 maybe the tournament name can the the 2 ids of the users like 
		// (ws/chat/player1ID:player2ID) player1 being the player that created the room and is inviting the other one

		// make the game request to the players to join the websocket (tournament/1v1 game)

		// Show the canvas and winner popup
		document.getElementById('playersInfos').style.display = 'none'; // hide players infos and just show the game
		document.getElementById('pong').style.display = 'block';
		document.getElementById('winnerPopup').style.display = 'none'; // Keep it hidden until needed, i show it later during the game

		// Start the Pong Game
		game();
	});

})();

function game() {

	const canvas = document.getElementById('pong');
	const ctx = canvas.getContext('2d');
	const winnerPopup = document.getElementById('winnerPopup');
	const winnerMessage = document.getElementById('winnerMessage');

	const PADDLE_SPEED = 2;
	const BALL_SPEED = 2;
	const SPEED_HITS = 5; //! mandatory

	const paddleWidth = 10;
	const paddleHeight = 80;
	const ballSize = 10;
	const maxPoints = 5;

	const paddle1Color = 'green';
	let paddle2Color = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';
	let ballColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';
	let fontText = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';

	let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: BALL_SPEED || 4, vy: BALL_SPEED || 4, hits: 0, lastLoser: null };

	let player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, score: 0, up: false, down: false };
	let player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, score: 0, up: false, down: false };

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
		paddle2Color = e.matches ? 'white' : 'black';
		ballColor = e.matches ? 'white' : 'black';
		fontText = e.matches ? 'white' : 'black';
	});

	function drawRect(x, y, width, height, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	}

	function drawBall(x, y, size, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fill();
	}

	function drawText(text, x, y, size = '20px') {
		ctx.fillStyle = fontText;
		ctx.font = `${size} Arial`;
		ctx.fillText(text, x, y);
	}

	function update() {
		if (checkWinner()) return;

		// Ball movement
		ball.x += ball.vx;
		ball.y += ball.vy;

		// Ball collision with top and bottom walls
		if (ball.y < 0 || ball.y > canvas.height) {
			ball.vy *= -1;
		}

		// Ball collision with paddles
		if (
			ball.x <= player1.x + paddleWidth &&
			ball.y >= player1.y &&
			ball.y <= player1.y + paddleHeight
		) {
			ball.vx *= -1;
			ball.hits++;
			checkSpeedIncrease();
		}

		if (
			ball.x >= player2.x - ballSize &&
			ball.y >= player2.y &&
			ball.y <= player2.y + paddleHeight
		) {
			ball.vx *= -1;
			ball.hits++;
			checkSpeedIncrease();
		}

		// Ball out of bounds
		if (ball.x < 0) {
			player2.score++;
			ball.lastLoser = 1;
			resetBall();
		}

		if (ball.x > canvas.width) {
			player1.score++;
			ball.lastLoser = 2;
			resetBall();
		}

		// Player movement
		if (player1.up && player1.y > 0) player1.y -= PADDLE_SPEED || 5;
		if (player1.down && player1.y < canvas.height - paddleHeight) player1.y += PADDLE_SPEED || 5;

		if (player2.up && player2.y > 0) player2.y -= PADDLE_SPEED || 5;
		if (player2.down && player2.y < canvas.height - paddleHeight) player2.y += PADDLE_SPEED || 5;
	}

	function resetBall() {
		if (ball.lastLoser === 1) {
			ball.vx = -1 * BALL_SPEED || -4;
		} else {
			ball.vx = BALL_SPEED || 4;
		}

		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.vy = BALL_SPEED || 4;
		ball.hits = 0;
	}

	function checkSpeedIncrease() {
		if (ball.hits % SPEED_HITS === 0) {
			ball.vx *= 1.2;
			ball.vy *= 1.2;
		}
	}

	function checkWinner() {
		if (player1.score >= maxPoints) {
			winnerMessage.innerText = "Player 1 Wins!";
			winnerPopup.style.display = "block";
			return 1;
		}
		if (player2.score >= maxPoints) {
			winnerMessage.innerText = "Player 2 Wins!";
			winnerPopup.style.display = "block";
			return 1;
		}
		return 0;
	}

	const rrBtn = document.getElementById('restartGame');
	const homeBtn = document.getElementById('goHome');

	rrBtn.addEventListener('click', () => {
		player1.score = 0;
		player2.score = 0;

		// move player1 paddle to the middle again
		player1.x = 0;
		player1.y = canvas.height / 2 - paddleHeight / 2;

		// move player2 paddle to the middle again
		player2.x = canvas.width - paddleWidth;
		player2.y = canvas.height / 2 - paddleHeight / 2;

		winnerPopup.style.display = "none";
		ball.lastLoser = null;
		resetBall();
	});

	homeBtn.addEventListener('click', () => {
		changeContent('overview', 0);
	});

	function draw() {
		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw paddles
		drawRect(player1.x, player1.y, paddleWidth, paddleHeight, paddle1Color);
		drawRect(player2.x, player2.y, paddleWidth, paddleHeight, paddle2Color);

		// Draw ball
		drawBall(ball.x, ball.y, ballSize, ballColor);

		// Draw scores
		drawText(player1.score, canvas.width / 4, 50);
		drawText(player2.score, (3 * canvas.width) / 4, 50);
	}

	function gameLoop() {
		update();
		draw();
		requestAnimationFrame(gameLoop);
	}

	window.addEventListener('keydown', (e) => {
		if (e.key === 'w') player1.up = true;
		if (e.key === 's') player1.down = true;
		if (e.key === 'ArrowUp') player2.up = true;
		if (e.key === 'ArrowDown') player2.down = true;
	});

	window.addEventListener('keyup', (e) => {
		if (e.key === 'w') player1.up = false;
		if (e.key === 's') player1.down = false;
		if (e.key === 'ArrowUp') player2.up = false;
		if (e.key === 'ArrowDown') player2.down = false;
	});

	gameLoop();
};