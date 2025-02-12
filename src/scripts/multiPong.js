function main() {
	//const roomName = JSON.parse(document.getElementById('room-name').textContent);

	// meter na window o roomName
	// este e primeiro adicionado quando se cria o lobby e fica a espera da outro user
	// quando se clica para inicar o jogo abre o roomName

	// window.roomName

	const chatSocket = new WebSocket('wss://'+ window.location.host + '/ws/chat/' + "test" + '/');

	console.log(chatSocket)
	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		const content = data.content;
		const type = data.typeContent;
		switch (type) {
			case "log":
				console.log(content);
			break;
			default:
				console.error("Something went wrong!");
				chatSocket.close();
				changeContent("overview");
				break;
		}
		//console.log(content);
		//document.querySelector('#chat-log').value += (data.message + '\n');
	};

	chatSocket.onclose = function (e) {
		console.error('Chat socket closed unexpectedly');
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
		chatSocket.send(JSON.stringify({
			'message': message
		}));
		messageInputDom.value = '';
	}; */
}
main();