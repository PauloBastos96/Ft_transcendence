function startTournament(tourName) {
	let players = [
		document.getElementById("player1").value,
		document.getElementById("player2").value,
		document.getElementById("player3").value,
		document.getElementById("player4").value
	];
	// fetch the actual users

	let ws = new WebSocket('wss://' + window.location.host + '/ws/chat/' + tourName + '/');

	ws.onopen = async function () {
		console.log('WebSocket connection established.');
		const userInfo = await getUserData();
		window.user = userInfo;
		const user = window.user;
		ws.send(JSON.stringify({
			'typeContent': 'log',
			'content': `${user.username} Joined the WS/Tournament`
		}));
	};

	ws.onerror = function (error) {
		console.error('WebSocket error observed:', error);
	};

	ws.onclose = function (e) {
		console.error('WebSocket closed:', e);
	};

	players = players.sort(() => Math.random() - 0.5); // Shuffle players
	
	document.getElementById("round1").innerText = `${players[0]} vs ${players[1]}`;
	document.getElementById("round2").innerText = `${players[2]} vs ${players[3]}`;
}

function playRound(round) {
	let winner = prompt(`Enter winner of ${document.getElementById(round).innerText}:`);
	document.getElementById(round + "Winner").innerText = `Winner: ${winner}`;
	checkFinal();
}

function checkFinal() {
	let winner1 = document.getElementById("round1Winner").innerText.split(": ")[1];
	let winner2 = document.getElementById("round2Winner").innerText.split(": ")[1];
	
	if (winner1 && winner2) {
		document.getElementById("final").innerText = `${winner1} vs ${winner2}`;
	}
}

(() => {
	const TourBtn = document.getElementById('initTournamentBtn');
	const TourName = document.getElementById('tournamentName');
	const round1 = document.getElementById('playRoundBtn1');
	const round2 = document.getElementById('playRoundBtn2');

	if (!TourBtn) console.log("Couldnt get the initTournament Button");
	TourBtn.onclick = function (e) {
		console.log('Tournament Started!');
		console.log(TourName.value.trim());
		// i made REQUIRED the tournament name cuz im thinking of make it the name to connect all the players in the socket
		// dont forget to check if the tournament name already exists, is being used etc...
		if (TourName.value.trim() == '') return alert("Please add a name to the tournament before starting it!");
		startTournament(TourName.value.trim());
	}

	round1.onclick = function (e) {
		console.log('Round1 Started!');
		playRound('round1');
	}

	round2.onclick = function (e) {
		console.log('Round2 Started!');
		playRound('round2');
	}
})();