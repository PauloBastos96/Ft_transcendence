(async function () {
	const player1 = document.getElementById('player1');
	window.user = await getUserData();
	player1.placeholder = window.user.username;

	document.getElementById('initTournamentBtn').addEventListener('click', async function () {

		// check if all the input fields for the users are filled (later check for actual user names and wait until they accepted before starting the tournament)
		// maybe input the users and press start tournament and everyone has 10 sec to accept the tournament invite
		// im using tournament but the same applies for here in multiplayer
		const player2 = document.getElementById('player2');
		window.user.tourUsername = player1.value.trim();
		if (player2.value.trim() == '') return alert("Player2 name is missing!");
		if (player2.value.trim() === player1.value.trim()) return alert("You cannot invite yourself to play!");
		console.log(`Tournament Uername`, window.user.tourUsername);

		// gets all users to check if the player 2 exists or not
		const resJson = await fetch("/api/users", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: `Bearer ${sessionStorage.getItem('jwt')}`
			}
		}).catch(console.error);
		const res = await resJson.json();
		const exists = res.find(user => user.username === player2.value.trim()) || null;
		if (!exists) return alert(`There is no user with the name: ${player2.value.trim()}`);

		console.log(res, exists, exists.id);
		// this can only be made into tournament here we will use the playersIDs to connect them
		//const TourName = document.getElementById('tournamentName');
		//if (TourName.value.trim() == '') return alert("Please add a name to the tournament before starting it!");

		// make some logic to check if this tournament name is available
		// since this is just a normal 1v1 maybe the tournament name can the the 2 ids of the users like
		// (ws/chat/player1ID:player2ID) player1 being the player that created the room and is inviting the other one


		// Show loading indicator or some feedback that we're waiting for players
		// Add a waiting indicator to the UI
		const waitingElement = document.createElement('div');
		waitingElement.id = 'waitingIndicator';
		waitingElement.innerHTML = `<p>Waiting for ${player2.value.trim()} to join... (10s)</p>`;
		document.body.appendChild(waitingElement);
		document.getElementById('playersInfos').style.display = 'none';
		//document.getElementById('waitingForPlayers').style.display = 'block';
		// make the game request to the players to join the websocket (tournament/1v1 game)
		try {
			// Wait for both players to connect
			// Wait for the other player to connect
			const connection = await waitForPlayerConnection(
				player2.value.trim(),
				`${window.user.id}_${exists.id}` // tournament name
			);

			// If we get here, the other player connected successfully
			if (waitingElement) waitingElement.remove();

			// Store the websocket for game communication
			window.gameWebSocket = connection.websocket;
			//await waitForPlayerConnection(player2.value.trim());

			// If we get here, the other player connected successfully
			document.getElementById('waitingForPlayers').style.display = 'none';

			// Show the canvas and proceed with the game
			document.getElementById('playersInfos').style.display = 'none';
			document.getElementById('pong').style.display = 'block';
			document.getElementById('winnerPopup').style.display = 'none';

			// Start the Pong Game
			game();
		} catch (error) {
			// Handle the case where a player didn't connect in time
			// Remove the waiting indicator
			if (waitingElement) waitingElement.remove();
			console.error(error);
			changeContent("pongMulti", 0);
		}
	});

})();

function waitForPlayerConnection(playerName, tourName, timeoutSeconds = 10) {
	return new Promise((resolve, reject) => {
		// Create WebSocket connection using your pattern
		let ws = new WebSocket('wss://' + window.location.host + '/ws/chat/' + tourName + '/');

		// Set up a timer for the timeout
		const timeoutId = setTimeout(() => {
			// Close the websocket connection if it's still open
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			}

			// Show an alert that the player didn't connect in time
			alert(`${playerName} didn't accept the game invitation within ${timeoutSeconds} seconds.`);

			// Reject the promise
			reject(new Error(`${playerName} connection timeout`));
		}, timeoutSeconds * 1000);

		// Handler for when the WebSocket connection is established
		ws.onopen = async function (e) {
			console.log("WebSocket connection established for tournament: " + tourName);

			// Send a message to notify the server that we're waiting for a specific player
			ws.send(JSON.stringify({
				'typeContent': 'waiting_for_player',
				'content': playerName
			}));
			const invRes = await invitePong(playerName).catch(error => {
				console.error(error);
			});
			if (invRes.status === 404) {
				console.log(invRes)
				return;
			}
		};

		// Handler for WebSocket messages
		ws.onmessage = function (e) {
			const data = JSON.parse(e.data);

			// Check if this message indicates the player we're waiting for has connected
			if (data.type === 'player_joined' && data.player_name === playerName) {
				// Clear the timeout since the player connected
				clearTimeout(timeoutId);

				// Resolve the promise with the connected player data
				resolve({
					playerName: data.player_name,
					websocket: ws
				});
			}
		};

		// Handler for WebSocket errors
		ws.onerror = function (e) {
			clearTimeout(timeoutId);
			reject(new Error("WebSocket connection error"));
		};

		// Handler for WebSocket connection close
		ws.onclose = function (e) {
			// Only reject if we haven't already resolved or rejected
			console.log("WebSocket closed unexpectedly:", e.code, e.reason);
			if (timeoutId) {
				clearTimeout(timeoutId);
				reject(new Error("WebSocket connection closed unexpectedly"));
			}
		};
	});
}

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


// Invite user to the game
async function invitePong(friendName) {
	const userID = window.user.id;
	if (userID === null) return;
	const url = `/api/users/${userID}/invite_to_pong/`;
	const response = await fetch(url, {
		method: 'PUT',
		body: JSON.stringify({
			user_to_invite: friendName
		}),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			Authorization: `Bearer ${sessionStorage.getItem('jwt')}`
		}
	});
	if (response.status === 401) {
		await refreshLogin();
		return await invitePong(friendName);
	}
	return response;
}

async function acceptPong(friendName) {
	const userID = window.user.id;
	if (userID === null) return;
	const url = `/api/users/${userID}/accept_pong_invite/`;
	const response = await fetch(url, {
		method: 'PUT',
		body: JSON.stringify({
			user_to_accept: friendName
		}),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			Authorization: `Bearer ${sessionStorage.getItem('jwt')}`
		}
	});
	if (response.status === 401) {
		await refreshLogin();
		return await invitePong(friendName);
	}
	return response;
}