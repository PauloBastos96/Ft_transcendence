function playPong( player1_elem, player2_elem ) {
	const canvas = document.getElementById('pong');
	const ctx = canvas.getContext('2d');
	const winnerPopup = document.getElementById('winnerPopup');
	const winnerMessage = document.getElementById('winnerMessage');

	const PADDLE_SPEED = 3;
	const BALL_SPEED = 3;
	const SPEED_HITS = 5; //! mandatory

	const paddleWidth = 10;
	const paddleHeight = 80;
	const ballSize = 10;
	const maxPoints = 7;

	const paddle1Color = '#2e55d6';
	let paddle2Color = '#d62e2e';
	let ballColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';
	let fontText = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';

	let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: BALL_SPEED || 4, vy: BALL_SPEED || 4, hits: 0, lastLoser: null };

	let player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, score: 0, up: false, down: false };
	let player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, score: 0, up: false, down: false };

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
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

	function drawText(text, x) {
		ctx.fillStyle = fontText;
		ctx.font = `35px Arial`;
		ctx.fillText(text, x, 60);
	}

	function update() {
		if (checkWinner()) return 1;

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
			ballColor = '#7090fc';
			checkSpeedIncrease();
		}

		if (
			ball.x >= player2.x - ballSize &&
			ball.y >= player2.y &&
			ball.y <= player2.y + paddleHeight
		) {
			ball.vx *= -1;
			ball.hits++;
			ballColor = '#da6363';
			checkSpeedIncrease();
		}

		// Ball out of bounds
		if (ball.x < 0) {
			player2.score++;
			ball.lastLoser = 1;
			resetBall();
			resetPaddles();
		}

		if (ball.x > canvas.width) {
			player1.score++;
			ball.lastLoser = 2;
			resetBall();
			resetPaddles();
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
		ballColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';
	}

	function resetPaddles() {
		// move player1 paddle to the middle again
		player1.x = 0;
		player1.y = canvas.height / 2 - paddleHeight / 2;
		
		// move player2 paddle to the middle again
		player2.x = canvas.width - paddleWidth;
		player2.y = canvas.height / 2 - paddleHeight / 2;
	}

	function checkSpeedIncrease() {
		if (ball.hits % SPEED_HITS === 0) {
			ball.vx *= 1.2;
			ball.vy *= 1.2;
		}
	}

	function checkWinner() {
		if (player1.score >= maxPoints) {
			winnerMessage.innerText = `${player1_elem.innerText} Wins!`;
			winnerPopup.style.display = "block";
			return 1;
		}
		else if (player2.score >= maxPoints) {
			winnerMessage.innerText = `${player2_elem.innerText} Wins!`;
			winnerPopup.style.display = "block";
			return 1;
		}
		return 0;
	}

	const bracketBtn = document.getElementById('goBracket');

	bracketBtn.addEventListener('click', () => {
		if (player1.score >= maxPoints)
			selectWinner(player1_elem);
		else if (player2.score >= maxPoints)
			selectWinner(player2_elem);

		player1.score = 0;
		player2.score = 0;

		ball.lastLoser = null;
		resetBall();
		resetPaddles();
		
		winnerPopup.style.display = "none";
		bracket.style.display = 'flex';
		playerTitles.style.display = 'none';
		const game = document.getElementById('game');
		game.style.display = 'none';
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
		drawText(player1.score, canvas.width / 4);
		drawText(player2.score, (3 * canvas.width) / 4);
	}

	function gameLoop() {
		if (update()) return;
		draw();
		requestAnimationFrame(gameLoop);
	}

	window.addEventListener('keydown', (e) => {
		if (e.key.toLocaleLowerCase() === 'w') player1.up = true;
		if (e.key.toLocaleLowerCase() === 's') player1.down = true;
		if (e.key === 'ArrowUp') player2.up = true;
		if (e.key === 'ArrowDown') player2.down = true;
	});

	window.addEventListener('keyup', (e) => {
		if (e.key.toLocaleLowerCase() === 'w') player1.up = false;
		if (e.key.toLocaleLowerCase() === 's') player1.down = false;
		if (e.key === 'ArrowUp') player2.up = false;
		if (e.key === 'ArrowDown') player2.down = false;
	});

	var timer;
	var timeLeft = 4; // seconds

	function updateTimer() {
		timeLeft = timeLeft - 1;
		if (timeLeft > 0)
			document.getElementById('countdown').innerText = timeLeft;
		else if (timeLeft == 0)
			document.getElementById('countdown').innerText = 'Go!';
		else {
			document.getElementById('countdownBlock').style.display = 'none';
			clearInterval(timer);
			gameLoop();
		}
	}

	function startCountdown() {
		// every N milliseconds (1 second = 1000 ms)
		timer = setInterval(updateTimer, 1000);

		document.getElementById('countdownBlock').style.display = 'block';
		updateTimer();
	}
	draw();
	startCountdown();
}