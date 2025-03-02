async function updateOverviewPage() {
	if (_user === null)
		_user = await getUserData();
	document.getElementById('username').innerText = `${i18next.t('overview.greeting')} ${_user?.username}`;
	document.getElementById('user-avatar').src = _avatar;
	document.getElementById('games-played').innerText = `${i18next.t('overview.gamesPlayed')}: ${_user?.games_played}`;
	document.getElementById('wins').innerText = `${i18next.t('overview.wins')}: ${_user?.wins}`;
	document.getElementById('losses').innerText = `${i18next.t('overview.losses')}: ${_user?.losses}`;
	document.getElementById('draws').innerText = `${i18next.t('overview.draws')}: ${_user?.draws}`;
	document.getElementById('pongPlayers').innerText = `${_user?.pong_players ?? 0} ${i18next.t('overview.playersPlaying')}`;
	document.getElementById('onlineFriends').innerText = `${_user?.online_friends ?? 0} ${i18next.t('overview.friendsOnline')}`;

	document.querySelectorAll('[data-i18n]').forEach(element => {
		let key = element.getAttribute('data-i18n');
		element.innerText = i18next.t(key);
	});
}

function sendMessage() {
	const input = document.getElementById('messageInput');
	const messageDisplayArea = document.getElementById('messageDisplayArea');

	if (input.value.trim() !== '') {
		const message = document.createElement('p');
		message.textContent = input.value;
		messageDisplayArea.appendChild(message);

		input.value = '';
		messageDisplayArea.scrollTop = messageDisplayArea.scrollHeight; // Auto-scroll to the bottom
	}
}

var GchatSocket = null; // Declare the WebSocket outside to maintain a single instance

function GChat() {
	//const roomName = JSON.parse(document.getElementById('room-name').textContent);

	// meter na window o roomName
	// este e primeiro adicionado quando se cria o lobby e fica a espera da outro user
	// quando se clica para inicar o jogo abre o roomName

	// window.roomName

	if (GchatSocket && GchatSocket.readyState === WebSocket.OPEN) {
		console.log('WebSocket already open. Skipping GChat initialization.');
		return; // Prevent multiple connections
	}

	GchatSocket = new WebSocket('wss://' + window.location.host + '/ws/chat/' + "gchat" + '/');

	GchatSocket.onopen = function () {
		console.log('WebSocket connection established.');
	};

	GchatSocket.onerror = function (error) {
		console.error('WebSocket error observed:', error);
	};

	GchatSocket.onclose = function (e) {
		console.error('WebSocket closed:', e);
	};


	const messageInput = document.getElementById('messageInput');
	const messageSubmit = document.getElementById('messageBtn');

	messageInput.focus();
	messageInput.onkeyup = function (e) {
		if (e.key === 'Enter') messageSubmit.click();
	};

	messageSubmit.onclick = function (e) {
		const message = messageInput.value.trim();
		if (message.length <= 0) return; // ignore Enter presses that dont have any content in it
		console.log("btn pressed!")
		if (message) {
			GchatSocket.send(JSON.stringify({
				'type': 'message',
				'content': message
			}));
			messageInput.value = '';
		}
	};

	console.log(GchatSocket)
	GchatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const content = data.content;
		const type = data.type;
		switch (type) {
			case "log":
				console.log(content);
				break;
			case "message":
				console.log(content);
				const messageDisplayArea = document.getElementById('messageDisplayArea');
				messageDisplayArea.appendChild(content);
				messageDisplayArea.scrollTop = messageDisplayArea.scrollHeight; // Auto-scroll to the bottom
				break;
			default:
				console.error("Something went wrong!");
				GchatSocket.close();
				changeContent("overview");
				break;
		}
		//console.log(content);
		//document.querySelector('#chat-log').value += (data.message + '\n');
	};

	GchatSocket.onclose = function (e) {
		console.error('Chat socket closed unexpectedly', e.reason);
	};

	/* document.querySelector('#chat-message-input').focus();
	document.querySelector('#chat-message-input').onkeyup = function (e) {
		if (e.key === 'Enter') {  // enter, return
			document.querySelector('#chat-message-submit').click();
		}
	};

	document.querySelector('#chat-message-submit').onclick = function (e) {
		const messageInputDom = document.querySelector('#chat-message-input');
		const message = messageInputDom.value;
		GchatSocket.send(JSON.stringify({
			'message': message
		}));
		messageInputDom.value = '';
	}; */
}
GChat();